import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { State } from '../entities/state.enum';
import { IsNull } from 'typeorm';

class PerfumeOrderDto {
  @ApiProperty({ description: 'ID del perfume' })
  @IsUUID()
  perfumeId: string;
  @ApiProperty({ description: 'Cantidad de perfumes en el pedido' })
  cant: number;
}

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Representa el estado del pedido',
  })
  state?: State;
  @ApiProperty({
    description:
      'Lista de perfumes en el pedido con sus respectivas cantidades',
    type: [PerfumeOrderDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PerfumeOrderDto)
  perfumes?: PerfumeOrderDto[];
}
