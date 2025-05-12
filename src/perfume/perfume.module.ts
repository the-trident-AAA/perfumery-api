import { Module } from '@nestjs/common';
import { PerfumeService } from './perfume.service';
import { PerfumeController } from './perfume.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfumeEntity } from './entities/perfume.entity';
import { ScentEntity } from 'src/scent/entities/scent.entity';
import { MinioModule } from 'src/minio/minio.module';
import { MinioService } from 'src/minio/minio.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([PerfumeEntity, ScentEntity, MinioModule]),
  ],
  controllers: [PerfumeController],
  providers: [PerfumeService, MinioService],
})
export class PerfumeModule {}
