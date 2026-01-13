import { Module } from '@nestjs/common';
import { BoardModule } from './board/board.module';
import { UserModule } from './user/user.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [BoardModule, UserModule, TasksModule],
})
export class KanbanModule {}
