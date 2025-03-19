import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { PerfumeGroupModule } from './perfume-group/perfume-group.module';
import { BrandModule } from './brand/brand.module';
import { ScentModule } from './scent/scent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    PerfumeGroupModule,
    BrandModule,
    ScentModule,
  ],
})
export class AppModule {}
