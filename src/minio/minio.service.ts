import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';
import { v4 as guid } from 'uuid';

@Injectable()
export class MinioService {
  private minioClient: Client;
  private logger = new Logger('MinioService');

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    try {
      this.minioClient = new Client({
        accessKey: this.config.get<string>('MINIO_ACCESS_KEY'),
        endPoint: this.config.get<string>('MINIO_URL'),
        secretKey: this.config.get<string>('MINIO_SECRET_KEY'),
        port: parseInt(this.config.get<string>('MINIO_PORT')),
        useSSL: false,
      });
      const bucketExist = await this.minioClient.bucketExists(
        this.config.get<string>('MINIO_BUCKET'),
      );
      if (!bucketExist) {
        this.logger.log('Creando bucket');
        await this.minioClient.makeBucket(
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

  async checkIfExist(path: string) {
    try {
      await this.minioClient.statObject(
        this.config.get<string>('MINIO_BUCKET'),
        path,
      );
      return true;
    } catch {
      return false;
    }
  }

  async copy(oldName: string, newName: string) {
    return this.minioClient.copyObject(
      this.config.get<string>('MINIO_BUCKET'),
      newName,
      this.config.get<string>('MINIO_BUCKET') + '/' + oldName,
      null,
    );
  }

  async uploadFile(
    fileName: string = guid(),
    fileBuffer: Buffer,
    fileFormat?: string,
    mimeType?: string,
  ) {
    if (fileFormat) {
      fileName = fileName.concat(`.${fileFormat}`);
    }

    const metaData = {
      'Content-Type': mimeType || 'application/octet-stream',
    };

    await this.minioClient.putObject(
      this.config.get<string>('MINIO_BUCKET'),
      fileName,
      fileBuffer,
      undefined,
      metaData,
    );

    this.logger.log(`Uploaded file ${fileName} with MIME type ${mimeType}`);
    return fileName;
  }
}
