import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser'; 
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const cookieSecret = process.env.SIGNED_COOKIE_SECRET;
  console.log("Starting bootstrapping process, server running on port " + PORT);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser(cookieSecret)); 
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(PORT);
}
bootstrap();
