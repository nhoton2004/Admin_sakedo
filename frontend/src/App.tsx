import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CustomersPage from './pages/CustomersPage';

// Old pages (keep for now)
import DashboardPage from './pages/DashboardPage';
import CategoriesPage from './pages/CategoriesPage';
import ProductsPage from './pages/ProductsPage';
import ReservationsPage from './pages/ReservationsPage';
import OrdersPage from './pages/OrdersPage';
import { DriversPage } from './pages/DriversPage';
import BannersPage from './pages/BannersPage';
import VideoPage from './pages/VideoPage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastProvider } from './components/ui/Toast';
import './index.css';

function App() {
    return (
        <ToastProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/admin/login" element={<LoginPage />} />

                    {/* New Lezato-Style Routes */}
                    <Route
                        path="/admin/analytics"
                        element={
                            <ProtectedRoute>
                                <AnalyticsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/customers"
                        element={
                            <ProtectedRoute>
                                <CustomersPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Old Routes (Legacy) */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/categories"
                        element={
                            <ProtectedRoute>
                                <CategoriesPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/products"
                        element={
                            <ProtectedRoute>
                                <ProductsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/reservations"
                        element={
                            <ProtectedRoute>
                                <ReservationsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/orders"
                        element={
                            <ProtectedRoute>
                                <OrdersPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/drivers"
                        element={
                            <ProtectedRoute>
                                <DriversPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/banners"
                        element={
                            <ProtectedRoute>
                                <BannersPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/video"
                        element={
                            <ProtectedRoute>
                                <VideoPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/about"
                        element={
                            <ProtectedRoute>
                                <AboutPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/settings"
                        element={
                            <ProtectedRoute>
                                <SettingsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Default Redirect - Changed to Analytics */}
                    <Route path="*" element={<Navigate to="/admin/analytics" replace />} />
                </Routes>
            </BrowserRouter>
        </ToastProvider>
    );
}

export default App;
