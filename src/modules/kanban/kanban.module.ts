import { Module } from '@nestjs/common';
import { BoardModule } from './board/board.module';
import { TasksModule } from './tasks/tasks.module';
import { BoardColumnsModule } from './board-columns/board-columns.module';
import { InvitesModule } from './invites/invites.module';

@Module({
  imports: [BoardModule, TasksModule, BoardColumnsModule, InvitesModule],
})
export class KanbanModule {}
