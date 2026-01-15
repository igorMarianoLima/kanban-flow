import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { BoardColumnsModule } from '../board-columns/board-columns.module';
import { BoardModule } from '../board/board.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), BoardColumnsModule, BoardModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
