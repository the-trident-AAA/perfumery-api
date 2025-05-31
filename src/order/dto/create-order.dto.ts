import { ApiProperty } from '@nestjs/swagger';
import { State } from '../entities/state.enum';
import { IsArray, IsEnum, IsUUID, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

class PerfumeOrderDto {
  @ApiProperty({ description: 'ID del perfume' })
  @IsUUID()
  perfumeId: string;

  @ApiProperty({ description: 'Cantidad de perfumes en el pedido' })
  cant: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Representa el estado del pedido',
  })
  @IsEnum(State)
  state: State;

  @ApiProperty({
    description: 'Representa el usuario al que le pertenece el pedido',
  })
  @IsUUID()
  @Transform(({ value }) => (value === '' ? null : value))
  userId: string;

  @ApiProperty({
    description:
      'Lista de perfumes en el pedido con sus respectivas cantidades',
    type: [PerfumeOrderDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PerfumeOrderDto)
  perfumes: PerfumeOrderDto[];
}
