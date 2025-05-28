import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({ description: 'Total de elementos', example: 100 })
  total: number;

  @ApiProperty({ description: 'Número de página actual', example: 1 })
  page: number;

  @ApiProperty({ description: 'Cantidad de elementos por página', example: 20 })
  limit: number;

  @ApiProperty({
    description: 'Última página de acuerdo a la cantidad total de registros',
    example: 10,
  })
  lastPage: number;
}
export class PaginatedResponse<T> {
  @ApiProperty({
    description: 'Metados de la paginación',
    type: PaginationMeta,
  })
  paginationMeta: PaginationMeta;
  @ApiProperty({
    description: 'Array de items paginados',
    isArray: true,
  })
  data: T[];
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
