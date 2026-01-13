import { Injectable } from '@nestjs/common';
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
    return `This action returns all boardColumns`;
  }

  findOne(id: number) {
    return `This action returns a #${id} boardColumn`;
  }

  update(id: number, updateBoardColumnDto: UpdateBoardColumnDto) {
    return `This action updates a #${id} boardColumn`;
  }

  remove(id: number) {
    return `This action removes a #${id} boardColumn`;
  }
}
