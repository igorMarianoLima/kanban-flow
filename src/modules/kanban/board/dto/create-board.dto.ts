import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateBoardColumnDto } from '../../board-columns/dto/create-board-column.dto';
import { OmitType } from '@nestjs/mapped-types';

export class CreateBoardDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({
    each: true,
  })
  @Type(() => OmitType(CreateBoardColumnDto, ['boardId']))
  columns: CreateBoardColumnDto[];

  @IsArray()
  @IsUUID(undefined, {
    each: true,
  })
  memberIds: string[];
}
