import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import CompanySignUp from './pages/CompanySignUp';
import SignIn from './pages/SignIn';
import AdminEmployees from './pages/AdminEmployees';
import ProfileView from './pages/ProfileView';
import AttendancePage from './pages/AttendancePage';
import TimeOffPage from './pages/TimeOffPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ResetPassword from './pages/ResetPassword';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signup" element={<CompanySignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/reset-password" element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          } />
          <Route path="/admin/employees" element={
            <ProtectedRoute role="Admin">
              <AdminEmployees />
            </ProtectedRoute>
          } />
          <Route path="/profile/:userId" element={
            <ProtectedRoute>
              <ProfileView />
            </ProtectedRoute>
          } />
          <Route path="/attendance" element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          } />
          <Route path="/leave" element={
            <ProtectedRoute>
              <TimeOffPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
