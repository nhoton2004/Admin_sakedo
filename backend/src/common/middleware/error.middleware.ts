import { Request, Response, NextFunction } from 'express';

export class ErrorHandler {
    /**
     * Global error handler middleware
     */
    public static handle(
        error: any,
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        console.error('Error:', error);

        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal server error';

        res.status(statusCode).json({
            message,
            ...(error.details && { details: error.details }),
        });
    }

    /**
     * 404 Not Found handler
     */
    public static notFound(req: Request, res: Response): void {
        res.status(404).json({ message: 'Route not found' });
    }
}

/**
 * Custom error class
 */
export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public details?: any
    ) {
        super(message);
        this.name = 'AppError';
    }
}
