import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { UserRequestDto } from 'src/modules/auth/dto/user-request.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
  ) {}

  create({ user, payload }: { user: UserRequestDto; payload: CreateTaskDto }) {
    const task = this.repository.create({
      ...payload,
      creator: {
        id: user.id,
      },
      column: {
        id: payload.columnId,
      },
      assignee: {
        id: payload.responsibleId,
      },
    });

    return this.repository.save(task);
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
