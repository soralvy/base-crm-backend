import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './shared/config';
import { setupLoggerModule, setupTypeormModule } from './shared/lib';
import { modules } from './modules/exports';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configurations,
      envFilePath: ['.env'],
    }),
    setupLoggerModule(),
    setupTypeormModule(),
    ...modules,
  ],
})
export class AppModule {}
