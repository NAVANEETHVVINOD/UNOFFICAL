import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { ConfigService } from '@nestjs/config';
import { CorsConfig } from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const corsConfig = app.get(CorsConfig);

  Sentry.init({
    dsn: configService.get('SENTRY_DSN'),
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });

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

  // CORS - using centralized CorsConfig
  app.enableCors(corsConfig.getCorsOptions());

  // Start server
  // Render deployment fix: Use process.env.PORT
  const port = process.env.PORT || 4000;

  // Logger
  const { WINSTON_MODULE_NEST_PROVIDER } = require('nest-winston');
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Global Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Ensure Prisma connects before starting
  const { PrismaService } = require('./prisma/prisma.service');
  const prismaService = app.get(PrismaService);
  await prismaService.$connect();
  console.log('Prisma connected successfully.');

  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
