import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as cors from "cors"
import { createProxyMiddleware } from 'http-proxy-middleware';


async function start() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 4000

  app.use(cookieParser())
  app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }))

  app.setGlobalPrefix("api")
  await app.listen(PORT, () => console.log(`Server starts at http://localhost:${PORT}`));
}


start();
