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

  @ApiProperty({
    description: 'Representa la imagen del tipo de perfume',
    type: 'string',
    required: true,
  })
  image?: string;

  constructor(id: string, name: string, image?: string) {
    this.id = id;
    this.name = name;
    this.image = image;
  }
}
