import { Injectable, Logger} from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DatabaseService } from 'src/database/database.service';
import { ShopCartService } from 'src/shop-cart/shop-cart.service';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';
import { OrderResponse } from './responses/order.response';
import { UsersService } from 'src/users/users.service';
import { OrderPerfumeResponse } from './responses/order-perfume.response';
import { PerfumeService } from 'src/perfume/perfume.service';
<<<<<<< HEAD
import { OrderEntity } from './entities/order.entity';
=======
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { FiltersOrderDto } from './filters/filters-order.dto';
import { PaginationMeta, PagintationResponse } from 'src/utils/api-responses';
>>>>>>> 7c7b380 (feat(order): implement pagination and filters in the findAll method of OrderService)

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
