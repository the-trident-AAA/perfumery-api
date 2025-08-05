import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class OrderDto {
  @ApiProperty({
    name: 'orderBy',
    required: false,
    type: Number,
    description: 'OrderBy column: example "name"',
    example: 1,
  })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiProperty({
    name: 'order',
    required: false,
    type: Number,
    description: 'order example "ASC"',
    example: 1,
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC' = 'ASC';
}
