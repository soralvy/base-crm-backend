import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllConfigType, validationOptions } from './shared/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AsyncResponseResolverInterceptor } from './shared/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AllConfigType>);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

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
  app.useGlobalInterceptors(
    // AsyncResponseResolverInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new AsyncResponseResolverInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}

bootstrap();
