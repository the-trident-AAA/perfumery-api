import { Controller } from '@nestjs/common';
import { MinioService } from './minio.service';

@Controller('minio')
export class MinioController {
  private service: MinioService;

  constructor(service: MinioService) {
    this.service = service;
  }
}
