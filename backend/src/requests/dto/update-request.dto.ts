import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

export const REQUEST_STATUS_VALUES = [
  'pending',
  'approved',
  'rejected',
] as const;

export class UpdateRequestDto {
  @IsOptional()
  @IsDateString()
  request_date?: string;

  @IsOptional()
  @IsString()
  requester_name?: string;

  @IsOptional()
  @IsIn(REQUEST_STATUS_VALUES)
  status?: (typeof REQUEST_STATUS_VALUES)[number];
}
