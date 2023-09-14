import { Entity } from '../models/entity';

export interface BaseRepository<T extends Entity> {
  /**
   * @param id
   */
  getAsync(id: string): Promise<T | null>;

  /**
   * @param ids
   */
  getManyAsync(ids: string[]): Promise<T[]>;

  /**
   * @param entity
   * @returns id of newly created entity
   */
  addAsync(entity: T): Promise<T | null>;

  /**
   * @param entity
   */
  updateAsync(entity: T): Promise<boolean>;
}
