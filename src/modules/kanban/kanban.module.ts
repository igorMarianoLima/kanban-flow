import { Module } from '@nestjs/common';
import { BoardModule } from './board/board.module';
import { UserModule } from './user/user.module';
import { TasksModule } from './tasks/tasks.module';
import { BoardColumnsModule } from './board-columns/board-columns.module';

@Module({
  imports: [BoardModule, UserModule, TasksModule, BoardColumnsModule],
})
export class KanbanModule {}
