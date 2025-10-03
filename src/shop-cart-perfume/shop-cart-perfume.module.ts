import { Module } from '@nestjs/common';
import { ShopCartPerfumeService } from './shop-cart-perfume.service';
import { ShopCartPerfumeController } from './shop-cart-perfume.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PerfumeModule } from 'src/perfume/perfume.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopCartPerfumeEntity } from './entities/shop-cart-perfume.entity';
import { ShopCartModule } from 'src/shop-cart/shop-cart.module';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [
    DatabaseModule,
    PerfumeModule,
    SessionModule,
    TypeOrmModule.forFeature([ShopCartPerfumeEntity]),
  ],
  controllers: [ShopCartPerfumeController],
  providers: [ShopCartPerfumeService],
  exports: [ShopCartPerfumeService],
})
export class ShopCartPerfumeModule {}
