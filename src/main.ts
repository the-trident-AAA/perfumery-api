import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Swagger config
  const config = new DocumentBuilder()
    .setTitle('Perfumery project')
    .setDescription('API perfumery project')
    .setVersion('1.0')
    .addTag('codification')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
