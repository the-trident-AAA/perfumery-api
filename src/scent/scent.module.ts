import { Module } from '@nestjs/common';
import { ScentService } from './scent.service';
import { ScentController } from './scent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScentEntity } from './entities/scent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScentEntity])],
  controllers: [ScentController],
  providers: [ScentService],
})
export class ScentModule {}
