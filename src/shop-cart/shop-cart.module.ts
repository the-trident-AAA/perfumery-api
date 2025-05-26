import { Module } from '@nestjs/common';
import { ShopCartService } from './shop-cart.service';
import { DatabaseModule } from 'src/database/database.module';
import { ShopCartController } from './shop-cart.contoller';
import { ShopCartPerfumeModule } from 'src/shop-cart-perfume/shop-cart-perfume.module';

@Module({
  imports: [DatabaseModule, ShopCartPerfumeModule],
  controllers: [ShopCartController],
  providers: [ShopCartService],
})
export class ShopCartModule {}
