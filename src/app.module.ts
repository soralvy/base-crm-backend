import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './shared/config';
import { setupLoggerModule } from './shared/lib';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...configurations],
      envFilePath: ['.env'],
    }),
    setupLoggerModule(),
  ],
})
export class AppModule {}
