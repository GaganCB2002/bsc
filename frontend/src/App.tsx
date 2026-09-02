import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerService from './pages/CustomerService';
import CartPage from './pages/CartPage';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';

import CustomerLayout from './layouts/CustomerLayout';
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerOrders from './pages/customer/Orders';
import CustomerWishlist from './pages/customer/Wishlist';
import CustomerAddresses from './pages/customer/Addresses';
import CustomerSettings from './pages/customer/Settings';

import AdminLayout from './layouts/AdminLayout';
import Overview from './pages/admin/Overview';
import Inventory from './pages/admin/Inventory';
import Catalog from './pages/admin/Catalog';
import UserRoles from './pages/admin/UserRoles';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import Marketing from './pages/admin/Marketing';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import NewProduct from './pages/admin/NewProduct';
import Coupons from './pages/admin/Coupons';

// New Learning LMS Pages
import LearningPage from './pages/learning/LearningPage';

import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/Toast';

function NotFound() {
  useEffect(() => { document.title = '404 Not Found - BSC Exclusive'; }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F1F5F9', textAlign: 'center', padding: '24px' }}>
      <span style={{ fontSize: '4rem', fontWeight: 900, color: '#B91C1C', lineHeight: 1, marginBottom: '8px' }}>404</span>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 300, color: '#1A1A2E', marginBottom: '8px' }}>Page not found</h1>
      <p style={{ fontSize: '0.9rem', color: '#8A7A6A', marginBottom: '24px' }}>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: '#B91C1C', color: '#fff', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Back to Home</Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CategoryPage />} />
        <Route path="/about" element={<LandingPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customer-service" element={<CustomerService />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        
        {/* Auth / LMS Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><CustomerLayout /></ProtectedRoute>}>
          <Route index element={<CustomerDashboard />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="wishlist" element={<CustomerWishlist />} />
          <Route path="addresses" element={<CustomerAddresses />} />
          <Route path="settings" element={<CustomerSettings />} />
        </Route>

        <Route path="/learning/:courseId" element={<ProtectedRoute><LearningPage /></ProtectedRoute>} />

        {/* Customer Legacy Routes (redirecting to new dashboard) */}
        <Route path="/customer" element={<Navigate to="/dashboard" replace />} />
        <Route path="/customer/orders" element={<Navigate to="/dashboard/orders" replace />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="roles" element={<UserRoles />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="products/new" element={<NewProduct />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
