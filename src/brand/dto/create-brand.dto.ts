import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({
    description: 'Representa el nombre de la marca',
    type: 'string',
    required: true,
  })
  name: string;
}
