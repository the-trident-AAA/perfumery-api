import { State } from '../entities/state.enum';
import { OrderPerfumeResponse } from './order-perfume.response';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserResponse } from 'src/users/responses/user.response';

export class OrderResponse {
  @ApiProperty({
    description: 'Representa el identificador de la orden',
    type: 'number',
  })
  id: string;
  @ApiProperty({
    description: 'Representa el código generado para la orden',
    example: 'por definir',
  })
  code: string;
  @ApiProperty({
    description: 'Representa el estado de la orden',
    example: 'por definir',
  })
  state: State;
  @ApiProperty({
    description: 'Representa la fecha de creación de la orden',
    type: 'string',
  })
  creationDate: string;
  @ApiProperty({
    description: 'Representa la fecha de actualización de la orden',
    type: 'string',
  })
  lastUpdateDate: string;
  @ApiProperty({
    description: 'Representa el usuario asociado a la orden',
    type: UserResponse,
  })
  user: UserResponse;
  @ApiProperty({
    description: 'Representa los perfumes asociados a la orden',
    type: OrderPerfumeResponse,
    isArray: true,
  })
  orderPerfumes: OrderPerfumeResponse[];

  @ApiProperty({
    description: 'Cantidad total de ítems del pedido',
    type: Number,
  })
  @Expose()
  get totalItems(): number {
    return this.orderPerfumes.reduce((total, orderPerufme) => {
      return total + orderPerufme.cant;
    }, 0);
  }

  @ApiProperty({
    description: 'Monto total del pedido (suma del precio de todos los ítems)',
    type: Number,
  })
  @Expose()
  get totalMount(): number {
    return this.orderPerfumes.reduce((total, orderPerfume) => {
      return total + orderPerfume.price;
    }, 0);
  }

  constructor(
    id: string,
    code: string,
    state: State,
    creationDate: string,
    lastUpdateDate: string,
    user: UserResponse,
    orderPerfumes: OrderPerfumeResponse[],
  ) {
    this.id = id;
    this.code = code;
    this.state = state;
    this.creationDate = creationDate;
    this.lastUpdateDate = lastUpdateDate;
    this.user = user;
    this.orderPerfumes = orderPerfumes;
  }
}
