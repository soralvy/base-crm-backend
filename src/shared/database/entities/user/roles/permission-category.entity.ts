import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { Expose } from 'class-transformer';
import { IsUUID, IsString, MaxLength, MinLength } from 'class-validator';
import { BaseEntityHelper } from '../../helpers/entity-helper';

@Entity('permission_categories')
export class PermissionCategory extends BaseEntityHelper {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  @IsUUID()
  id!: string;

  @Column({ type: String, length: 512, nullable: false })
  @Expose()
  @Index({ unique: true })
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

  @OneToMany(
    () => Permission,
    (permission) => permission.permissionCategoryId,
    { eager: false },
  )
  permissions!: Permission[];
}
