import {
  ForbiddenException,
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
import { User } from 'src/modules/user/entities/user.entity';
import { BoardColumn } from '../board-columns/entities/board-column.entity';

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

  findAll({
    user,
    params = {},
  }: {
    user: UserRequestDto;
    params?: FindAllTasksFiltersDto;
  }) {
    const { page_number = 0, page_size = 10 } = params;

    let query = this.repository
      .createQueryBuilder('task')
      .leftJoin('task.assignee', 'assignee')
      .leftJoin('task.creator', 'creator')
      .innerJoin('task.column', 'column')
      .innerJoin('column.board', 'board')
      .innerJoin('board.members', 'member');

    // Only return tasks where the current user is member of board
    query.andWhere('member.id = :id', { id: user.id });

    if (params.assigned_to) {
      query = query.andWhere('assignee.id IN (:...ids)', {
        ids: params.assigned_to,
      });
    }

    if (params.created_by) {
      query = query.andWhere('creator.id IN (:...ids)', {
        ids: params.created_by,
      });
    }

    if (params.column_ids) {
      query = query.andWhere('column.id IN (:...ids)', {
        ids: params.column_ids,
      });
    }

    if (params.statuses) {
      query = query.andWhere('column.status IN (:...statuses)', {
        statuses: params.statuses,
      });
    }

    if (params.board_ids) {
      query = query.andWhere('board.id IN (:...ids)', {
        ids: params.board_ids,
      });
    }

    query = query.limit(page_size).offset(page_number * page_size);
    query = query.select([
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
    ]);

    return query.getMany();
  }

  async findOne({ id, user }: { id: string; user: UserRequestDto }) {
    const task = await this.repository
      .createQueryBuilder('task')
      .innerJoin('task.creator', 'creator')
      .innerJoin('task.assignee', 'assignee')
      .innerJoin('task.column', 'column')
      .innerJoin('column.board', 'board')
      .innerJoin('board.members', 'member')
      .innerJoin('board.owner', 'board_owner')
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
        'board.id',
        'board.name',
        'board.description',
        'board_owner.id',
        'board_owner.name',
        'task.createdAt',
        'task.updatedAt',
      ])
      .getOne();

    if (!task) throw new NotFoundException('Task not found');

    return task!;
  }

  async update({
    id,
    payload,
    user,
  }: {
    id: string;
    payload: UpdateTaskDto;
    user: UserRequestDto;
  }) {
    const task = await this.findOne({
      id,
      user,
    });

    task.title = payload.title || task.title;
    task.description = payload.description || task.description;

    if (payload.responsibleId) {
      const isMember = await this.boardService.isMember({
        userId: payload.responsibleId,
        boardId: task.column.board.id,
      });

      if (!isMember) {
        throw new ForbiddenException(
          'Responsible should be a member of the current board',
        );
      }

      task.assignee = {
        id: payload.responsibleId,
      } as User;
    }

    if (payload.columnId) {
      const board = await this.boardColumnsService.getBoardByColumnId({
        id: payload.columnId,
      });

      if (board.id !== task.column.board.id) {
        throw new ForbiddenException('Cannot move task to another board');
      }

      task.column = {
        id: payload.columnId,
      } as BoardColumn;
    }

    return this.repository.save(task);
  }

  async remove({ id, user }: { id: string; user: UserRequestDto }) {
    const task = await this.findOne({
      id,
      user,
    });

    const isCreator = user.id === task.creator?.id;
    const isBoardOwner = user.id === task.column.board.owner.id;

    if (!isCreator && !isBoardOwner) {
      throw new ForbiddenException('You cannot access this resource');
    }

    await this.repository.softDelete(task.id);
  }

  findByAssignedUser({
    id,
    user,
    params,
  }: {
    id: string;
    user: UserRequestDto;
    params?: PagedParamsDto;
  }) {
    return this.findAll({
      user,
      params: {
        ...params,
        assigned_to: [id],
      },
    });
  }

  findByCreator({
    id,
    user,
    params,
  }: {
    id: string;
    user: UserRequestDto;
    params?: PagedParamsDto;
  }) {
    return this.findAll({
      user,
      params: {
        ...params,
        created_by: [id],
      },
    });
  }
}
