import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { PerfumeTypeEntity } from 'src/perfume-type/entities/perfume-type.entity';
import { BrandEntity } from 'src/brand/entities/brand.entity';
import { ScentEntity } from 'src/scent/entities/scent.entity';
import { PerfumeEntity } from 'src/perfume/entities/perfume.entity';
import { OfferEntity } from 'src/offer/entities/offer.entity';
import { HomeBannerEntity } from 'src/home-banner/entities/home-banner.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ShopCartEntity } from 'src/shop-cart/entities/shop-cart.entity';
import { ShopCartPerfumeEntity } from 'src/shop-cart-perfume/entities/shop-cart-perfume.entity';
import { OrderEntity } from 'src/order/entities/order.entity';
import { OrderPerfumeEntity } from 'src/order/entities/order-perfume.entity';
import { OtpEntity } from 'src/otp/entities/otp.entity';
import { TapeEntity } from 'src/tape/entities/tape.entity';

@Global()
@Module({
  exports: [DatabaseService],
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('POSTGRES_URL'),
        port: config.get<number>('POSTGRES_PORT'),
        database: config.get<string>('POSTGRES_DATABASE'),
        username: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        synchronize: true,
        entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
        retryAttempts: 0,
        ssl:
          config.get<string>('POSTGRES_SSL') === 'true'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    TypeOrmModule.forFeature([
      PerfumeTypeEntity,
      BrandEntity,
      ScentEntity,
      PerfumeEntity,
      OfferEntity,
      HomeBannerEntity,
      UserEntity,
      ShopCartEntity,
      ShopCartPerfumeEntity,
      OrderEntity,
      OrderPerfumeEntity,
      OtpEntity,
      TapeEntity,
    ]),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
