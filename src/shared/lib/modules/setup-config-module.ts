import { ConfigModule } from '@nestjs/config';
import { configurations } from '~/shared/config';

export const setupConfigModule = () => {
  return ConfigModule.forRoot({
    isGlobal: true,
    load: configurations,
    envFilePath: ['.env'],
  });
};
