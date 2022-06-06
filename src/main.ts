import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser'; 
const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const cookieSecret = process.env.SIGNED_COOKIE_SECRET;
  console.log("Starting bootstrapping process, server running on port " + PORT);
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser(cookieSecret)); 
  app.enableCors();
  await app.listen(PORT);
}
bootstrap();
