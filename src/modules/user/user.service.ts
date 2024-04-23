import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { BaseSignUpByEmailDto } from '~/modules/user/dto';
import { UserStatus } from '~/shared/database/entities/user/types/user-status.enum';
import { RoleService } from '../roles/roles.service';
import { BaseService } from '~/shared/common/base';
import { UserEntity } from '~/shared/database/entities';
import { UserEmailAlreadyExistsException } from '~/shared/exceptions';

@Injectable()
export class UserService extends BaseService<UserEntity, UserRepository> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
  ) {
    super(userRepository);
  }

  async createUser(user: BaseSignUpByEmailDto) {
    const existingUser = await this.findUserByEmail(user.email);

    if (existingUser) {
      throw new UserEmailAlreadyExistsException();
    }

    const defaultRole = await this.roleService.findDefaultUserRole();

    return this.userRepository.createOrUpdate({
      ...user,
      roles: [defaultRole],
      status: UserStatus.WAITING_FOR_ADMIN_APPROVAL,
    });
  }

  async findUserByEmail(email: string) {
    return this.findOne(
      {
        where: {
          email: email.toLowerCase().trim(),
        },
      },
      false,
    );
  }
}
