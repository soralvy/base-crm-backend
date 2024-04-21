import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { BaseSignUpByEmailDto } from '~/modules/user/dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(user: BaseSignUpByEmailDto) {
    return this.userRepository.createOrUpdate(user);
  }
}
