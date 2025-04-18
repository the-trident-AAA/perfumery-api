import { ApiProperty } from '@nestjs/swagger';

export class PerfumeTypeResponse {
  @ApiProperty({
    description: 'Representa el identificador único del tipo de perfume',
    type: 'string',
    required: true,
  })
  id: string;

  @ApiProperty({
    description: 'Representa el nombre del tipo de perfume',
    type: 'string',
    required: true,
  })
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
