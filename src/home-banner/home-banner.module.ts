import { Module } from '@nestjs/common';
import { HomeBannerService } from './home-banner.service';
import { HomeBannerController } from './home-banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeBannerEntity } from './entities/home-banner.entity';
import { PerfumeModule } from 'src/perfume/perfume.module';
import { MinioModule } from 'src/minio/minio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HomeBannerEntity]),
    PerfumeModule,
    MinioModule,
  ],
  controllers: [HomeBannerController],
  providers: [HomeBannerService],
})
export class HomeBannerModule {}
