import { ApiProperty } from '@nestjs/swagger';

export class BrandResponse {
  @ApiProperty({
    description: 'Representa el identificador único de la marca',
    type: 'number',
    required: true,
  })
  id: number;

  @ApiProperty({
    description: 'Representa el nombre de la marca',
    type: 'string',
    required: true,
  })
  name: string;
}
