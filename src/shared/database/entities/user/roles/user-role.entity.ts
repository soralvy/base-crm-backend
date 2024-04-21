import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntityHelper } from '../../helpers/entity-helper';
import { RoleType } from './types/role-type.enum';
import { Permission } from './permission.entity';

@Entity('roles')
export class UserRole extends BaseEntityHelper {
  @Column({ type: String, length: 512, nullable: false })
  @Expose()
  @IsString()
  @MinLength(1)
  @MaxLength(512)
  name!: string;

  @Column({ type: String, length: 1024, nullable: false })
  @Expose()
  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  description!: string;

  @Column({
    type: 'enum',
    enum: RoleType,
    nullable: true,
  })
  @Expose()
  @IsOptional()
  @IsEnum(RoleType)
  roleType?: RoleType;

  @ManyToMany(() => Permission, { cascade: true, eager: false })
  @JoinTable({
    name: 'user_roles_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions?: Permission[];
}
