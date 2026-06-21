export interface IRepository<T> {
  getByID(id: string): Promise<T | null>;
  get(filter?: Partial<Record<string, unknown>>): Promise<T[]>;
  put(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}
