import { Module } from '@nestjs/common';
import { ShopCartService } from './shop-cart.service';
import { DatabaseModule } from 'src/database/database.module';
import { ShopCartController } from './shop-cart.contoller';
import { ShopCartPerfumeModule } from 'src/shop-cart-perfume/shop-cart-perfume.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopCartEntity } from './entities/shop-cart.entity';

@Module({
  imports: [DatabaseModule, ShopCartPerfumeModule, TypeOrmModule.forFeature([ShopCartEntity])],
  controllers: [ShopCartController],
  providers: [ShopCartService],
  exports: [ShopCartService],
})
export class ShopCartModule {}
