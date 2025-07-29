import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { PerfumeEntity } from 'src/perfume/entities/perfume.entity';

export class OrderPerfumeResponse {
  @IsNumber()
  cant: number;

  @ApiProperty({
    type: PerfumeEntity,
  })
  perfume: PerfumeEntity;

  constructor(cant: number, perfume: PerfumeEntity) {
    this.cant = cant;
    this.perfume = perfume;
  }
}
