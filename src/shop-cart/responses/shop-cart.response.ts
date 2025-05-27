import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
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
    type: ShopCartPerfumeResponse,
    isArray: true,
    required: true,
  })
  shopCartPerfumes: ShopCartPerfumeResponse[];

  constructor(id: string, shopCartPerfumes: ShopCartPerfumeResponse[]) {
    this.id = id;
    this.shopCartPerfumes = shopCartPerfumes;
  }

  @ApiProperty({
    description: 'Cantidad total de ítems en el carrito',
    type: Number,
  })
  @Expose()
  get totalItems(): number {
    return this.shopCartPerfumes.length;
  }

  @ApiProperty({
    description: 'Monto total del carrito (suma del precio de todos los ítems)',
    type: Number,
  })
  @Expose()
  get totalMount(): number {
    return this.shopCartPerfumes.reduce((total, shopCartPerfume) => {
      return total + shopCartPerfume.price;
    }, 0);
  }
}
