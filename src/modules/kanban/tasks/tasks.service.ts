import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { UserRequestDto } from 'src/modules/auth/dto/user-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardColumnsService } from '../board-columns/board-columns.service';
import { BoardService } from '../board/board.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,

    private readonly boardColumnsService: BoardColumnsService,
    private readonly boardService: BoardService,
  ) {}

  async create({
    user,
    payload,
  }: {
    user: UserRequestDto;
    payload: CreateTaskDto;
  }) {
    const board = await this.boardColumnsService.getBoardByColumnId({
      id: payload.columnId,
    });

    const creatorIsMember = await this.boardService.isMember({
      userId: user.id,
      boardId: board.id,
    });

    if (!creatorIsMember) {
      throw new UnprocessableEntityException(
        'Creator must be a member of the board',
      );
    }

    const responsibleIsMember = await this.boardService.isMember({
      boardId: board.id,
      userId: payload.responsibleId,
    });

    if (!responsibleIsMember) {
      throw new UnprocessableEntityException(
        'Assignee must be a member of the board',
      );
    }

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

  findByAssignedUser({ id }: { id: string }) {
    return this.repository.find({
      where: {
        assignee: {
          id,
        },
      },
    });
  }

  findByCreator({ id }: { id: string }) {
    return this.repository.find({
      where: {
        creator: {
          id,
        },
      },
    });
  }
}
