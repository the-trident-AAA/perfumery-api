import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { ShopCartModule } from 'src/shop-cart/shop-cart.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), ShopCartModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
