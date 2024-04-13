import { type AllConfigType } from './config';

export const CONFIG_KEYS: Record<keyof AllConfigType, keyof AllConfigType> = {
  app: 'app',
  logger: 'logger',
  database: 'database',
} as const;
