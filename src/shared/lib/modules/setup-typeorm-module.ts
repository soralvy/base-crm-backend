import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from '~/shared/database';

export const setupTypeormModule = () => {
  return TypeOrmModule.forRootAsync({
    useClass: TypeOrmConfigService,
    dataSourceFactory: async (options?: DataSourceOptions) => {
      if (!options) {
        throw new Error('Can not initialize data source, options are empty');
      }

      const dataSource = new DataSource(options);

      return await dataSource.initialize();
    },
  });
};
