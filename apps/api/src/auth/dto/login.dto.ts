import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ description: 'Email or Username', example: 'john@example.com' })
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @ApiProperty({ description: 'User password', example: '123456' })
  @IsNotEmpty()
  @IsString()
  password: string;
}