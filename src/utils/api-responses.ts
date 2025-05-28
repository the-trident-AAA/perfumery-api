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

  constructor(total: number, page: number, limit: number) {
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}
export class PagintationResponse<T> {
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

  constructor(data: T[], paginationMeta: PaginationMeta) {
    this.data = data;
    this.paginationMeta = paginationMeta;
  }
}

export function ApiPaginatedResponse<T>(
  classRef: Type<T>,
  dataDescription: string,
): any {
  class DynamicPaginationResponse extends PagintationResponse<T> {
    @ApiProperty({
      description: dataDescription,
      type: classRef,
      isArray: true,
    })
    data: T[];
  }

  Object.defineProperty(DynamicPaginationResponse, 'name', {
    value: `Paginated${classRef.name}Response`,
  });

  return DynamicPaginationResponse as Type<PagintationResponse<T>>;
}
