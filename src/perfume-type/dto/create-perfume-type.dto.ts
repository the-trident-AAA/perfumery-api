import { ApiProperty } from '@nestjs/swagger';

export class CreatePerfumeTypeDto {
  @ApiProperty({
    description: 'Representa el nombre del tipo de perfume',
    type: 'string',
    required: true,
  })
  name: string;
}
