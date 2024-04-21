import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntityHelper } from '../helpers/entity-helper';
import { Expose } from 'class-transformer';
import { UserRole } from './roles/user-role.entity';

@Entity('users')
export class UserEntity extends BaseEntityHelper {
  @Expose()
  @Column({ type: String, unique: true, nullable: false, length: 320 })
  @Index({ unique: true })
  email!: string;

  @Expose()
  @Column({ type: String, nullable: false, length: 256 })
  name!: string;

  @Expose()
  @Column({ type: String, nullable: false, length: 256 })
  surname!: string;

  @ManyToMany(() => UserRole, { cascade: true, eager: false })
  @JoinTable({
    name: 'users_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles?: UserRole[];
}
