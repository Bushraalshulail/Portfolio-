import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles/index.css';
import App from './App.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Gyms from './pages/Gyms.jsx';
import Terms from './pages/Terms.jsx';
import Privacy from './pages/Privacy.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.jsx';
import AdminStatistics from './pages/AdminStatistics.jsx';
import LandingPage from './pages/LandingPage.jsx';
import HomeRedirect from './pages/HomeRedirect.jsx';

// إعداد المسارات (Routing)
const router = createBrowserRouter([
  { path: '/', element: <HomeRedirect /> },
  { path: '/home', element: <App /> },
  { path: '/landing', element: <LandingPage /> },
  { path: '/auth', element: <AuthPage /> },
  { path: '/login', element: <AuthPage /> },
  { path: '/register', element: <AuthPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/gyms', element: <Gyms /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/terms', element: <Terms /> },
  { path: '/privacy', element: <Privacy /> },
  { 
    path: '/admin/statistics', 
    element: <AdminStatistics />,
    errorElement: <div style={{padding: '20px'}}>Error loading statistics page</div>
  },
  {
    path: '*',
    element: (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Page not found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/" style={{ color: '#0d9488', textDecoration: 'underline' }}>Go home</a>
      </div>
    )
  }
]);

// بدء تشغيل التطبيق
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>
);
