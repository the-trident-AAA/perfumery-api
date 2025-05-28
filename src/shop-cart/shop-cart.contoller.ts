import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ShopCartService } from './shop-cart.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ShopCartResponse } from './responses/shop-cart.response';
import { ShopCartTotalItemsResponse } from './responses/shop-cart-total-items.response';

@Controller('shop-cart')
export class ShopCartController {
  constructor(private readonly shopCartService: ShopCartService) {}

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary:
      'Este endpoint obtiene un carrito de compras en específico de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Carrito de compras obtenido exitosamente',
    type: ShopCartResponse,
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrió un error en el proceso de obtener el carrito de compras',
  })
  findOne(@Param('id') id: string) {
    return this.shopCartService.findOne(id);
  }

  @Get('total-items/:id')
  @ApiOperation({
    summary:
      'Este endpoint devuelve la cantidad de items de un carrito de compras en específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Cantidad de items obtenida con éxito',
    type: ShopCartTotalItemsResponse,
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrió un error en el proceso de obtener la cantidad de items del carrito de compras',
  })
  totalItems(@Param('id') id: string) {
    return this.shopCartService.totalItems(id);
  }
}
