import { Module } from '@nestjs/common';
import {
  setupLoggerModule,
  setupTypeormModule,
  setupConfigModule,
} from './shared/lib';
import { modules } from './modules/exports';

@Module({
  imports: [
    setupConfigModule(),
    setupLoggerModule(),
    setupTypeormModule(),
    ...modules,
  ],
})
export class AppModule {}
