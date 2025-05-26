import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ShopCartModule } from 'src/shop-cart/shop-cart.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ShopCartModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
