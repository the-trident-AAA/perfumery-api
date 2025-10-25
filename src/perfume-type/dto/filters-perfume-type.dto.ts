import { ApiProperty } from '@nestjs/swagger';

export class FiltersPerfumeTypeDto {
  @ApiProperty({
    description: 'Representa el nombre del tipo de perfume',
    type: 'string',
    required: false,
  })
  name?: string;
}
