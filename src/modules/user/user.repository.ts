import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseSignUpByEmailDto } from '~/modules/user/dto';
import { UserEntity } from '~/shared/database/entities';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(
    // todo: generalize in abstract baserepository
    @InjectDataSource()
    dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {
    const entityManager = dataSource.createEntityManager();
    super(UserEntity, entityManager);
  }

  async createUser(user: BaseSignUpByEmailDto) {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }
}
