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

const folder = process.env.NODE_ENV !== 'development' ? 'dist' : 'src';
const extensions = process.env.NODE_ENV !== 'development' ? 'js' : 'ts';

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
        entities: [join(process.cwd(), folder, '**', `*.entity.${extensions}`)],
        retryAttempts: 0,
      }),
    }),
    TypeOrmModule.forFeature([
      PerfumeTypeEntity,
      BrandEntity,
      ScentEntity,
      PerfumeEntity,
      OfferEntity,
    ]),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
