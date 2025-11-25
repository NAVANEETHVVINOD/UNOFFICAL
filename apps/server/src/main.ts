import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Security
  app.use(helmet());
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://linker-inky.vercel.app',
      'https://linker-fg6pbxoix-navaneethvvinods-projects.vercel.app',
      process.env.CORS_ORIGIN,
    ].filter(Boolean),
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    exposedHeaders: ['Authorization'],
  });

  // Start server
  // Render deployment fix: Use process.env.PORT
  const port = process.env.PORT || 4000;

  // Logger
  const { WINSTON_MODULE_NEST_PROVIDER } = require('nest-winston');
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Global Filter
  const { AllExceptionsFilter } = require('./common/filters/all-exceptions.filter');
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
