import { ApiProperty } from '@nestjs/swagger';
import { State } from '../entities/state.enum';
import { IsOptional, IsDateString } from 'class-validator';

export class FiltersOrderDto {
  @ApiProperty({
    description:
      'Representa el identificador de la orden por el que se desea filtrar',
    type: 'string',
    required: false,
  })
  id: string;
  @ApiProperty({
    description: 'Representa el estado de la orden por el que se desea filtrar',
    type: 'string',
    required: false,
  })
  state: State;
  @ApiProperty({
    description:
      'Representa el identificador del usuario por el que se desea filtrar',
    type: 'string',
    required: false,
  })
  userId: string;

  @ApiProperty({
    description:
      'Fecha de inicio para filtrar por fecha de última actualización',
    type: 'string',
    format: 'date-time',
    required: false,
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  lastUpdateDateMin?: string;

  @ApiProperty({
    description: 'Fecha de fin para filtrar por fecha de última actualización',
    type: 'string',
    format: 'date-time',
    required: false,
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  lastUpdateDateMax?: string;

  @ApiProperty({
    description: 'Excluir órdenes con este estado',
    required: false,
  })
  @IsOptional()
  excludeState?: State;
}
