import { ApiProperty } from '@nestjs/swagger';

export class ScentResponse {
  @ApiProperty({
    description: 'Representa el identificador único del aroma del perfume',
    type: 'number',
    required: true,
  })
  id: number;

  @ApiProperty({
    description: 'Representa el nombre del aroma del perfume',
    type: 'string',
    required: true,
  })
  name: string;
}
