import { Module } from '@nestjs/common';
import { PerfumeGroupService } from './perfume_group.service';
import { PerfumeGroupController } from './perfume_group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfumeGroup } from './entities/perfume_group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PerfumeGroup])],
  controllers: [PerfumeGroupController],
  providers: [PerfumeGroupService],
})
export class PerfumeGroupModule {}
