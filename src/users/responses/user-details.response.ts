import { ShopCartResponse } from 'src/shop-cart/responses/shop-cart.response';
import { UserResponse } from './user.response';
import { ApiProperty } from '@nestjs/swagger';

export class UserDetailsResponse extends UserResponse {
  @ApiProperty({
    description: 'Representa el carrito de compras del usuario',
    type: ShopCartResponse,
    required: true,
  })
  shopCart: ShopCartResponse;

  constructor(
    id: string,
    username: string,
    avatar: string,
    email: string,
    role: string,
    isActive: boolean,
    shopCart: ShopCartResponse,
    hasPassword: boolean,
  ) {
    super(id, username, avatar, email, role, isActive, hasPassword);
    this.shopCart = shopCart;
  }
}
