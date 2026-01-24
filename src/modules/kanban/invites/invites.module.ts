import { Module } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invite } from './entities/invite.entity';
import { BoardModule } from '../board/board.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Invite]), BoardModule, UserModule],
  controllers: [InvitesController],
  providers: [InvitesService],
})
export class InvitesModule {}
