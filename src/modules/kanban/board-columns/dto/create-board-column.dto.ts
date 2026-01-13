import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { BoardColumnStatus } from '../enums/board-column-status.enum';

export class CreateBoardColumnDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsEnum(BoardColumnStatus)
  status: BoardColumnStatus;

  @IsUUID()
  boardId: string;
}
