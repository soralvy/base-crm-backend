import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from '~/shared/database';
import { UserEntity } from '~/shared/database/entities';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectDataSource()
    dataSource: DataSource,
  ) {
    super(UserEntity, dataSource);
  }
}
