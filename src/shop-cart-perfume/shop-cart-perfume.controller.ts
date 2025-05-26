import { Controller, Body, Patch, Param, Post, Delete } from '@nestjs/common';
import { ShopCartPerfumeService } from './shop-cart-perfume.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateShopCartPerfumeDto } from './dto/create-shop-cart-perfume.dto';
import { UpdateShopCartPerfumeDto } from './dto/update-shop-cart-perfume.dto';

@Controller('shop-cart-perfume')
export class ShopCartPerfumeController {
  constructor(
    private readonly shopCartPerfumeService: ShopCartPerfumeService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Este endpoint agrega un perfume al carrito de compras',
  })
  @ApiResponse({ status: 200, description: 'Perfume añadido con éxito' })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrió un error en el proceso de inserción del perfume en el carrito de compras',
  })
  create(@Body() dto: CreateShopCartPerfumeDto) {
    return this.shopCartPerfumeService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary:
      'Este endpoint incrementa la cantidad de perfume de este tipo seleccionado en el carrito',
  })
  @ApiResponse({
    status: 200,
    description: 'Acción de incremento realizada con éxito',
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en la acción de incremento',
  })
  update(
    @Param('id') id: string,
    @Body() updateShopCartPerfumeDto: UpdateShopCartPerfumeDto,
  ) {
    return this.shopCartPerfumeService.update(id, updateShopCartPerfumeDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Este endpoint elimina un perfume del carrito de compras',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfume eliminado del carrito de compras exitosamente',
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrió un error en el proceso de eliminación del perfume del carrito de compras',
  })
  remove(@Param('id') id: string) {
    return this.shopCartPerfumeService.remove(id);
  }
}
