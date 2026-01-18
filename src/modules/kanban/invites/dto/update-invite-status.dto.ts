import { IsEnum } from 'class-validator';
import { InviteStatus } from '../enums/invite-status.enum';

export class UpdateInviteStatusDto {
  @IsEnum(InviteStatus)
  status: InviteStatus;
}
