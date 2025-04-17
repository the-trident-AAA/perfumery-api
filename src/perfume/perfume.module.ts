import { Module } from '@nestjs/common';
import { PerfumeService } from './perfume.service';
import { PerfumeController } from './perfume.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfumeEntity } from './entities/perfume.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PerfumeEntity])],
  controllers: [PerfumeController],
  providers: [PerfumeService],
})
export class PerfumeModule {}
