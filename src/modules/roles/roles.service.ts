import { Injectable } from '@nestjs/common';
import { RoleType, UserRole } from '~/shared/database/entities';
import { RoleRepository } from './roles.repository';
import { BaseService } from '~/shared/common/base';

@Injectable()
export class RoleService extends BaseService<UserRole, RoleRepository> {
  constructor(readonly roleRepository: RoleRepository) {
    super(roleRepository);
  }

  async findDefaultUserRole() {
    return this.findDefaultRoleByType(RoleType.REGULAR_USER);
  }

  private findDefaultRoleByType(roleType: RoleType) {
    return this.findOne({
      where: [
        {
          roleType,
        },
      ],
      cache: true,
    });
  }
}
