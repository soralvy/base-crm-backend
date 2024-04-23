import { type Type } from '@nestjs/common';
import { TypeOrmModule, type TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSource, type MixedList, type DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from '~/shared/database';

export interface SetupTypeormOptions {
  optionsFactory?: Type<TypeOrmOptionsFactory>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  migrations?: MixedList<Function>;
}

const DEFAULT_SETUP_TYPEORM_OPTIONS: SetupTypeormOptions = {
  optionsFactory: TypeOrmConfigService,
  migrations: [],
};

export const setupTypeormModule = (
  setupTypeormOptions?: SetupTypeormOptions,
) => {
  const baseOptions = {
    ...DEFAULT_SETUP_TYPEORM_OPTIONS,
    ...setupTypeormOptions,
  };

  return TypeOrmModule.forRootAsync({
    useClass: baseOptions.optionsFactory,
    dataSourceFactory: async (dataSourceOptions?: DataSourceOptions) => {
      if (!dataSourceOptions) {
        throw new Error('Can not initialize data source, options are empty');
      }

      const options = {
        ...dataSourceOptions,
        migrations: baseOptions.migrations,
      };

      const dataSource = new DataSource(options);

      return await dataSource.initialize();
    },
  });
};
