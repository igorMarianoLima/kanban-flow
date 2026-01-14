import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BoardColumnsService } from './board-columns.service';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { UpdateBoardColumnDto } from './dto/update-board-column.dto';

@Controller('kanban/columns')
export class BoardColumnsController {
  constructor(private readonly boardColumnsService: BoardColumnsService) {}

  @Post()
  create(@Body() payload: CreateBoardColumnDto) {
    return this.boardColumnsService.create(payload);
  }

  @Get()
  findAll() {
    return this.boardColumnsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardColumnsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBoardColumnDto: UpdateBoardColumnDto,
  ) {
    return this.boardColumnsService.update(id, updateBoardColumnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardColumnsService.remove(id);
  }
}
