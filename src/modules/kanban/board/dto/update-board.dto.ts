import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto';

export class UpdateBoardDto extends PartialType(
  OmitType(CreateBoardDto, ['ownerId', 'memberIds']),
) {}
