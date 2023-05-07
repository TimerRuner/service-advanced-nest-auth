import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function start() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 4000

  app.setGlobalPrefix("api")
  await app.listen(PORT, () => console.log(`Server starts at http://localhost:${PORT}`));
}


start();
