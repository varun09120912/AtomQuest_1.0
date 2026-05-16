import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './store/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import MyGoals from './pages/employee/MyGoals';
import CheckIn from './pages/employee/CheckIn';
import TeamDashboard from './pages/manager/TeamDashboard';
import Approvals from './pages/manager/Approvals';
import SharedGoals from './pages/manager/SharedGoals';
import Analytics from './pages/admin/Analytics';
import CycleConfig from './pages/admin/CycleConfig';
import EscalationLog from './pages/admin/EscalationLog';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useContext(AppContext);
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) return <Navigate to="/dashboard/my-goals" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard/my-goals" replace />} />
          
          {/* Employee Routes */}
          <Route path="my-goals" element={<ProtectedRoute><MyGoals /></ProtectedRoute>} />
          <Route path="checkin" element={<ProtectedRoute><CheckIn /></ProtectedRoute>} />
          
          {/* Manager Routes */}
          <Route path="team" element={<ProtectedRoute allowedRoles={['manager', 'admin']}><TeamDashboard /></ProtectedRoute>} />
          <Route path="approvals" element={<ProtectedRoute allowedRoles={['manager', 'admin']}><Approvals /></ProtectedRoute>} />
          <Route path="shared-goals" element={<ProtectedRoute allowedRoles={['manager', 'admin']}><SharedGoals /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="analytics" element={<ProtectedRoute allowedRoles={['admin']}><Analytics /></ProtectedRoute>} />
          <Route path="cycle-config" element={<ProtectedRoute allowedRoles={['admin']}><CycleConfig /></ProtectedRoute>} />
          <Route path="escalations" element={<ProtectedRoute allowedRoles={['admin']}><EscalationLog /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
