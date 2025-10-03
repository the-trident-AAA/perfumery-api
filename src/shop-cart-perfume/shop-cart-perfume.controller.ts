import {
  Controller,
  Body,
  Patch,
  Param,
  Post,
  Delete,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ShopCartPerfumeService } from './shop-cart-perfume.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateShopCartPerfumeDto } from './dto/create-shop-cart-perfume.dto';
import { UpdateShopCartPerfumeDto } from './dto/update-shop-cart-perfume.dto';
import { ShopCartPerfumeResponse } from './responses/shop-cart-perfume.response';
import { ShopCartPerfumeDataResponse } from './responses/shop-cart-perfume-data.response';

@Controller('shop-cart-perfume')
export class ShopCartPerfumeController {
  constructor(
    private readonly shopCartPerfumeService: ShopCartPerfumeService,
  ) {}

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary:
      'Este endpoint obtiene un perfume del carrito compras en específico de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfume del carrito de compras obtenido exitosamente',
    type: ShopCartPerfumeResponse,
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrió un error en el proceso de obtener el perfume del carrito de compras',
  })
  findOne(@Param('id') id: string) {
    return this.shopCartPerfumeService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Este endpoint agrega un perfume al carrito de compras',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfume añadido con éxito',
    type: ShopCartPerfumeDataResponse,
  })
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

  @Delete('clear-shop-cart/:id')
  @ApiOperation({
    summary:
      'Este endpoint elimina todos los perfumes del carrito de compras indicado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfumes del carrito de compras eliminados exitosamente',
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrió un error en el proceso de eliminación de los perfumes del carrito de compras',
  })
  clearShopCart(@Param('id') id: string) {
    return this.shopCartPerfumeService.clearShopCart(id);
  }
}
