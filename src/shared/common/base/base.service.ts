import { type BaseEntityHelper } from '~/shared/database/entities';
import { type BaseRepository } from './base.repository';
import { capitalizeWords } from '~/shared/lib';
import { type FindOneOptions } from 'typeorm';
import { EntityNotFoundException } from './exceptions';

export class BaseService<
  ENTITY extends BaseEntityHelper,
  REPOSITORY extends BaseRepository<ENTITY>,
> {
  protected entityFriendlyName: string;

  constructor(protected readonly repository: REPOSITORY) {
    this.entityFriendlyName = capitalizeWords(repository.metadata.tableName);
  }

  /**
   * Finds one entity based on the provided options.
   * If `throwExceptionIfEntityNotFound` is true (or omitted), and the entity is not found, it throws a NotFoundException.
   * @param findOptions Options to find the entity
   * @returns The found entity
   * @throws NotFoundException if the entity is not found and `throwExceptionIfEntityNotFound` is true
   */
  async findOne(
    findOptions: FindOneOptions<ENTITY>,
    throwExceptionIfEntityNotFound?: true,
  ): Promise<ENTITY>;

  /**
   * Finds one entity based on the provided options.
   * If `throwExceptionIfEntityNotFound` is false, and the entity is not found, it returns undefined without throwing an exception.
   * @param findOptions Options to find the entity
   * @returns The found entity or undefined if not found and `throwExceptionIfEntityNotFound` is false
   */
  async findOne(
    findOptions: FindOneOptions<ENTITY>,
    throwExceptionIfEntityNotFound: false,
  ): Promise<ENTITY | undefined>;

  /**
   * Implementation of the findOne method with optional throwing behavior.
   * This method determines the return type and whether to throw based on the value of `throwExceptionIfEntityNotFound`.
   * @param findOptions Options to find the entity
   * @param throwExceptionIfEntityNotFound Indicates whether to throw a NotFoundException if the entity is not found
   * @returns The found entity or undefined
   */
  async findOne(
    findOptions: FindOneOptions<ENTITY>,
    throwExceptionIfEntityNotFound = true,
  ): Promise<ENTITY | undefined> {
    const entity = await this.repository.findOne(findOptions);

    if (!entity && throwExceptionIfEntityNotFound) {
      throw new EntityNotFoundException(this.entityFriendlyName);
    }

    return entity ?? undefined;
  }
}
