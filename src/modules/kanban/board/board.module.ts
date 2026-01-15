import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardColumnsModule } from '../board-columns/board-columns.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Board]), BoardColumnsModule, UserModule],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
