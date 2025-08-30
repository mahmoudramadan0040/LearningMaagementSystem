import { ApiPropertyOptional } from "@nestjs/swagger";

export class CreateSubjectMaterialDto {
  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'string' },
  })
  links?: Record<string, string>;
  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'string' },
  })
  notes?: Record<string, string>;
}
