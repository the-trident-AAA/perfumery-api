import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('AppBootstrap');
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  const port = config.get<number>('APP_PORT');

  //ValidationPipe global config
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: true,
    }),
  );

  //Swagger config
  const swagger = new DocumentBuilder()
    .setTitle('Perfumery project')
    .setDescription('API perfumery project')
    .setVersion('1.0')
    .addTag('codification')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(port);
  logger.log('🚀 Listening in port ' + port);
}
bootstrap();
