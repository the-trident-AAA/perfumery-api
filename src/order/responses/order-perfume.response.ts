import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PerfumeResponse } from 'src/perfume/responses/perfume.response';

export class OrderPerfumeResponse {
  @ApiProperty({
    description: 'Representa el identificador del perfume de la orden',
    type: 'number',
  })
  id: string;
  @ApiProperty({
    description: 'Representa el perfume seleccionado para dicha orden',
    type: PerfumeResponse,
  })
  perfume: PerfumeResponse;
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
    return this.perfume.price * this.cant;
  }

  constructor(id: string, perfume: PerfumeResponse, cant: number) {
    this.id = id;
    this.perfume = perfume;
    this.cant = cant;
  }
}
