import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from 'src/database/typeorm-config.service';
import { type DataSourceOptions, DataSource } from 'typeorm';

export const setupTypeormModule = () => {
  return TypeOrmModule.forRootAsync({
    useClass: TypeOrmConfigService,
    dataSourceFactory: async (options: DataSourceOptions) => {
      return new DataSource(options).initialize();
    },
  });
};
