import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { State } from '../entities/state.enum';
import { OrderPerfumeResponse } from './order-perfume-response';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from 'src/users/responses/user.response';

export class OrderResponse {
  @IsString()
  id: string;

  @IsEnum(State)
  state: State;

  @IsNumber()
  price: number;

  @ApiProperty({
    type: OrderPerfumeResponse,
    isArray: true,
  })
  @IsArray()
  perfumes: OrderPerfumeResponse[];

  @ApiProperty({
    type: UserResponse,
  })
  user: UserResponse;

  constructor(
    id: string,
    state: State,
    price: number,
    perfumes: OrderPerfumeResponse[],
    user: UserResponse,
  ) {
    this.id = id;
    this.state = state;
    this.price = price;
    this.perfumes = perfumes;
    this.user = user;
  }
}
