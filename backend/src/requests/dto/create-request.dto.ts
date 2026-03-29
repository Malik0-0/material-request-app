import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateMaterialDetailDto } from '../../material-details/dto/create-material-detail.dto';

export class CreateRequestDto {
  @IsDateString()
  request_date!: string;

  @IsString()
  @IsNotEmpty()
  requester_name!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMaterialDetailDto)
  materials!: CreateMaterialDetailDto[];
}
