import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { UpdateBoardColumnDto } from './dto/update-board-column.dto';
import { Repository } from 'typeorm';
import { BoardColumn } from './entities/board-column.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRequestDto } from 'src/modules/auth/dto/user-request.dto';
import { BoardService } from '../board/board.service';

@Injectable()
export class BoardColumnsService {
  constructor(
    @InjectRepository(BoardColumn)
    private readonly repository: Repository<BoardColumn>,

    @Inject(forwardRef(() => BoardService))
    private readonly boardService: BoardService,
  ) {}

  async create({
    user,
    boardId,
    payload,
  }: {
    user: UserRequestDto;
    boardId: string;
    payload: CreateBoardColumnDto;
  }) {
    const board = await this.boardService.findOne({
      id: boardId,
      user,
    });

    if (board.owner.id !== user.id) {
      throw new ForbiddenException('You cannot access this resource');
    }

    const column = this.repository.create({
      ...payload,
      board: {
        id: board.id,
      },
    });

    return this.repository.save(column);
  }

  async findAll({ id, user }: { id: string; user: UserRequestDto }) {
    const isMember = await this.boardService.isMember({
      boardId: id,
      userId: user.id,
    });

    if (!isMember) {
      throw new ForbiddenException("You aren't a member of this board");
    }

    let query = this.repository
      .createQueryBuilder('column')
      .innerJoin('column.board', 'board');

    query = query.andWhere('board.id = :boardId', { boardId: id });

    query = query.select([
      'column.id',
      'column.name',
      'column.status',
      'column.createdAt',
      'column.updatedAt',
      'board.id',
      'board.name',
    ]);

    return await query.getMany();
  }

  async findOne({ id, user }: { id: string; user: UserRequestDto }) {
    let query = this.repository
      .createQueryBuilder('column')
      .innerJoin('column.board', 'board')
      .innerJoin('board.members', 'member')
      .andWhere('member.id = :userId', { userId: user.id })
      .andWhere('column.id = :id', { id });

    query = query.select([
      'column.id',
      'column.name',
      'column.status',
      'column.createdAt',
      'column.updatedAt',
      'board.id',
      'board.name',
    ]);

    const column = await query.getOne();

    if (!column) throw new NotFoundException('Column not found');

    return column;
  }

  async update({
    id,
    payload,
    user,
  }: {
    id: string;
    payload: UpdateBoardColumnDto;
    user: UserRequestDto;
  }) {
    const column = await this.findOne({
      id,
      user,
    });

    column.name = payload.name ?? column.name;
    column.status = payload.status ?? column.status;

    return this.repository.save(column);
  }

  async remove(id: string) {
    const column = await this.repository.findOneBy({
      id,
    });

    if (!column) throw new NotFoundException('Column not found');

    return this.repository.remove(column);
  }

  async getBoardByColumnId({ id }: { id: string }) {
    const board = (
      await this.repository.findOne({ where: { id }, relations: ['board'] })
    )?.board;

    if (!board) throw new NotFoundException('Column not found');

    return board;
  }
}
