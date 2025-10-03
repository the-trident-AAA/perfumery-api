import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateShopCartPerfumeDto } from './dto/create-shop-cart-perfume.dto';
import { PerfumeService } from 'src/perfume/perfume.service';
import { ShopCartPerfumeResponse } from './responses/shop-cart-perfume.response';
import { UpdateShopCartPerfumeDto } from './dto/update-shop-cart-perfume.dto';
import { ShopCartService } from 'src/shop-cart/shop-cart.service';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class ShopCartPerfumeService {
  constructor(
    private readonly db: DatabaseService,
    private readonly perfumeService: PerfumeService,
    private readonly shopCartService: ShopCartService,
    private readonly sessionService: SessionService,
  ) {}

  async create(createShopCartPerfumeDto: CreateShopCartPerfumeDto) {
    const isCreateAnonymousShopCart =
      !createShopCartPerfumeDto.shopCartId &&
      !createShopCartPerfumeDto.sessionId;
    // check if a perfume already exists in this cart

    const anonymousShopCart = !isCreateAnonymousShopCart
      ? createShopCartPerfumeDto.sessionId
        ? await this.db.shopCartRespository.findOne({
            where: {
              sessionId: createShopCartPerfumeDto.sessionId,
            },
          })
        : undefined
      : await this.shopCartService.create({
          sessionId: this.sessionService.generateSessionId(),
        });

    const shopCartPerfume = await this.db.shopCartPerfumeRespository.findOne({
      where: {
        perfumeId: createShopCartPerfumeDto.perfumeId,
        shopCartId: !anonymousShopCart
          ? createShopCartPerfumeDto.shopCartId
          : anonymousShopCart.id,
      },
    });

    // check perfume availability
    if (
      !(await this.perfumeService.checkStocks(
        createShopCartPerfumeDto.perfumeId,
        shopCartPerfume
          ? createShopCartPerfumeDto.cant + shopCartPerfume.cant
          : createShopCartPerfumeDto.cant,
      ))
    )
      throw new BadRequestException(
        'No existe disponibilidad de dicho perfume en el inventario',
      );

    const shopCartPerfumeSaved = await this.db.shopCartPerfumeRespository.save(
      shopCartPerfume
        ? {
            ...shopCartPerfume,
            cant: shopCartPerfume.cant + createShopCartPerfumeDto.cant,
          }
        : this.db.shopCartPerfumeRespository.create(createShopCartPerfumeDto),
    );

    return {
      data: shopCartPerfumeSaved,
      sessionId: anonymousShopCart?.sessionId,
    };
  }

  async update(id: string, updateShopCartPerfume: UpdateShopCartPerfumeDto) {
    const shopCartPerfume = await this.db.shopCartPerfumeRespository.findOne({
      where: { id },
    });

    if (!shopCartPerfume)
      throw new BadRequestException(
        'No existe un perfume de carrito con ese identificador',
      );

    if (
      !(await this.perfumeService.checkStocks(
        shopCartPerfume.perfumeId,
        updateShopCartPerfume.cant,
      ))
    )
      throw new BadRequestException(
        'No existe disponibilidad de dicho perfume en el inventario',
      );

    Object.assign(shopCartPerfume, updateShopCartPerfume);

    return await this.db.shopCartPerfumeRespository.save(shopCartPerfume);
  }

  async findOne(id: string) {
    const shopCartPerfume = await this.db.shopCartPerfumeRespository.findOne({
      where: { id },
    });

    if (!shopCartPerfume)
      throw new BadRequestException(
        'No existe un perfume de carrito con ese identificador',
      );

    return new ShopCartPerfumeResponse(
      shopCartPerfume.id,
      await this.perfumeService.findOne(shopCartPerfume.perfumeId),
      shopCartPerfume.cant,
    );
  }

  async remove(id: string) {
    return await this.db.shopCartPerfumeRespository.delete({ id });
  }

  async clearShopCart(shopCartId: string) {
    return await this.db.shopCartPerfumeRespository.delete({ shopCartId });
  }
}
