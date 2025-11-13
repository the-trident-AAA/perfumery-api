import { Module } from '@nestjs/common';
import { TapeService } from './tape.service';
import { TapeController } from './tape.controller';
import { MinioModule } from 'src/minio/minio.module';

@Module({
  controllers: [TapeController],
  providers: [TapeService],
  imports: [MinioModule],
})
export class TapeModule {}
