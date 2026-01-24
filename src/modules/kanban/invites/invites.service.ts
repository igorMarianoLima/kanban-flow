import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Invite } from './entities/invite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SendInviteDto } from './dto/send-invite.dto';
import { UserRequestDto } from 'src/modules/auth/dto/user-request.dto';
import { BoardService } from '../board/board.service';
import { UserService } from 'src/modules/user/user.service';
import { randomUUID } from 'crypto';
import { addDays, isPast } from 'date-fns';
import { InviteStatus } from './enums/invite-status.enum';
import { ConfigService } from 'src/modules/config/config.service';
import { UpdateInviteStatusDto } from './dto/update-invite-status.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmailEvent } from 'src/modules/events/enums/email-event.enum';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(Invite)
    private readonly repository: Repository<Invite>,

    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
    private readonly boardService: BoardService,
    private readonly usersService: UserService,
  ) {}

  async sendInvite({
    user,
    boardId,
    payload,
  }: {
    user: UserRequestDto;
    boardId: string;
    payload: SendInviteDto;
  }) {
    const board = await this.boardService.findOne({
      id: boardId,
      user,
    });

    const creator = board.owner;
    const token = randomUUID();

    if (creator.id !== user.id) {
      throw new ForbiddenException('You cannot access this resource');
    }

    const invite = this.repository.create({
      email: payload.email,
      board: board,
      creator: {
        id: creator.id,
      },
      status: InviteStatus.PENDING,
      expiresAt: addDays(new Date(), 2),
      token,
    });

    const userToInvite = await this.usersService
      .findOneByEmail(payload.email)
      .catch(() => null);

    if (userToInvite) {
      const alreadyIsMember = await this.boardService.isMember({
        userId: userToInvite.id,
        boardId,
      });

      if (alreadyIsMember) {
        throw new UnprocessableEntityException('User already is member');
      }

      invite.user = userToInvite;
    }

    await this.repository.save(invite);

    const apiUrl = this.configService.getEnvironment().apiUrl;
    const inviteLink = new URL(
      `/kanban/${board.id}/invites/accept?token=${token}`,
      apiUrl,
    );

    this.eventEmitter.emit(EmailEvent.SEND_EMAIL, {
      to: payload.email,
      subject: `Invite to join to ${board.name}`,
      text: `You received a invite from ${creator.name} to join in ${board.name}. Accept using the following link: ${inviteLink}`,
    });
  }

  async findOneByToken({ token }: { token: string }) {
    const invite = await this.repository.findOne({
      where: {
        token,
      },
    });

    if (!invite) throw new NotFoundException('Invite not found');

    return invite;
  }

  async updateInviteStatus({
    token,
    user,
    payload,
  }: {
    user: UserRequestDto;
    token: string;
    payload: UpdateInviteStatusDto;
  }) {
    const invite = await this.findOneByToken({
      token,
    });

    const canUpdate = invite.email === user.email;
    if (!canUpdate) {
      throw new ForbiddenException('You cannot access this resource');
    }

    const isExpired = isPast(invite.expiresAt);
    if (isExpired) {
      if (invite.status !== InviteStatus.EXPIRED) {
        invite.status = InviteStatus.EXPIRED;
        await this.repository.save(invite);
      }

      throw new UnprocessableEntityException('Expired invite');
    }

    if (invite.status !== InviteStatus.PENDING) {
      throw new UnprocessableEntityException('Invite cannot be updated');
    }

    if (payload.status === InviteStatus.ACCEPTED) {
      invite.acceptedAt = new Date();
    }

    invite.status = payload.status;

    await this.boardService.addMembers({
      user,
      boardId: invite.board.id,
      userIds: [user.id],
    });

    await this.repository.save(invite);
  }
}
