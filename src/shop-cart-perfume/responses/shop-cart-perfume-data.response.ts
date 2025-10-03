import { ApiProperty } from '@nestjs/swagger';
import { ShopCartPerfumeResponse } from './shop-cart-perfume.response';

export class ShopCartPerfumeDataResponse {
  @ApiProperty({
    description: 'Representa el Perfume del Carrito de compras guardado',
    type: ShopCartPerfumeResponse,
  })
  data: ShopCartPerfumeResponse;
  @ApiProperty({
    description:
      'Representa el id de sesión generado en caso de tratarse de una petición anónima',
    type: 'number',
  })
  sessionId?: string;

  constructor(data: ShopCartPerfumeResponse, sessionId?: string) {
    this.data = data;
    this.sessionId = sessionId;
  }
}
