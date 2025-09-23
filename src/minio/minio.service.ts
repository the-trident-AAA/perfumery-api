import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';
import { v4 as guid } from 'uuid';

@Injectable()
export class MinioService {
  private minioClient: Client;
  private minioPublicClient: Client; // Cliente para URLs públicas
  private logger = new Logger('MinioService');

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    try {
      // Cliente para operaciones internas (upload, delete, etc.)
      this.minioClient = new Client({
        accessKey: this.config.get<string>('MINIO_ACCESS_KEY'),
        endPoint: this.config.get<string>('MINIO_URL'), // URL interna
        secretKey: this.config.get<string>('MINIO_SECRET_KEY'),
        port: parseInt(this.config.get<string>('MINIO_PORT')),
        useSSL: false,
      });

      // Cliente específico para generar URLs presigned públicas
      const publicUrl = this.config.get<string>('MINIO_PUBLIC_URL');
      if (publicUrl) {
        const url = new URL(publicUrl);
        this.minioPublicClient = new Client({
          accessKey: this.config.get<string>('MINIO_ACCESS_KEY'),
          endPoint: url.hostname,
          port: parseInt(url.port) || (url.protocol === 'https:' ? 443 : 80),
          secretKey: this.config.get<string>('MINIO_SECRET_KEY'),
          useSSL: url.protocol === 'https:',
        });
      } else {
        // Fallback al cliente interno si no hay URL pública configurada
        this.minioPublicClient = this.minioClient;
      }

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

      return await this.minioPublicClient.presignedGetObject(
        this.config.get<string>('MINIO_BUCKET'),
        objectName,
        expiryTime,
      );
    } catch (error) {
      this.logger.error(error);
      return null;
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

  async deleteFile(fileName: string): Promise<boolean> {
    try {
      const exists = await this.checkIfExist(fileName);
      if (!exists) {
        this.logger.warn(`El archivo ${fileName} no existe en el bucket`);
        return false;
      }

      await this.minioClient.removeObject(
        this.config.get<string>('MINIO_BUCKET'),
        fileName,
      );

      this.logger.log(`Archivo ${fileName} eliminado correctamente`);
      return true;
    } catch (error) {
      this.logger.error(`Error al eliminar el archivo ${fileName}`, error);
      throw error;
    }
  }
}
