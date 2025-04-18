import { ApiProperty } from '@nestjs/swagger';

export class BrandResponse {
  @ApiProperty({
    description: 'Representa el identificador único de la marca',
    type: 'string',
    required: true,
  })
  id: string;

  @ApiProperty({
    description: 'Representa el nombre de la marca',
    type: 'string',
    required: true,
  })
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
