import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateShopCartDto } from './dto/create-shop-cart.dto';
import { DatabaseService } from 'src/database/database.service';
import { ShopCartResponse } from './responses/shop-cart.response';
import { ShopCartPerfumeService } from 'src/shop-cart-perfume/shop-cart-perfume.service';
import { ShopCartTotalItemsResponse } from './responses/shop-cart-total-items.response';
import { PerfumeService } from 'src/perfume/perfume.service';

@Injectable()
export class ShopCartService {
  constructor(
    private readonly db: DatabaseService,
    private readonly shopCartPerfumeService: ShopCartPerfumeService,
    private readonly perfumeService: PerfumeService,
  ) {}

  async create(createShopCartDto: CreateShopCartDto) {
    const shopCart = this.db.shopCartRespository.create(createShopCartDto);
    return await this.db.shopCartRespository.save(shopCart);
  }

  async fusionShopCart(sessionId: string, shopCartId: string) {
    // find the anonymous shopcart
    const anonymousShopCart = await this.db.shopCartRespository.findOne({
      where: {
        sessionId,
      },
      relations: ['shopCartPerfumes'],
    });

    if (!anonymousShopCart)
      throw new BadRequestException(
        'No existe un carrito anonimo para el session id especificado',
      );

    // find the user shopcart
    const userShopCart = await this.db.shopCartRespository.findOne({
      where: {
        id: shopCartId,
      },
      relations: ['shopCartPerfumes'],
    });

    if (!userShopCart)
      throw new BadRequestException(
        'No existe el carrito de usuario especificado',
      );

    // Si no hay perfumes en el carrito anónimo, no hay nada que fusionar
    if (
      !anonymousShopCart.shopCartPerfumes ||
      anonymousShopCart.shopCartPerfumes.length === 0
    ) {
      return userShopCart;
    }

    // Fusionar cada perfume del carrito anónimo al carrito del usuario
    for (const anonymousPerfume of anonymousShopCart.shopCartPerfumes) {
      // Buscar si el perfume ya existe en el carrito del usuario
      const existingUserPerfume = userShopCart.shopCartPerfumes.find(
        (up) => up.perfumeId === anonymousPerfume.perfumeId,
      );

      if (existingUserPerfume) {
        // Si ya existe, sumar las cantidades
        const totalQuantity = existingUserPerfume.cant + anonymousPerfume.cant;

        // Verificar si hay suficiente stock disponible
        const hasStock = await this.perfumeService.checkStocks(
          anonymousPerfume.perfumeId,
          totalQuantity,
        );

        if (hasStock) {
          // Actualizar la cantidad en el carrito del usuario
          existingUserPerfume.cant = totalQuantity;
          await this.db.shopCartPerfumeRespository.save(existingUserPerfume);
        } else {
          // Si no hay suficiente stock, obtener la cantidad máxima disponible
          const perfume = await this.db.perfumeRepository.findOne({
            where: { id: anonymousPerfume.perfumeId },
          });

          if (perfume && perfume.cant > existingUserPerfume.cant) {
            // Ajustar a la cantidad máxima disponible
            existingUserPerfume.cant = perfume.cant;
            await this.db.shopCartPerfumeRespository.save(existingUserPerfume);
          }
        }
      } else {
        // Crear nuevo perfume en el carrito del usuario
        const newShopCartPerfume = this.db.shopCartPerfumeRespository.create({
          perfumeId: anonymousPerfume.perfumeId,
          shopCartId: shopCartId,
          cant: anonymousPerfume.cant,
        });
        await this.db.shopCartPerfumeRespository.save(newShopCartPerfume);
      }
    }

    // Limpiar el carrito anónimo después de la fusión
    await this.remove(anonymousShopCart.id);

    // Retornar el carrito del usuario actualizado
    return await this.findOne(shopCartId);
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

    return new ShopCartTotalItemsResponse(
      shopCart.shopCartPerfumes.reduce((total, shopCartPerfume) => {
        return total + shopCartPerfume.cant;
      }, 0),
    );
  }

  async totalItemsAnonymousShopCart(sessionId: string) {
    const shopCart = await this.db.shopCartRespository.findOne({
      where: { sessionId },
      relations: ['shopCartPerfumes'],
    });

    if (!shopCart)
      throw new BadRequestException(
        'No estiste un carrito con ese identificador',
      );

    return new ShopCartTotalItemsResponse(
      shopCart.shopCartPerfumes.reduce((total, shopCartPerfume) => {
        return total + shopCartPerfume.cant;
      }, 0),
    );
  }

  async remove(id: string) {
    return await this.db.shopCartRespository.delete({ id });
  }

  async clearShopCart(shopCartId: string) {
    return await this.shopCartPerfumeService.clearShopCart(shopCartId);
  }

  async clearAnonymousShopCart(sessionId: string) {
    // find the anonymous shop cart
    const anonymousShopCart = await this.db.shopCartRespository.findOne({
      where: {
        sessionId,
      },
    });

    if (!anonymousShopCart)
      throw new BadGatewayException(
        'No existe un  carrito anónimo especificado ',
      );
    return await this.shopCartPerfumeService.clearShopCart(
      anonymousShopCart.id,
    );
  }
}
