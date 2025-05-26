import { ApiProperty } from '@nestjs/swagger';
import { ShopCartPerfumeResponse } from 'src/shop-cart-perfume/responses/shop-cart-perfume.response';

export class ShopCartResponse {
  @ApiProperty({
    description:
      'Representa el identificador único del carrito de compras del usuario',
    type: 'string',
    required: true,
  })
  id: string;
  @ApiProperty({
    description:
      'Representa las lista de perfumes del carrito de compras del usuario',
    type: 'string',
    required: true,
  })
  shopCartPerfumes: ShopCartPerfumeResponse[];

  constructor(id: string, shopCartPerfumes: ShopCartPerfumeResponse[]) {
    this.id = id;
    this.shopCartPerfumes = shopCartPerfumes;
  }
}
