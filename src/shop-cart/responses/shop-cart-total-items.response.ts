import { ApiProperty } from '@nestjs/swagger';

export class ShopCartTotalItemsResponse {
  @ApiProperty({
    description: 'Representa el total de items carrito de compras',
    type: Number,
    required: true,
  })
  totalItems: number;

  constructor(totalItems: number) {
    this.totalItems = totalItems;
  }
}
