import { type LoggerConfig } from '.';
import { type AppConfig } from './app/app-config.type';
import appConfig from './app/app.config';
import loggerConfig from './logger/logger.config';

export type AllConfigType = {
  app: AppConfig;
  logger: LoggerConfig;
};

export const configurations = [appConfig, loggerConfig];
