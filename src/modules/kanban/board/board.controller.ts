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
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { User } from 'src/modules/auth/decorators/user.decorator';
import { UserRequestDto } from 'src/modules/auth/dto/user-request.dto';
import { AddMembersDto } from './dto/add-members.dto';

@UseGuards(AuthGuard)
@Controller('kanban/board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  create(@User() user: UserRequestDto, @Body() payload: CreateBoardDto) {
    return this.boardService.create({ user, payload });
  }

  @Get()
  findAll(@User() user: UserRequestDto) {
    return this.boardService.findAll(user);
  }

  @Get(':id')
  findOne(@User() user: UserRequestDto, @Param('id') id: string) {
    return this.boardService.findOne({ id, user });
  }

  @Patch(':id')
  update(
    @User() user: UserRequestDto,
    @Param('id') id: string,
    @Body() payload: UpdateBoardDto,
  ) {
    return this.boardService.update({ id, payload, user });
  }

  @Delete(':id')
  remove(@User() user: UserRequestDto, @Param('id') id: string) {
    return this.boardService.remove({
      id,
      user,
    });
  }

  @Post(':id/members')
  addMembers(
    @User() user: UserRequestDto,
    @Param('id') boardId: string,
    @Body() payload: AddMembersDto,
  ) {
    return this.boardService.addMembers({
      user,
      boardId,
      userIds: payload.ids,
    });
  }
}
