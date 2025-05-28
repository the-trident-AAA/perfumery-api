import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponse<T> {
  @ApiProperty({
    description: 'Array de items paginados',
    isArray: true,
  })
  data: T[];
}

export class PaginationMeta {
  @ApiProperty({ example: 100 })
  totalItems: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 10 })
  itemsPerPage: number;
}

export function ApiPaginatedResponse<T>(
  classRef: Type<T>,
  dataDescription: string,
): any {
  class DynamicPaginatedResponse extends PaginatedResponse<T> {
    @ApiProperty({
      description: dataDescription,
      type: classRef,
      isArray: true,
    })
    data: T[];
  }

  Object.defineProperty(DynamicPaginatedResponse, 'name', {
    value: `Paginated${classRef.name}Response`,
  });

  return DynamicPaginatedResponse as Type<PaginatedResponse<T>>;
}
