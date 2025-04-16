import { ApiProperty } from '@nestjs/swagger';

export class CreateScentDto {
  @ApiProperty({
    description: 'Representa el nombre del aroma del perfume',
    type: 'string',
    required: true,
  })
  name: string;
}
