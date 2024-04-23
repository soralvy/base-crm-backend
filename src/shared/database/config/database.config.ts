import { registerAs } from '@nestjs/config';
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  ValidateIf,
  IsBoolean,
} from 'class-validator';
import { DatabaseConfig } from './database-config.type';
import { CONFIG_KEYS } from '~/shared/config';
import { validateConfig } from '~/shared/lib';
import { NamingStrategyInterface } from 'typeorm/naming-strategy/NamingStrategyInterface';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

class DatabaseCredentials {
  @IsString()
  host!: string;

  @IsInt()
  @Min(0)
  @Max(65_535)
  port!: number;

  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsString()
  name!: string;
}

class SSLConfig {
  @IsBoolean()
  @IsOptional()
  enabled!: boolean;

  @IsBoolean()
  @IsOptional()
  rejectUnauthorized!: boolean;

  @IsString()
  @IsOptional()
  ca!: string;

  @IsString()
  @IsOptional()
  key!: string;

  @IsString()
  @IsOptional()
  cert!: string;
}

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.DATABASE_URL)
  @IsString()
  DATABASE_URL!: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsOptional()
  credentials!: DatabaseCredentials;

  @IsOptional()
  ssl!: SSLConfig;

  @IsBoolean()
  @IsOptional()
  synchronize!: boolean;

  @IsOptional()
  namingStrategy: NamingStrategyInterface = new SnakeNamingStrategy();

  @IsBoolean()
  @IsOptional()
  autoLoadEntities = true;

  @IsBoolean()
  @IsOptional()
  migrationsRun = true;

  @IsInt()
  @IsOptional()
  maxConnections!: number;
}

export default registerAs<DatabaseConfig>(CONFIG_KEYS.database, () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    url: process.env.DATABASE_URL,
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
      ? Number.parseInt(process.env.DATABASE_PORT, 10)
      : 5432,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    maxConnections: process.env.DATABASE_MAX_CONNECTIONS
      ? Number.parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
      : 100,
    sslEnabled: process.env.DATABASE_SSL_ENABLED === 'true',
    rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
    autoLoadEntities: process.env.DATABASE_AUTO_LOAD_ENTITIES === 'true',
    ca: process.env.DATABASE_CA,
    key: process.env.DATABASE_KEY,
    cert: process.env.DATABASE_CERT,
  } satisfies DatabaseConfig;
});
