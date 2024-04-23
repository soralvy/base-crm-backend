import { Module } from '@nestjs/common';
import { RoleService } from './roles.service';
import { RoleRepository } from './roles.repository';

@Module({
  providers: [RoleService, RoleRepository],
  exports: [RoleService],
})
export class RolesModule {}
