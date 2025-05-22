import { Module } from '@nestjs/common';
import { PerfumeTypeService } from './perfume-type.service';
import { PerfumeTypeController } from './perfume-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfumeTypeEntity } from './entities/perfume-type.entity';
import { MinioModule } from 'src/minio/minio.module';

@Module({
  imports: [TypeOrmModule.forFeature([PerfumeTypeEntity]), MinioModule],
  controllers: [PerfumeTypeController],
  providers: [PerfumeTypeService],
})
export class PerfumeTypeModule {}
