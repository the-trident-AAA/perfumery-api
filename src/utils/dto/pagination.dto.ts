import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  page?: number;

  @ApiProperty({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 5, max: 100)',
    example: 5,
  })
  limit?: number;
}
