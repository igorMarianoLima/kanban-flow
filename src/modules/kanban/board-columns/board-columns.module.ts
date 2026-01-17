import { forwardRef, Module } from '@nestjs/common';
import { BoardColumnsService } from './board-columns.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardColumn } from './entities/board-column.entity';
import { BoardColumnsController } from './board-columns.controller';
import { BoardModule } from '../board/board.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardColumn]),
    forwardRef(() => BoardModule),
  ],
  controllers: [BoardColumnsController],
  providers: [BoardColumnsService],
  exports: [BoardColumnsService],
})
export class BoardColumnsModule {}
