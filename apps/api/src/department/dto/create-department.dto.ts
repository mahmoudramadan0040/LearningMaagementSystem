import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateDepartmentDto {
  @ApiProperty({
    example: 'Computer Science',
    description: 'Name of the department',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Industry and energy Faculty',
    description: 'Faculty to which the department belongs',
  })
  @IsNotEmpty()
  @IsString()
  Faculty: string;
}
