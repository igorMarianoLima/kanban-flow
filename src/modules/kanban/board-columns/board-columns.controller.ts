import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BoardColumnsService } from './board-columns.service';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { UpdateBoardColumnDto } from './dto/update-board-column.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

@Controller('kanban/:boardId/columns')
@UseGuards(AuthGuard)
export class BoardColumnsController {
  constructor(private readonly boardColumnsService: BoardColumnsService) {}

  @Post()
  create(
    @Param('boardId') boardId: string,
    @Body() payload: CreateBoardColumnDto,
  ) {
    return this.boardColumnsService.create({
      boardId,
      payload,
    });
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
