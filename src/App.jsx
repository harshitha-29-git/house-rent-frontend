import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Route Guards
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyListing from './pages/PropertyListing';
import PropertyDetails from './pages/PropertyDetails';
import AddProperty from './pages/AddProperty';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// Bootstrap JS (for dropdowns)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Layout = ({ children, noFooter = false }) => (
  <>
    <Navbar />
    <main>{children}</main>
    {!noFooter && <Footer />}
  </>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ToastContainer
            position="top-right"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="colored"
          />

          <Routes>
            {/* Public — with Navbar & Footer */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/properties" element={<Layout><PropertyListing /></Layout>} />
            <Route path="/properties/:id" element={<Layout><PropertyDetails /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />

            {/* Auth — no Navbar/Footer (full screen) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private — logged-in users only */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Layout><UserDashboard /></Layout>
              </PrivateRoute>
            } />
            <Route path="/add-property" element={
              <PrivateRoute>
                <Layout><AddProperty /></Layout>
              </PrivateRoute>
            } />

            {/* Admin only */}
            <Route path="/admin" element={
              <AdminRoute>
                <Layout noFooter><AdminDashboard /></Layout>
              </AdminRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
