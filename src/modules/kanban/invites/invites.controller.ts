import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InvitesService } from './invites.service';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { User } from 'src/modules/auth/decorators/user.decorator';
import { UserRequestDto } from 'src/modules/auth/dto/user-request.dto';
import { SendInviteDto } from './dto/send-invite.dto';
import { InviteStatus } from './enums/invite-status.enum';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@Controller('kanban/:boardId/invites')
@UseGuards(AuthGuard)
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  sendInvite(
    @Param('boardId') boardId: string,
    @Body() payload: SendInviteDto,
    @User() user: UserRequestDto,
  ) {
    return this.invitesService.sendInvite({
      boardId,
      payload,
      user,
    });
  }

  @Get('accept')
  @Public()
  acceptInvite(@User() user: UserRequestDto, @Query('token') token: string) {
    return this.invitesService.updateInviteStatus({
      user,
      token,
      payload: {
        status: InviteStatus.ACCEPTED,
      },
    });
  }
}
