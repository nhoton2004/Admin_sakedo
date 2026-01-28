import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config';
import { connectDatabase } from './config/database';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { ErrorHandler } from './common/middleware/error.middleware';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import bannersRoutes from './modules/banners/banners.routes';
import homeRoutes from './modules/home/home.routes';
import aboutRoutes from './modules/about/about.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import productsRoutes from './modules/products/products.routes';
import reservationsRoutes from './modules/reservations/reservations.routes';
import ordersRoutes from './modules/orders/orders.routes';
import usersRoutes from './modules/users/users.routes';
import statsRoutes from './modules/stats/stats.routes';
import { driverRoutes } from './modules/drivers/drivers.routes';
import analyticsRoutes from './modules/analytics';

/**
 * Main Express application
 */
class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    /**
     * Initialize middlewares
     */
    private initializeMiddlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    /**
     * Initialize all routes
     */
    private initializeRoutes(): void {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ status: 'ok', message: 'Server is running' });
        });

        // Auth routes (public + protected)
        this.app.use('/admin/auth', authRoutes);

        // Admin routes (protected, admin only)
        this.app.use(
            '/admin/categories',
            AuthMiddleware.verifyToken,
            AuthMiddleware.requireAdmin,
            categoriesRoutes
        );

        this.app.use(
            '/admin/products',
            AuthMiddleware.verifyToken,
            AuthMiddleware.requireAdmin,
            productsRoutes
        );

        this.app.use(
            '/admin/reservations',
            AuthMiddleware.verifyToken,
            AuthMiddleware.requireAdmin,
            reservationsRoutes
        );

        this.app.use(
            '/admin/orders',
            AuthMiddleware.verifyToken,
            AuthMiddleware.requireAdmin,
            ordersRoutes
        );

        this.app.use(
            '/admin/users',
            AuthMiddleware.verifyToken,
            AuthMiddleware.requireAdmin,
            AuthMiddleware.requireAdmin,
            usersRoutes
        );

        this.app.use(
            '/admin/drivers',
            AuthMiddleware.verifyToken,
            AuthMiddleware.requireAdmin,
            driverRoutes
        );

        // Stats endpoint
        this.app.use(
            '/admin/stats',
            AuthMiddleware.verifyToken,
            AuthMiddleware.requireAdmin,
            statsRoutes
        );

        // Home management routes
        this.app.use(
            '/admin/banners',
            AuthMiddleware.verifyToken,
            AuthMiddleware.requireAdmin,
            bannersRoutes
        );

        this.app.use(
            '/admin/home',
            AuthMiddleware.verifyToken,
            AuthMiddleware.requireAdmin,
            homeRoutes
        );

        this.app.use(
            '/admin/about',
            AuthMiddleware.verifyToken,
            AuthMiddleware.requireAdmin,
            aboutRoutes
        );

        // Analytics routes (admin and staff)
        this.app.use('/admin/analytics', analyticsRoutes);
    }

    /**
     * Initialize error handling
     */
    private initializeErrorHandling(): void {
        this.app.use(ErrorHandler.notFound);
        this.app.use(ErrorHandler.handle);
    }

    /**
     * Start the server
     */
    public async listen(): Promise<void> {
        // Connect to MongoDB first
        await connectDatabase();

        this.app.listen(config.port, () => {
            console.log(`🚀 Server is running on port ${config.port}`);
            console.log(`📍 Health check: http://localhost:${config.port}/health`);
            console.log(`🔐 Admin login: http://localhost:${config.port}/admin/auth/login`);
            console.log(`\n📝 Default admin credentials:`);
            console.log(`   Email: admin@akedo.local`);
            console.log(`   Password: Admin@123\n`);
        });
    }
}

// Create and start the server
const app = new App();
app.listen();

export default App;
