import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from '~/shared/common/base';
import { UserRole } from '~/shared/database/entities';

@Injectable()
export class RoleRepository extends BaseRepository<UserRole> {
  constructor(
    @InjectDataSource()
    dataSource: DataSource,
  ) {
    super(UserRole, dataSource);
  }
}
