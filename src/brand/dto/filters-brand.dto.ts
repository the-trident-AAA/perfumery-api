import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FiltersBrandDto {
  @ApiProperty({
    description: 'Representa el identificador único de la marca',
    type: 'string',
    required: false,
  })
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'Representa el nombre de la marca',
    type: 'string',
    required: false,
  })
  @IsOptional()
  name?: string;
}
