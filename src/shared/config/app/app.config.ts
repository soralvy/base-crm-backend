import { registerAs } from '@nestjs/config';
import { AppConfig } from './app-config.type';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { validateConfig } from '../../lib';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65_535)
  @IsOptional()
  APP_PORT: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;

  @IsString()
  @IsOptional()
  API_PREFIX: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  const defaultPort = 3000;
  const port = Number.parseInt(
    process.env.APP_PORT || process.env.PORT || defaultPort.toString(),
    10,
  );

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'app',
    frontendDomain: process.env.FRONTEND_DOMAIN ?? 'http://localhost',
    port,
    apiPrefix: process.env.API_PREFIX || 'api',
  };
});
