import { Module } from '@nestjs/common';
import { ShopCartPerfumeService } from './shop-cart-perfume.service';
import { ShopCartPerfumeController } from './shop-cart-perfume.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PerfumeModule } from 'src/perfume/perfume.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopCartPerfumeEntity } from './entities/shop-cart-perfume.entity';
import { ShopCartModule } from 'src/shop-cart/shop-cart.module';
import { SessionService } from 'src/common/services/session.service';

@Module({
  imports: [DatabaseModule, PerfumeModule, ShopCartModule, TypeOrmModule.forFeature([ShopCartPerfumeEntity])],
  controllers: [ShopCartPerfumeController],
  providers: [ShopCartPerfumeService, SessionService],
  exports: [ShopCartPerfumeService],
})
export class ShopCartPerfumeModule {}
