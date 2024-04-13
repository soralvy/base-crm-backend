import { type LoggerConfig } from '.';
import { type AppConfig } from './app/app-config.type';
import { type DatabaseConfig } from '../../database/config/database-config.type';
import appConfig from './app/app.config';
import loggerConfig from './logger/logger.config';
import databaseConfig from '../../database/config/database.config';

export type AllConfigType = {
  app: AppConfig;
  logger: LoggerConfig;
  database: DatabaseConfig;
};

export const configurations = [appConfig, loggerConfig, databaseConfig];
