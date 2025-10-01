import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PerfumeDetailsResponse } from 'src/perfume/responses/perfume-details.response';


export class OrderPerfumeResponse {
  @ApiProperty({
    description: 'Representa el identificador del perfume de la orden',
    type: 'number',
  })
  id: string;
  @ApiProperty({
    description: 'Representa el perfume seleccionado para dicha orden',
    type: PerfumeDetailsResponse,
  })
  perfume: PerfumeDetailsResponse;
  @ApiProperty({
    description: 'Representa la cantidad seleccionada del perfume de la orden',
    type: 'number',
  })
  cant: number;
  @ApiProperty({
    description:
      'Representa el precio total (precio del perfume multiplicado por la cantidad)',
    type: 'number',
  })
  @Expose()
  get price(): number {
    return this.perfume.totalPrice * this.cant;
  }

  constructor(id: string, perfume: PerfumeDetailsResponse, cant: number) {
    this.id = id;
    this.perfume = perfume;
    this.cant = cant;
  }
}
