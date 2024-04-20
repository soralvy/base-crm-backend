import { TypeOrmModule } from '@nestjs/typeorm';
import { type DataSourceOptions, DataSource } from 'typeorm';
import { TypeOrmConfigService } from '~/shared/database';

export const setupTypeormModule = () => {
  return TypeOrmModule.forRootAsync({
    useClass: TypeOrmConfigService,
    dataSourceFactory: async (options: DataSourceOptions) => {
      return new DataSource(options).initialize();
    },
  });
};
