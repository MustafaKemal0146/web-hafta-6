import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Prefix
  app.setGlobalPrefix('api');

  // Helmet - Güvenlik header'ları
  app.use(helmet());

  // CORS
  app.enableCors();

  // Global ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // DTO'da olmayan alanları sil
      forbidNonWhitelisted: true, // Bilinmeyen alan varsa 400
      transform: true,           // string "1" -> number 1
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('NestKatalog API')
    .setDescription('E-ticaret Ürün Kataloğu REST API — Hafta 6 Lab')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`API çalışıyor: http://localhost:${port}/api`);
  console.log(`Swagger: http://localhost:${port}/api-docs`);
}

bootstrap();
