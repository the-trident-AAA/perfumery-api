import { Injectable, Logger } from '@nestjs/common';
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
    const shopCart = await this.shopCartService.findOne(user.shopCartId);

    const order = this.db.orderRespository.create({
      orderPerfumes: null,

      userId: user.id,
    });
    const savedOrder = await this.db.orderRespository.save(order);

    // Create the relationships between Order and Perfume with quantities
    const orderPerfumes = await Promise.all(
      shopCart.shopCartPerfumes.map(async (p) => {
        return this.db.orderPerfumeRepository.create({
          order: savedOrder,
          perfume: p.perfume,
          cant: p.cant,
        });
      }),
    );
    await this.db.orderPerfumeRepository.save(orderPerfumes);

    // clear the shop cart
    this.shopCartService.clearShopCart(user.shopCartId);
    return await this.db.orderRespository.save(savedOrder);
  }

  async findAll(
    paginationDto: PaginationDto,
    filtersOrderDto: FiltersOrderDto,
  ) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [ordersEntity, total] = await this.db.orderRespository.findAndCount({
      where: {
        ...(filtersOrderDto.id && { id: filtersOrderDto.id }),
        ...(filtersOrderDto.state && { state: filtersOrderDto.state }),
        ...(filtersOrderDto.userId && { userId: filtersOrderDto.userId }),
      },
      relations: ['orderPerfumes', 'orderPerfumes.perfume'],
      skip,
      take: limit,
    });

    const data = await Promise.all(
      ordersEntity.map(
        async (orderEntity) =>
          new OrderResponse(
            orderEntity.id,
            orderEntity.state,
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
    if (updateOrderDto.state)
      await this.db.orderRespository.update(id, {
        state: updateOrderDto.state,
      });

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
