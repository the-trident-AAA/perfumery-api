import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';
import { v4 as guid } from 'uuid';

@Injectable()
export class MinioService {
  private minioClient: Client;
  private logger = new Logger('MinioService');

  constructor(private readonly config: ConfigService) {}


  /**
   * Initializes the MinIO client upon module startup and checks for the existence of the bucket:
   * - Configures the MinIO client with credentials obtained from environment variables.
   * - Checks to see if the specified bucket already exists on the server.
   * - If the bucket doesn't exist, one is created with the 'en-us' location.
   * - Error handling is performed to ensure any connection or bucket creation issues are logged.
   */

  getMinioURL() {
    return (
      (this.config.get<boolean>('MINIO_SSL') ? 'https://' : 'http://') +
      this.config.get<string>('MINIO_URL') +
      ':' +
      this.config.get<string>('MINIO_PORT') +
      '/' +
      this.config.get<string>('MINIO_BUCKET') +
      '/'
    );
  }


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

  async getPresignedUrl(objectName: string): Promise<string> {
    try {
      const expiryTime = 10 * 60;
      return await this.minioClient.presignedGetObject(
        this.config.get<string>('MINIO_BUCKET'),
        objectName,
        expiryTime,
      );
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async deleteFile(fileName: string) {
    this.logger.log(`Deleted file ${fileName}`);
    await this.minioClient.removeObject(
      this.config.get<string>('MINIO_BUCKET'),
      fileName,
    );
  }
}
