import { ApiProperty } from '@nestjs/swagger';
import { State } from '../entities/state.enum';

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
}
