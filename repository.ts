// Base shape shared by all stored entities
export interface BaseEntity {
  id: number;
  createdAt: Date;
}

// Generic in-memory repository with CRUD operations
export class Repository<T extends BaseEntity> {
  private items: T[] = [];

  // Creates and saves a new entity instance
  create(item: Omit<T, 'id' | 'createdAt'>): T {
    const entity = { ...item, id: Date.now(), createdAt: new Date() } as T;
    this.items.push(entity);
    return entity;
  }

  // Returns all stored entities
  getAll(): T[] {
    return this.items;
  }

  // Finds an entity by its id
  getById(id: number): T | undefined {
    return this.items.find(i => i.id === id);
  }

  // Applies partial updates to an existing entity
  update(id: number, patch: Partial<Omit<T, 'id' | 'createdAt'>>): T | undefined {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx === -1) return undefined;
    this.items[idx] = { ...this.items[idx], ...patch } as T;
    return this.items[idx];
  }

  // Deletes an entity by id; returns true if removed
  delete(id: number): boolean {
    const before = this.items.length;
    this.items = this.items.filter(i => i.id !== id);
    return this.items.length < before;
  }
}
