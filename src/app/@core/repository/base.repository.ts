import { Entity } from "../models/entity";

export interface BaseRepository<T extends Entity> {
  getAsync(id: string): Promise<T | null>
  getManyAsync(ids: string[]): Promise<T[]>
}