import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { type AllConfigType, validationOptions } from './shared/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import {
  AsyncResponseResolverInterceptor,
  LoggingInterceptor,
} from './shared/interceptors';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { setupSwaggerModule } from './shared/lib';
import { DatabaseExceptionFilter } from './shared/filters';
import {
  type NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import fastifyHelmet from '@fastify/helmet';

// todo: add cors
// todo: add health check
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );
  const configService = app.get(ConfigService<AllConfigType>);
  const httpAdapterHost = app.get(HttpAdapterHost);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableShutdownHooks();

  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalFilters(new DatabaseExceptionFilter(httpAdapterHost));
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    // AsyncResponseResolverInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new AsyncResponseResolverInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
    new LoggerErrorInterceptor(),
  );

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.flushLogs();

  app.register(fastifyHelmet);

  setupSwaggerModule(app, logger, configService);

  const port = configService.getOrThrow('app.port', { infer: true });
  await app.listen(port, '0.0.0.0');

  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
