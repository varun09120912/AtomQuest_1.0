import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './store/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import MyGoals from './pages/employee/MyGoals';
import Approvals from './pages/manager/Approvals';
import Analytics from './pages/admin/Analytics';
// Placeholders for other pages to prevent crash
const Placeholder = ({ title }) => <div className="p-8"><h1>{title}</h1><p>Under Construction</p></div>;

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
          <Route path="checkin" element={<ProtectedRoute><Placeholder title="Check-In" /></ProtectedRoute>} />
          
          {/* Manager Routes */}
          <Route path="team" element={<ProtectedRoute allowedRoles={['manager', 'admin']}><Placeholder title="Team Dashboard" /></ProtectedRoute>} />
          <Route path="approvals" element={<ProtectedRoute allowedRoles={['manager', 'admin']}><Approvals /></ProtectedRoute>} />
          <Route path="shared-goals" element={<ProtectedRoute allowedRoles={['manager', 'admin']}><Placeholder title="Shared Goals" /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="analytics" element={<ProtectedRoute allowedRoles={['admin']}><Analytics /></ProtectedRoute>} />
          <Route path="cycle-config" element={<ProtectedRoute allowedRoles={['admin']}><Placeholder title="Cycle Config" /></ProtectedRoute>} />
          <Route path="escalations" element={<ProtectedRoute allowedRoles={['admin']}><Placeholder title="Escalation Log" /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
