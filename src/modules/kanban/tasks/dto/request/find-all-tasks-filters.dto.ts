import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PagedParamsDto } from 'src/common/dto/paged-params.dto';
import { BoardColumnStatus } from 'src/modules/kanban/board-columns/enums/board-column-status.enum';

export class FindAllTasksFiltersDto extends PagedParamsDto {
  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value?.split(',');
    return value;
  })
  created_by?: string[];

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value?.split(',');
    return value;
  })
  assigned_to?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value?.split(',');
    return value;
  })
  board_ids?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value?.split(',');
    return value;
  })
  column_ids?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(BoardColumnStatus, { each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value?.split(',');
    return value;
  })
  statuses?: BoardColumnStatus[];
}
