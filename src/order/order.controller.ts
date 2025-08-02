import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { Role } from 'src/common/enums/role.enum';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { ApiPaginationdResponse } from 'src/utils/api-responses';
import { OrderResponse } from './responses/order.response';
import { FiltersOrderDto } from './filters/filters-order.dto';
import { UserTotalOrdersResponse } from './responses/user-total-orders.respose';


@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiBearerAuth()
  @Auth([Role.USER])
  @Post()
  @ApiOperation({
    summary: 'Este endpoint agrega un pedido a la base de datos',
  })
  create(
    @ActiveUser()
    user: ActiveUserInterface,
  ) {
    console.log(user);
    return this.orderService.create(user);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Este endpoint obtiene los pedidos de la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de perfumes obtenidos exitosamente',
    type: ApiPaginationdResponse(
      OrderResponse,
      'Representa las órdenes como resultado de la de solicitud',
    ),
  })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filtersOrderDto: FiltersOrderDto,
  ) {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.orderService.findAll(paginationDto, filtersOrderDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Get('user-total-orders/:id')
  @ApiOperation({
    summary:
      'Este endpoint devuelve la cantidad de items de un carrito de compras en específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Cantidad de items obtenida con éxito',
    type: UserTotalOrdersResponse,
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrió un error en el proceso de obtener la cantidad de items del carrito de compras',
  })
  userTotalOrders(@Param('id') id: string) {
    return this.orderService.userTotalOrders(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
