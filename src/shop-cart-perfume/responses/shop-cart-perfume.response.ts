import { ApiProperty } from '@nestjs/swagger';
import { PerfumeDetailsResponse } from 'src/perfume/responses/perfume-details.response';

export class ShopCartPerfumeResponse {
  @ApiProperty({
    description:
      'Representa el identificador único del perfume del carrito de compras',
    type: 'string',
    required: true,
  })
  id: string;
  @ApiProperty({
    description: 'Representa el perfume asociado a dicho carrito de compras',
    type: 'string',
    required: true,
  })
  perfume: PerfumeDetailsResponse;
  @ApiProperty({
    description:
      'Representa la cantidad seleccionada para el perfume de dicho carrito de compras',
    type: 'string',
    required: true,
  })
  cant: number;

  constructor(id: string, perfume: PerfumeDetailsResponse, cant: number) {
    this.id = id;
    this.perfume = perfume;
    this.cant = cant;
  }
}
