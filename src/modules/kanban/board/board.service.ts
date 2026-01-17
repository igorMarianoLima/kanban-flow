import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardColumnsService } from '../board-columns/board-columns.service';
import { UserRequestDto } from 'src/modules/auth/dto/user-request.dto';
import { UserService } from 'src/modules/user/user.service';
import { AddMembersDto } from './dto/add-members.dto';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly repository: Repository<Board>,

    private readonly columnsService: BoardColumnsService,
    private readonly usersService: UserService,
  ) {}

  async create({
    user,
    payload,
  }: {
    user: UserRequestDto;
    payload: CreateBoardDto;
  }) {
    try {
      const board = this.repository.create({
        ...payload,
        owner: {
          id: user.id,
        },
      });

      await this.repository.save(board);

      // Add all members from payload and add board owner as member
      const members = [...payload.memberIds, user.id];

      await this.addMembers({
        user,
        boardId: board.id,
        userIds: members,
      });

      await Promise.all(
        payload.columns.map((column) =>
          this.columnsService.create({
            boardId: board.id,
            payload: column,
          }),
        ),
      );

      return board;
    } catch (err) {
      throw err;
    }
  }

  findAll(user: UserRequestDto) {
    return this.repository.findBy({
      owner: {
        id: user.id,
      },
    });
  }

  async findOne({ id, user }: { id: string; user: UserRequestDto }) {
    const column = await this.repository.findOne({
      where: {
        id,
        owner: {
          id: user.id,
        },
      },
      relations: ['members', 'owner', 'columns'],
      select: {
        members: {
          id: true,
          name: true,
        },
        owner: {
          id: true,
          name: true,
        },
        columns: {
          id: true,
          name: true,
          status: true,
        },
      },
    });

    if (!column) throw new NotFoundException('Board not found');

    return column;
  }

  async update({
    id,
    payload,
    user,
  }: {
    id: string;
    payload: UpdateBoardDto;
    user: UserRequestDto;
  }) {
    let board = await this.repository.findOneBy({
      id,
      owner: {
        id: user.id,
      },
    });

    if (!board) throw new NotFoundException('Board not found');

    board.name = payload.name ?? board.name;
    board.description = payload.description ?? board.description;

    await this.repository.save(board);
  }

  async remove({ id, user }: { id: string; user: UserRequestDto }) {
    const board = await this.repository.findOneBy({
      id,
      owner: {
        id: user.id,
      },
    });

    if (!board) throw new NotFoundException('Board not found');

    return this.repository.remove(board);
  }

  async addMembers({
    user,
    boardId,
    userIds,
  }: {
    user: UserRequestDto;
    boardId: string;
    userIds: string[];
  }) {
    const board = await this.findOne({ id: boardId, user });

    const users = await this.usersService.findManyById(userIds);

    if (!users.length) return board;

    const existingIds = new Set(board.members?.map((m) => m.id));
    const newMembers = users.filter((u) => !existingIds.has(u.id));

    if (!newMembers) return board;

    board.members.push(...newMembers);

    return this.repository.save(board);
  }

  async isMember({ userId, boardId }: { userId: string; boardId: string }) {
    return this.repository.exists({
      where: {
        id: boardId,
        members: {
          id: userId,
        },
      },
    });
  }
}
