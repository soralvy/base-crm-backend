import { type INestApplication } from '@nestjs/common';
import { type ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { type Logger } from 'nestjs-pino';

const SWAGGER_PATH = 'docs';

export const setupSwaggerModule = (
  app: INestApplication,
  logger: Logger,
  configService: ConfigService,
) => {
  const backendDomain = configService.getOrThrow('app.backendDomain', {
    infer: true,
  });

  const port = configService.getOrThrow('app.port', {
    infer: true,
  });

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  logger.log(
    `Swagger module is listening on ${backendDomain}:${port}/${SWAGGER_PATH}`,
  );

  return document;
};
