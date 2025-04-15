import { Module } from '@nestjs/common';
import { PerfumeTypeService } from './perfume-type.service';
import { PerfumeTypeController } from './perfume-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfumeType } from './entities/perfume-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PerfumeType])],
  controllers: [PerfumeTypeController],
  providers: [PerfumeTypeService],
})
export class PerfumeTypeModule {}
