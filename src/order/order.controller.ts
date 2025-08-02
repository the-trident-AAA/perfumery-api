import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filtersOrderDto: FiltersOrderDto,
  ) {
    return this.orderService.findAll(paginationDto, filtersOrderDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
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
