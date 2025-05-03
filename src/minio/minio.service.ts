import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService {
  private client: Client;
  private logger = new Logger('MinioService');

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    try {
      this.client = new Client({
        accessKey: this.config.get<string>('MINIO_ACCESS_KEY'),
        endPoint: this.config.get<string>('MINIO_URL'),
        secretKey: this.config.get<string>('MINIO_SECRET_KEY'),
        port: parseInt(this.config.get<string>('MINIO_PORT')),
        useSSL: false,
      });
      const bucketExist = await this.client.bucketExists(
        this.config.get<string>('MINIO_BUCKET'),
      );
      if (!bucketExist) {
        this.logger.log('Creando bucket');
        await this.client.makeBucket(
          this.config.get<string>('MINIO_BUCKET'),
          'en-us',
        );
        this.logger.log('Bucket creado');
      }
    } catch (ex: any) {
      this.logger.error('No se pudo establecer la conexión');
      this.logger.error(ex);
    }
  }
}
