import { type AppConfig } from './app-config.type';
import appConfig from './app.config';

export type AllConfigType = {
  app: AppConfig;
};

export const configurations = [appConfig];
