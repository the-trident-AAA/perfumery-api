import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DatabaseService } from 'src/database/database.service';
import { ShopCartService } from 'src/shop-cart/shop-cart.service';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';
import { OrderResponse } from './responses/order.response';
import { UsersService } from 'src/users/users.service';
import { OrderPerfumeResponse } from './responses/order-perfume.response';
import { PerfumeService } from 'src/perfume/perfume.service';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { FiltersOrderDto } from './filters/filters-order.dto';
import { PaginationMeta, PagintationResponse } from 'src/utils/api-responses';
import { UserTotalOrdersResponse } from './responses/user-total-orders.respose';
import { OrderEntity } from './entities/order.entity';
import { State } from './entities/state.enum';
import { OrderDto } from 'src/utils/dto/order.dto';
import { FindOptionsOrder, Between } from 'typeorm';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderEntity.name);
  constructor(
    private readonly db: DatabaseService,
    private readonly shopCartService: ShopCartService,
    private readonly userService: UsersService,
    private readonly perfumeService: PerfumeService,
  ) {}

  async create(user: ActiveUserInterface) {
    const shopCart = await this.db.shopCartRespository.findOne({
      where: {
        id: user.shopCartId,
      },
      relations: ['shopCartPerfumes'],
    });
    // Verificar si todos los perfumes cuentan con disponibilidad
    const hasAvailability = await this.perfumeService.checkPerfumesStocks(
      shopCart.shopCartPerfumes,
    );

    if (!hasAvailability)
      throw new BadRequestException(
        'Algunos perfumes de este carrito no cuentan con disponibilidad en el inventario. Por lo tanto no es posible crear la orden',
      );

    const order = this.db.orderRespository.create({
      orderPerfumes: null,
      creationDate: new Date(),
      lastUpdateDate: new Date(),
      userId: user.id,
    });
    const savedOrder = await this.db.orderRespository.save(order);

    // Create the relationships between Order and Perfume with quantities
    const orderPerfumes = await Promise.all(
      shopCart.shopCartPerfumes.map(async (p) => {
        return this.db.orderPerfumeRepository.create({
          order: savedOrder,
          perfumeId: p.perfumeId,
          cant: p.cant,
        });
      }),
    );
    await this.db.orderPerfumeRepository.save(orderPerfumes);

    // clear the shop cart
    this.shopCartService.clearShopCart(user.shopCartId);

    const orderEntity = await this.db.orderRespository.save(savedOrder);

    return await this.findOne(orderEntity.id);
  }

  async findAll(
    paginationDto: PaginationDto,
    filtersOrderDto: FiltersOrderDto,
    orderDto: OrderDto,
  ) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    const { order, orderBy } = orderDto;

    const sortableFields = [
      'id',
      'state',
      'creationDate',
      'lastUpdateDate',
      'userId',
    ];

    const direction = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const orderClause: FindOptionsOrder<OrderEntity> =
      orderBy && sortableFields.includes(orderBy)
        ? { [orderBy]: direction }
        : { lastUpdateDate: 'DESC' };

    const [ordersEntity, total] = await this.db.orderRespository.findAndCount({
      where: {
        ...(filtersOrderDto.id && { id: filtersOrderDto.id }),
        ...(filtersOrderDto.state && { state: filtersOrderDto.state }),
        ...(filtersOrderDto.userId && { userId: filtersOrderDto.userId }),
        // ✅ Rango para lastUpdateDate
        ...((filtersOrderDto.lastUpdateDateMin !== undefined ||
          filtersOrderDto.lastUpdateDateMax !== undefined) && {
          lastUpdateDate: Between(
            filtersOrderDto.lastUpdateDateMin ? new Date(filtersOrderDto.lastUpdateDateMin) : new Date(0),
            filtersOrderDto.lastUpdateDateMax ? new Date(filtersOrderDto.lastUpdateDateMax) : new Date(),
          ),
        }),
      },
      relations: ['orderPerfumes', 'orderPerfumes.perfume'],
      skip,
      take: limit,
      order: orderClause,
    });

    const data = await Promise.all(
      ordersEntity.map(
        async (orderEntity) =>
          new OrderResponse(
            orderEntity.id,
            orderEntity.state,
            orderEntity.creationDate.toISOString(),
            orderEntity.lastUpdateDate.toISOString(),
            await this.userService.findOneWithOutRelations(orderEntity.userId),
            await Promise.all(
              orderEntity.orderPerfumes.map(
                async (orderPerfumeEntity) =>
                  new OrderPerfumeResponse(
                    orderPerfumeEntity.id,
                    await this.perfumeService.findOne(
                      orderPerfumeEntity.perfumeId,
                    ),
                    orderPerfumeEntity.cant,
                  ),
              ),
            ),
          ),
      ),
    );

    const lastPage = Math.ceil(total / limit);

    return new PagintationResponse(
      data,
      new PaginationMeta(total, page, limit, lastPage),
    );
  }

  async findOne(id: string) {
    const orderEntity = await this.db.orderRespository.findOne({
      where: {
        id,
      },
      relations: ['orderPerfumes', 'orderPerfumes.perfume'],
    });
    return new OrderResponse(
      orderEntity.id,
      orderEntity.state,
      orderEntity.creationDate.toISOString(),
      orderEntity.lastUpdateDate.toISOString(),
      await this.userService.findOneWithOutRelations(orderEntity.userId),
      await Promise.all(
        orderEntity.orderPerfumes.map(
          async (orderPerfumeEntity) =>
            new OrderPerfumeResponse(
              orderPerfumeEntity.id,
              await this.perfumeService.findOne(orderPerfumeEntity.perfumeId),
              orderPerfumeEntity.cant,
            ),
        ),
      ),
    );
  }

  async getOrderPerfumes(id: string) {
    const orderPerfumes = await this.db.orderPerfumeRepository.find({
      where: { orderId: id },
    });

    return await Promise.all(
      orderPerfumes.map(
        async (orderPerfume) =>
          new OrderPerfumeResponse(
            orderPerfume.id,
            await this.perfumeService.findOne(orderPerfume.perfumeId),
            orderPerfume.cant,
          ),
      ),
    );
  }

  async userTotalOrders(userId: string) {
    return new UserTotalOrdersResponse(
      await this.db.orderRespository.count({ where: { userId } }),
    );
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const orderEntity = await this.db.orderRespository.findOne({
      where: {
        id,
      },
      relations: ['orderPerfumes'],
    });

    if (!orderEntity)
      throw new BadRequestException(
        'No existe una orden con ese identificador',
      );

    if (updateOrderDto.state) {
      // si el estado pasa de "completada a cancelada"
      if (
        (orderEntity.state === State.COMPLETED &&
          updateOrderDto.state === State.CANCELED) ||
        (orderEntity.state === State.COMPLETED &&
          updateOrderDto.state === State.PENDING)
      ) {
        // se deberían actualizar la existencias de los perfumes (incrementando existencias)
        await this.perfumeService.updateStock(
          orderEntity.orderPerfumes,
          'increase',
        );
      } else if (updateOrderDto.state === State.COMPLETED) {
        /* se verifica que los perfumes de la orden tengan disponibilidad de existencias 
        (en caso de no tener disponibilidad el administrador le solicita al cliente que edite el pedido) */
        const isPerfumesAvaliable =
          await this.perfumeService.checkPerfumesStocks(
            orderEntity.orderPerfumes,
          );
        if (!isPerfumesAvaliable)
          throw new BadRequestException(
            'Esta orden contiene perfumes que no cuentan con disponibilidad en el inventario. Por lo tanto no es posible marcarla como "completada"',
          );
        // se deberían actualizar la existencias de los perfumes (decrementando existencias)
        await this.perfumeService.updateStock(
          orderEntity.orderPerfumes,
          'decrease',
        );
      }
      await this.db.orderRespository.save({
        ...orderEntity,
        state: updateOrderDto.state,
      });
    }

    if (updateOrderDto.perfumes) {
      // first, delete the all perfumes of the order
      await this.db.orderPerfumeRepository.delete({ orderId: id });

      // Create the relationships between Order and Perfume with quantities
      const orderPerfumes = await Promise.all(
        updateOrderDto.perfumes.map(async (p) => {
          return this.db.orderPerfumeRepository.create({
            orderId: id,
            perfumeId: p.perfumeId,
            cant: p.cant,
          });
        }),
      );
      await this.db.orderPerfumeRepository.save(orderPerfumes);
    }

    return { success: true };
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
