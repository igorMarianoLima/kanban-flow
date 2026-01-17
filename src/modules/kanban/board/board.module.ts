import { forwardRef, Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardColumnsModule } from '../board-columns/board-columns.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    forwardRef(() => BoardColumnsModule),
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}
