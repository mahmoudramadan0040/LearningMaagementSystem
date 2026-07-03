import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { join } from 'path';
import fastifyStatic from '@fastify/static';
import { appLogger } from './common/logger/winston-logger';
import fastifyHelmet from '@fastify/helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useLogger({
    log: (message) => appLogger.info(message),
    error: (message) => appLogger.error(message),
    warn: (message) => appLogger.warn(message),
    debug: (message) => appLogger.debug(message),
    verbose: (message) => appLogger.verbose(message),
  });
  const config = new DocumentBuilder()
    .setTitle('Learning Management System API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token (without Bearer prefix)',
        in: 'header',
      },
      'access-token', // name for reference
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.register(multipart);
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: false,
  });
  await app.register(fastifyStatic, {
    root: join(__dirname, '..', 'uploads'),
    prefix: '/uploads/',
  });
  await app.register(cors, {
    origin: 'http://localhost:3000', // allow your Next.js frontend
    credentials: true, // allow cookies/auth headers if needed
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // optional
    allowedHeaders: ['Content-Type', 'Authorization'], // optional
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
