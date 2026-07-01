import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../features/auth/pages/LoginPage';
import OverviewPage from '../features/dashboard/pages/OverviewPage';
import ProductsPage from '../features/products/pages/ProductsPage';
import SalesPage from '../features/sales/pages/SalesPage';
import ForecastingPage from '../features/forecasting/pages/ForecastingPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/forecasting" element={<ForecastingPage />} />
        </Route>
      </Route>

      {/* Wildcard Fallback: Redirect to main page (which forces login if unauthenticated) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
