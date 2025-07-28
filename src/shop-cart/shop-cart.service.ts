import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateShopCartDto } from './dto/create-shop-cart.dto';
import { DatabaseService } from 'src/database/database.service';
import { ShopCartResponse } from './responses/shop-cart.response';
import { ShopCartPerfumeService } from 'src/shop-cart-perfume/shop-cart-perfume.service';
import { ShopCartTotalItemsResponse } from './responses/shop-cart-total-items.response';

@Injectable()
export class ShopCartService {
  constructor(
    private readonly db: DatabaseService,
    private readonly shopCartPerfumeService: ShopCartPerfumeService,
  ) {}

  async create(createShopCartDto: CreateShopCartDto) {
    const shopCart = this.db.shopCartRespository.create(createShopCartDto);
    return await this.db.shopCartRespository.save(shopCart);
  }

  async findOne(id: string) {
    const shopCart = await this.db.shopCartRespository.findOne({
      where: { id },
      relations: ['shopCartPerfumes'],
    });
    if (!shopCart)
      throw new BadRequestException(
        'No estiste un carrito con ese identificador',
      );

    return new ShopCartResponse(
      shopCart.id,
      await Promise.all(
        shopCart.shopCartPerfumes.map(
          async (shopCartPerfume) =>
            await this.shopCartPerfumeService.findOne(shopCartPerfume.id),
        ),
      ),
    );
  }

  async totalItems(id: string) {
    const shopCart = await this.db.shopCartRespository.findOne({
      where: { id },
      relations: ['shopCartPerfumes'],
    });

    if (!shopCart)
      throw new BadRequestException(
        'No estiste un carrito con ese identificador',
      );

    return new ShopCartTotalItemsResponse(shopCart.shopCartPerfumes.length);
  }

  async remove(id: string) {
    return await this.db.shopCartRespository.delete({ id });
  }

  async clearShopCart(shopCartId: string) {
    return await this.shopCartPerfumeService.clearShopCart(shopCartId);
  }
}
