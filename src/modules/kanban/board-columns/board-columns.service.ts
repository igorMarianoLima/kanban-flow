import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { UpdateBoardColumnDto } from './dto/update-board-column.dto';
import { Repository } from 'typeorm';
import { BoardColumn } from './entities/board-column.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BoardColumnsService {
  constructor(
    @InjectRepository(BoardColumn)
    private readonly repository: Repository<BoardColumn>,
  ) {}

  create(payload: CreateBoardColumnDto) {
    const column = this.repository.create({
      ...payload,
      board: {
        id: payload.boardId,
      },
    });

    return this.repository.save(column);
  }

  findAll() {
    return this.repository.find({
      relations: ['board'],
      select: {
        board: {
          id: true,
          name: true,
        },
      },
    });
  }

  async findOne(id: string) {
    const column = await this.repository.findOneBy({
      id,
    });

    if (!column) throw new NotFoundException('Column not found');

    return column;
  }

  async update(id: string, payload: UpdateBoardColumnDto) {
    const column = await this.repository.preload({
      ...payload,
      id,
    });

    if (!column) throw new NotFoundException('Column not found');

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
