import { Module } from '@nestjs/common';
import {
  setupLoggerModule,
  setupTypeormModule,
  setupConfigModule,
} from './shared/lib';
import { modules } from './modules/exports';
import * as Migrations from './shared/database/migrations';

@Module({
  imports: [
    setupConfigModule(),
    setupLoggerModule(),
    setupTypeormModule({ migrations: Migrations }),
    ...modules,
  ],
})
export class AppModule {}
