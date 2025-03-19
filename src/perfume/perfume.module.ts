import { Module } from '@nestjs/common';
import { PerfumeService } from './perfume.service';
import { PerfumeController } from './perfume.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Perfume } from './entities/perfume.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Perfume])],
  controllers: [PerfumeController],
  providers: [PerfumeService],
})
export class PerfumeModule {}
