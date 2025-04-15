import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { PerfumeGroupModule } from './perfume-group/perfume-group.module';
import { BrandModule } from './brand/brand.module';
import { ScentModule } from './scent/scent.module';
import { PerfumeModule } from './perfume/perfume.module';
import { OfferModule } from './offer/offer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    PerfumeGroupModule,
    BrandModule,
    ScentModule,
    PerfumeModule,
    OfferModule,
  ],
})
export class AppModule {}
