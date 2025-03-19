import { Module } from '@nestjs/common';
import { PerfumeGroupService } from './perfume-group.service';
import { PerfumeGroupController } from './perfume-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfumeGroup } from './entities/perfume-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PerfumeGroup])],
  controllers: [PerfumeGroupController],
  providers: [PerfumeGroupService],
})
export class PerfumeGroupModule {}
