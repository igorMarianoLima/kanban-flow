import { IsEmail, IsString } from 'class-validator';

export class SendInviteDto {
  @IsString()
  @IsEmail()
  email: string;
}
