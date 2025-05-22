import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { PerfumeTypeModule } from './perfume-type/perfume-type.module';
import { BrandModule } from './brand/brand.module';
import { ScentModule } from './scent/scent.module';
import { PerfumeModule } from './perfume/perfume.module';
import { OfferModule } from './offer/offer.module';
import { MinioModule } from './minio/minio.module';
import { HomeBannerModule } from './home-banner/home-banner.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    PerfumeTypeModule,
    BrandModule,
    ScentModule,
    PerfumeModule,
    OfferModule,
    MinioModule,
    HomeBannerModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
