import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DatabaseService } from 'src/database/database.service';
import { ShopCartService } from 'src/shop-cart/shop-cart.service';
import { ShopCartResponse } from 'src/shop-cart/responses/shop-cart.response';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';

@Injectable()
export class OrderService {
  constructor(
    private readonly db: DatabaseService,
    private readonly shopCartService: ShopCartService,
  ) {}

  async create(user: ActiveUserInterface) {
    const shopCart = await this.shopCartService.findOne(user.shopCartId);

    const order = this.db.orderRespository.create({
      orderPerfumes: null,
      price: 0,
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

    // Calculate the total price of the order
    savedOrder.price = orderPerfumes.reduce(
      (acc, orderPerfume) =>
        acc + orderPerfume.perfume.price * orderPerfume.cant,
      0,
    );

    // clear the shop cart
    this.shopCartService.clearShopCart(user.shopCartId);
    return await this.db.orderRespository.save(savedOrder);
  }

  async findAll() {
    return await this.db.orderRespository.find({
      relations: ['orderPerfumes', 'orderPerfumes.perfume'],
    });
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
