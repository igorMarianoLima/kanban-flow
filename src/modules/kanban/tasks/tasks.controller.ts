import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { User } from 'src/modules/auth/decorators/user.decorator';
import { UserRequestDto } from 'src/modules/auth/dto/user-request.dto';
import { FindAllTasksFiltersDto } from './dto/request/find-all-tasks-filters.dto';

@Controller('kanban/tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@User() user: UserRequestDto, @Body() payload: CreateTaskDto) {
    return this.tasksService.create({
      user,
      payload,
    });
  }

  @Get()
  findAll(
    @Query()
    params?: FindAllTasksFiltersDto,
  ) {
    return this.tasksService.findAll(params);
  }

  @Get('assigned-to-me')
  getTasksAssignedToMe(@User() user: UserRequestDto) {
    return this.tasksService.findByAssignedUser({
      id: user.id,
    });
  }

  @Get('created-by-me')
  getTasksCreatedByMe(@User() user: UserRequestDto) {
    return this.tasksService.findByCreator({
      id: user.id,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
