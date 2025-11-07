import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class OrderDto {
  @ApiProperty({
    name: 'orderBy',
    required: false,
    type: 'string',
    description: 'OrderBy column: example "name"',
    example: 'name',
  })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiProperty({
    name: 'order',
    required: false,
    type: 'string',
    description: 'order example "ASC"',
    example: 'ASC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';
}
