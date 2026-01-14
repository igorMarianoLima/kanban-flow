import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardColumnsService } from '../board-columns/board-columns.service';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly repository: Repository<Board>,

    private readonly columnsService: BoardColumnsService,
  ) {}

  async create(payload: CreateBoardDto) {
    try {
      const board = this.repository.create(payload);
      await this.repository.save(board);

      await Promise.all(
        payload.columns.map((column) =>
          this.columnsService.create({
            ...column,
            boardId: board.id,
          }),
        ),
      );

      return board;
    } catch (err) {
      throw err;
    }
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: string) {
    const column = await this.repository.findOneBy({
      id,
    });

    if (!column) throw new NotFoundException('Board not found');

    return column;
  }

  async update(id: string, payload: UpdateBoardDto) {
    const board = await this.repository.preload({
      ...payload,
      id,
    });

    if (!board) throw new NotFoundException('Board not found');
  }

  async remove(id: string) {
    const board = await this.repository.findOneBy({
      id,
    });

    if (!board) throw new NotFoundException('Board not found');

    return this.repository.remove(board);
  }
}
