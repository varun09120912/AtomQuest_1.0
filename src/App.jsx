import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('atomquest_user');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('atomquest_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('atomquest_user');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!currentUser ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        
        {currentUser ? (
          <Route element={<Layout currentUser={currentUser} onLogout={handleLogout} />}>
            <Route path="/" element={
              currentUser.role === 'employee' ? <EmployeeDashboard currentUser={currentUser} /> :
              currentUser.role === 'manager' ? <ManagerDashboard currentUser={currentUser} /> :
              <AdminDashboard currentUser={currentUser} />
            } />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
