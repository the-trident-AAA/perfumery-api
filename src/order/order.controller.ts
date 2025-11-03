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
import { OrderDto } from 'src/utils/dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiBearerAuth()
  @Auth([Role.USER, Role.ADMIN])
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
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

  @ApiBearerAuth()
  @Auth([Role.USER, Role.ADMIN])
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
    @Query() orderDto: OrderDto,
  ) {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.orderService.findAll(paginationDto, filtersOrderDto, orderDto);
  }

  @ApiBearerAuth()
  @Auth([Role.USER, Role.ADMIN])
  @Get('user-total-orders')
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
  userTotalOrders(
    @ActiveUser()
    user: ActiveUserInterface,
  ) {
    console.log(user);
    return this.orderService.userTotalOrders(user.id);
  }

  @ApiBearerAuth()
  @Auth([Role.USER, Role.ADMIN])
  @Get('orders-not-seen-by-user')
  @ApiOperation({
    summary:
      'Este endpoint devuelve la cantidad de orders no vistas por un usuario en esepecífico',
  })
  @ApiResponse({
    status: 200,
    description: 'Cantidad de items obtenida con éxito',
    type: UserTotalOrdersResponse,
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrió un error en el proceso de obtener la cantidad orders no vistas por el usuario',
  })
  ordersNotSeenByUser(
    @ActiveUser()
    user: ActiveUserInterface,
  ) {
    return this.orderService.ordersNotSeenByUser(user.id);
  }

  @ApiBearerAuth()
  @Auth([Role.USER, Role.ADMIN])
  @Patch('update-user-orders-as-views')
  @ApiOperation({
    summary: 'Este endpoint actualiza las vistas de las órdenes',
  })
  @ApiResponse({
    status: 200,
    description: 'Actualización realizada con éxito',
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error enla actualización',
  })
  updateUserOrdersAsViews(
    @ActiveUser()
    user: ActiveUserInterface,
  ) {
    return this.orderService.updateUserOrdersAsViews(user.id);
  }

  @ApiBearerAuth()
  @Auth([Role.USER, Role.ADMIN])
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('get-order-perfumes/:id')
  getOrderPerfumes(@Param('id') id: string) {
    return this.orderService.getOrderPerfumes(id);
  }
  @ApiBearerAuth()
  @Auth([Role.USER, Role.ADMIN])
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }
  @ApiBearerAuth()
  @Auth([Role.USER, Role.ADMIN])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @ApiBearerAuth()
  @Auth([Role.USER, Role.ADMIN])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
