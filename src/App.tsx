import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import LoginPage from './components/LoginPage';
import { Layout } from './components/common/Layout';
import { DashboardPage } from './components/pages/DashboardPage';
import { ApproversPage } from './components/pages/ApproversPage';
import { ApprovalsPage } from './components/pages/ApprovalsPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import SitesPage from './components/pages/SitesPage';
import { SiteDetailPage } from './components/pages/SiteDetailPage';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        overflow: 'hidden',
        fontSize: '16px',
        color: '#605e5c',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f2f1',
            borderTop: '4px solid #0078d4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px auto'
          }}></div>
          <p>Loading BMS Teams App...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const LoginRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        overflow: 'hidden',
        fontSize: '16px',
        color: '#605e5c',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f2f1',
            borderTop: '4px solid #0078d4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px auto'
          }}></div>
          <p>Loading BMS Teams App...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If already authenticated, redirect to dashboard
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/approvers" element={
          <ProtectedRoute>
            <Layout>
              <ApproversPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/approvals" element={
          <ProtectedRoute>
            <Layout>
              <ApprovalsPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Layout>
              <AnalyticsPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/sites" element={
          <ProtectedRoute>
            <Layout>
              <SitesPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/sites/:siteId" element={
          <ProtectedRoute>
            <Layout>
              <SiteDetailPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <FluentProvider theme={webLightTheme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </FluentProvider>
  );
};

export default App;
