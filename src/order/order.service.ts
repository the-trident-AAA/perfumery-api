import { Injectable, Logger } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DatabaseService } from 'src/database/database.service';
import { ShopCartService } from 'src/shop-cart/shop-cart.service';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';
import { OrderEntity } from './entities/order.entity';
import { FindOrdersDto } from './dto/find-orders';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { OrderResponse } from './responses/order-pesponse';
import { OrderPerfumeResponse } from './responses/order-perfume-response';
import { PerfumeResponse } from 'src/perfume/responses/perfume.response';
import { UserResponse } from 'src/users/responses/user.response';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderEntity.name);
  constructor(
    private readonly db: DatabaseService,
    private readonly shopCartService: ShopCartService,
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

  async findAll(paginationDto: PaginationDto, dto: FindOrdersDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = OrderEntity.createQueryBuilder('order')
      .leftJoinAndSelect('order.orderPerfumes', 'orderPerfume')
      .leftJoinAndSelect('orderPerfume.perfume', 'perfume')
      .leftJoinAndSelect('order.user', 'user');

    if (dto.state)
      queryBuilder.andWhere('order.state = :state', {
        state: dto.state,
      });

    if (dto.userId)
      queryBuilder.andWhere('order.userId = :userId', {
        userId: dto.userId,
      });

    queryBuilder.orderBy('order.id').skip(skip).take(limit);

    try {
      const [rawOrders, total] = await queryBuilder.getManyAndCount();
      const orders: OrderResponse[] = rawOrders.map((order) => {
        const user = new UserResponse(
          null,
          order.user.username,
          null,
          order.user.email,
          null,
        );
        const perfumes: OrderPerfumeResponse[] = Array.isArray(
          order.orderPerfumes,
        )
          ? order.orderPerfumes.map((op) => {
              const perfume = op.perfume;
              return new OrderPerfumeResponse(op.cant, perfume);
            })
          : [];
        return new OrderResponse(
          order.id,
          order.state,
          order.price,
          perfumes,
          user,
        );
      });
      return { orders, total };
    } catch (err) {
      this.logger.error(err);
      this.logger.error(err.stack);
      throw err;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
