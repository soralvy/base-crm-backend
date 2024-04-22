import {
  Repository,
  type EntityTarget,
  type DataSource,
  type DeepPartial,
  type FindOptionsWhere,
  type FindManyOptions,
  type FindOneOptions,
  IsNull,
} from 'typeorm';
import { type BaseEntityHelper } from '../../database/entities';
import { type QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

export abstract class BaseRepository<
  ENTITY extends BaseEntityHelper,
> extends Repository<ENTITY> {
  protected constructor(
    protected entityTarget: EntityTarget<ENTITY>,
    protected dataSource: DataSource,
  ) {
    const entityManager = dataSource.createEntityManager();
    super(entityTarget, entityManager);
  }

  /**
   * Creates or updates an entity.
   * @param entity The entity data.
   * @returns The created or updated entity.
   */
  async createOrUpdate(entity: DeepPartial<ENTITY>): Promise<ENTITY> {
    const createdOrUpdatedEntity = this.create(entity);
    return this.save(createdOrUpdatedEntity);
  }

  /**
   * Finds a single entity by its ID, with options to include deleted entities.
   * @param id The entity ID.
   * @param withDeleted Includes deleted entities if set to true.
   * @param where Additional query conditions.
   * @returns The found entity or null.
   */
  async findById(
    id: ENTITY['id'],
    withDeleted = false,
    where: FindOptionsWhere<ENTITY> = {},
  ): Promise<ENTITY | null> {
    return await this.findOne(
      this.presetDefaultFilterOptions({
        where: {
          ...where,
          id,
        },
        withDeleted,
      }),
    );
  }

  /**
   * Archives (soft deletes) an entity by its ID and version.
   * @param id The entity ID.
   * @param version The entity version for optimistic locking.
   * @returns True if the operation affected one entity.
   */
  async archive(id: ENTITY['id'], version: number) {
    const result = await this.update(
      this.presetDefaultWhereOptions({
        id,
        version,
        deletedAt: IsNull(),
      } as FindOptionsWhere<NonNullable<ENTITY>>),
      {
        deletedAt: new Date(),
      } as unknown as QueryDeepPartialEntity<ENTITY>,
    );

    return result.affected === 1;
  }

  /**
   * A utility method to prepare filter options for queries.
   * @param currentOptions The current options.
   * @returns The adjusted query options.
   */
  protected presetDefaultFilterOptions<
    T extends FindOneOptions<ENTITY> | FindManyOptions<ENTITY> | undefined,
  >(currentOptions: T): T {
    if (!currentOptions) {
      return {
        where: {
          ...this.presetDefaultWhereOptions({}),
        },
      } as T;
    }

    currentOptions.where = Array.isArray(currentOptions.where)
      ? currentOptions.where.map((condition) => {
          return this.presetDefaultWhereOptions(condition);
        })
      : this.presetDefaultWhereOptions(currentOptions.where);

    return currentOptions;
  }

  protected presetWhereOptions<
    T extends FindOptionsWhere<ENTITY> | FindOptionsWhere<ENTITY>[],
  >(where: T): T {
    return Array.isArray(where)
      ? (where.map((condition) => {
          return this.presetDefaultWhereOptions(condition);
        }) as T)
      : (this.presetDefaultWhereOptions(
          where as FindOptionsWhere<ENTITY>,
        ) as T);
  }

  protected presetDefaultWhereOptions<
    T extends FindOptionsWhere<ENTITY> | undefined,
  >(currentOptions: T): T {
    return currentOptions;
  }
}
