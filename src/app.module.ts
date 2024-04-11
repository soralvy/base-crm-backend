import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './shared/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...configurations],
      envFilePath: ['.env'],
    }),
  ],
})
export class AppModule {}
