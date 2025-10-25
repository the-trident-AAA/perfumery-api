import { ApiProperty } from '@nestjs/swagger';

export class FiltersScentDto {
  @ApiProperty({
    description: 'Representa el nombre de la esencia',
    type: 'string',
    required: false,
  })
  name?: string;
}
