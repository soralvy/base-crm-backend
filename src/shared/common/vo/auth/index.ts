import { OmitType } from '@nestjs/swagger';
import { DEFAULT_ENTITY_EXCLUDE_LIST } from '~/shared/database/config/dto-exclude-lists';
import { UserEntity } from '~/shared/database/entities';

export class BaseSignUpByEmailResponse extends OmitType(UserEntity, [
  ...DEFAULT_ENTITY_EXCLUDE_LIST,
  'deletedAt',
] as const) {}
