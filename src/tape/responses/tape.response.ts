import { ApiProperty } from '@nestjs/swagger';

export class TapeResponse {
  @ApiProperty({
    description: 'Representa el identificador único del Tape',
    type: 'string',
    required: true,
  })
  id: string;
  @ApiProperty({
    description: 'Representa el nombre del Tape',
    type: 'string',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'Indica si el Tape es el principal o no',
    type: 'boolean',
    required: true,
  })
  isMain: boolean;
  @ApiProperty({
    description: 'Representa la promocional del Tape',
    type: 'string',
    required: true,
  })
  image: string;

  constructor(id: string, name: string, isMain: boolean, image: string) {
    this.id = id;
    this.name = name;
    this.isMain = isMain;
    this.image = image;
  }
}
