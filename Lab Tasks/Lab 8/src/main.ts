import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = process.env.PORT || 3008;
  await app.listen(port);
  console.log(`====================================================`);
  console.log(` ETHNC E-Commerce NestJS Backend (Lab 8)`);
  console.log(` Server is running on: http://localhost:${port}`);
  console.log(` Health check: http://localhost:${port}/health`);
  console.log(` Products:     http://localhost:${port}/products`);
  console.log(` Users:        http://localhost:${port}/users`);
  console.log(` Cart:         http://localhost:${port}/cart/:userId`);
  console.log(` Orders:       http://localhost:${port}/orders`);
  console.log(`====================================================`);
}
bootstrap();
