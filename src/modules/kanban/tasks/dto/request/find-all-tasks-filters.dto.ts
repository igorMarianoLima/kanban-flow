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
import { StrintToArray } from 'src/common/decorators/string-to-array.decorator';
import { PagedParamsDto } from 'src/common/dto/paged-params.dto';
import { BoardColumnStatus } from 'src/modules/kanban/board-columns/enums/board-column-status.enum';

export class FindAllTasksFiltersDto extends PagedParamsDto {
  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  @StrintToArray()
  created_by?: string[];

  @IsOptional()
  @IsString({ each: true })
  @StrintToArray()
  assigned_to?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @StrintToArray()
  board_ids?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @StrintToArray()
  column_ids?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(BoardColumnStatus, { each: true })
  @StrintToArray()
  statuses?: BoardColumnStatus[];
}
