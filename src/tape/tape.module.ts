import { Module } from '@nestjs/common';
import { TapeService } from './tape.service';
import { TapeController } from './tape.controller';

@Module({
  controllers: [TapeController],
  providers: [TapeService],
})
export class TapeModule {}
