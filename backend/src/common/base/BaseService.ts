import { IRepository } from '../interfaces';
import { AppError } from '../middleware/error.middleware';

/**
 * Base Service Class
 * Provides common CRUD operations and error handling for all services
 * Implements Inheritance (OOP) and DRY principles
 */
export abstract class BaseService<T> {
    constructor(protected repository: IRepository<T>) { }

    /**
     * Get all entities with optional filters
     */
    public async getAll(filters?: any): Promise<T[]> {
        try {
            return await this.repository.findAll(filters);
        } catch (error) {
            this.handleError(error, 'getAll');
            throw error;
        }
    }

    /**
     * Get entity by ID
     */
    public async getById(id: string): Promise<T> {
        try {
            const entity = await this.repository.findById(id);

            if (!entity) {
                throw new AppError(404, `${this.entityName} not found`);
            }

            return entity;
        } catch (error) {
            this.handleError(error, 'getById');
            throw error;
        }
    }

    /**
     * Create new entity
     */
    public async create(data: any): Promise<T> {
        try {
            return await this.repository.create(data);
        } catch (error) {
            this.handleError(error, 'create');
            throw error;
        }
    }

    /**
     * Update entity
     */
    public async update(id: string, data: any): Promise<T> {
        try {
            // Check if entity exists first
            await this.getById(id);

            const updated = await this.repository.update(id, data);

            if (!updated) {
                throw new AppError(500, `Failed to update ${this.entityName}`);
            }

            return updated;
        } catch (error) {
            this.handleError(error, 'update');
            throw error;
        }
    }

    /**
     * Common error handler
     * Can be overridden by child classes for custom logging
     */
    protected handleError(error: any, operation: string): void {
        console.error(`[${this.entityName}Service.${operation}] Error:`, error.message || error);
    }

    /**
     * Abstract property - must be implemented by child classes
     * Used for error messages and logging
     */
    protected abstract get entityName(): string;
}
