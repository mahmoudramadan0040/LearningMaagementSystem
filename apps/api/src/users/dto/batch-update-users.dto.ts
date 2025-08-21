// batch-update-user.dto.ts
import { IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateUserDto } from './update-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BatchUpdateItem {
  @ApiProperty({ example: 'e7c2d6d0-5c9f-4d8d-a3a6-1f16a8148d01' })
  @IsUUID()
  id: string;

  @ApiProperty({ type: UpdateUserDto })
  @ValidateNested()
  @Type(() => UpdateUserDto)
  data: UpdateUserDto;
}

export class BatchUpdateUserDto {
  @ApiProperty({ type: [BatchUpdateItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BatchUpdateItem)
  updates: BatchUpdateItem[];
}
