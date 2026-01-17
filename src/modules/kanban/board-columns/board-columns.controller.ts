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
import { User } from 'src/modules/auth/decorators/user.decorator';
import { UserRequestDto } from 'src/modules/auth/dto/user-request.dto';

@Controller('kanban/:boardId/columns')
@UseGuards(AuthGuard)
export class BoardColumnsController {
  constructor(private readonly boardColumnsService: BoardColumnsService) {}

  @Post()
  create(
    @User() user: UserRequestDto,
    @Param('boardId') boardId: string,
    @Body() payload: CreateBoardColumnDto,
  ) {
    return this.boardColumnsService.create({
      boardId,
      payload,
      user,
    });
  }

  @Get()
  findAll(@User() user: UserRequestDto, @Param('boardId') boardId: string) {
    return this.boardColumnsService.findAll({
      id: boardId,
      user,
    });
  }

  @Get(':id')
  findOne(@User() user: UserRequestDto, @Param('id') id: string) {
    return this.boardColumnsService.findOne({
      id,
      user,
    });
  }

  @Patch(':id')
  update(
    @User() user: UserRequestDto,
    @Param('id') id: string,
    @Body() payload: UpdateBoardColumnDto,
  ) {
    return this.boardColumnsService.update({ id, payload, user });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardColumnsService.remove(id);
  }
}
