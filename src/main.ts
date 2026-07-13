import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //   }),
  // ); - This code is commented out because it was causing issues with the validation of the DTOs. The validation pipe was not correctly validating the incoming requests, leading to unexpected behavior. Further investigation is needed to determine the root cause of the issue and implement a proper solution for request validation.
  
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}
bootstrap();
