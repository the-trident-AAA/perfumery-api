import { Module } from '@nestjs/common';
import { ShopCartPerfumeService } from './shop-cart-perfume.service';
import { ShopCartPerfumeController } from './shop-cart-perfume.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PerfumeModule } from 'src/perfume/perfume.module';

@Module({
  imports: [DatabaseModule, PerfumeModule],
  controllers: [ShopCartPerfumeController],
  providers: [ShopCartPerfumeService],
})
export class ShopCartPerfumeModule {}
