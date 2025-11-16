import { IsOptional, IsIn, IsString } from 'class-validator';

export class ReportQueryDto {
  @IsOptional()
  @IsString()
  eager?: 'true' | 'false'; // eager=true to include relations

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  search?: string; // optional simple search usage (depends on config)

  @IsOptional()
  @IsString()
  orderBy?: string; // e.g. "score:DESC" or "name:ASC"

//   @IsOptional()
//   @IsString()
//   @IsIn(['excel', 'csv'])
//   export?: 'excel' | 'csv'; // export type
}
