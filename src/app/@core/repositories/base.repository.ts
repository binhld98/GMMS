import { Entity } from '../models/entity';

export type BaseRepository<T extends Entity> = {
  /**
   * @param id
   */
  getAsync(id: string): Promise<T | null>;

  /**
   * @param ids
   */
  getManyAsync(ids: string[]): Promise<T[] | []>;

  /**
   * Auto generated id for entity
   *
   * @param entity
   */
  addAsync(entity: T): Promise<T | null>;

  /**
   * @param entity
   */
  updateAsync(entity: T): Promise<boolean>;
};
