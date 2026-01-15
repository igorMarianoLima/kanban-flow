import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { In, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { UserRequestDto } from 'src/modules/auth/dto/user-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardColumnsService } from '../board-columns/board-columns.service';
import { BoardService } from '../board/board.service';
import { FindAllTasksFiltersDto } from './dto/request/find-all-tasks-filters.dto';
import { PagedParamsDto } from 'src/common/dto/paged-params.dto';

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

  findAll(params?: FindAllTasksFiltersDto) {
    const { page_number = 0, page_size = 10 } = params ?? {};

    return this.repository.find({
      where: {
        ...(params?.assigned_to && {
          assignee: {
            id: In(params.assigned_to),
          },
        }),
        ...(params?.created_by && {
          creator: {
            id: In(params.created_by),
          },
        }),
        column: {
          ...(params?.column_ids && {
            id: In(params.column_ids),
          }),
          ...(params?.board_ids && {
            board: {
              id: In(params?.board_ids),
            },
          }),
          ...(params?.statuses && {
            status: In(params.statuses),
          }),
        },
      },
      take: page_size,
      skip: page_size * page_number,
    });
  }

  async findOne({ id, user }: { id: string; user: UserRequestDto }) {
    const task = await this.repository
      .createQueryBuilder('task')
      .innerJoin('task.creator', 'creator')
      .innerJoin('task.assignee', 'assignee')
      .innerJoin('task.column', 'column')
      .innerJoin('column.board', 'board')
      .innerJoin('board.members', 'member')
      .where('task.id = :id', { id })
      .andWhere('member.id = :userId', { userId: user.id })
      .select([
        'task.id',
        'task.title',
        'task.description',
        'creator.id',
        'creator.name',
        'assignee.id',
        'assignee.name',
        'column.id',
        'column.name',
        'column.status',
        'task.createdAt',
        'task.updatedAt',
      ])
      .getOne();

    if (!task) throw new NotFoundException('Task not found');

    return task!;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }

  findByAssignedUser({ id }: { id: string; params?: PagedParamsDto }) {
    return this.findAll({
      assigned_to: [id],
    });
  }

  findByCreator({ id }: { id: string; params?: PagedParamsDto }) {
    return this.findAll({
      created_by: [id],
    });
  }
}
