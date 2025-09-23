import { Module } from '@nestjs/common';
import { ShopCartPerfumeService } from './shop-cart-perfume.service';
import { ShopCartPerfumeController } from './shop-cart-perfume.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PerfumeModule } from 'src/perfume/perfume.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopCartPerfumeEntity } from './entities/shop-cart-perfume.entity';

@Module({
  imports: [DatabaseModule, PerfumeModule, TypeOrmModule.forFeature([ShopCartPerfumeEntity])],
  controllers: [ShopCartPerfumeController],
  providers: [ShopCartPerfumeService],
  exports: [ShopCartPerfumeService],
})
export class ShopCartPerfumeModule {}
