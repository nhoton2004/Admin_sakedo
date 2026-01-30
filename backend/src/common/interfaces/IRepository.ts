/**
 * Base Repository Interface
 * Defines common CRUD operations for all repositories
 */
export interface IRepository<T> {
    /**
     * Find all entities with optional filters
     */
    findAll(filters?: any): Promise<T[]>;

    /**
     * Find entity by ID
     */
    findById(id: string): Promise<T | null>;

    /**
     * Create new entity
     */
    create(data: any): Promise<T>;

    /**
     * Update existing entity
     */
    update(id: string, data: any): Promise<T | null>;
}
