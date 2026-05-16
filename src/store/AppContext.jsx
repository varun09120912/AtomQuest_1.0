import React, { createContext, useState, useEffect } from 'react';
import { seedUsers, seedCycles, seedGoals, seedCheckIns, seedEscalations, seedNotifications, seedAuditLog } from './seedData';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [goals, setGoals] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const isSeeded = localStorage.getItem('atomquest_seeded');
    if (!isSeeded) {
      localStorage.setItem('atomquest_users', JSON.stringify(seedUsers));
      localStorage.setItem('atomquest_cycles', JSON.stringify(seedCycles));
      localStorage.setItem('atomquest_goals', JSON.stringify(seedGoals));
      localStorage.setItem('atomquest_checkIns', JSON.stringify(seedCheckIns));
      localStorage.setItem('atomquest_escalations', JSON.stringify(seedEscalations));
      localStorage.setItem('atomquest_notifications', JSON.stringify(seedNotifications));
      localStorage.setItem('atomquest_auditLog', JSON.stringify(seedAuditLog));
      localStorage.setItem('atomquest_seeded', 'true');
    }

    setUsers(JSON.parse(localStorage.getItem('atomquest_users') || '[]'));
    setCycles(JSON.parse(localStorage.getItem('atomquest_cycles') || '[]'));
    setGoals(JSON.parse(localStorage.getItem('atomquest_goals') || '[]'));
    setCheckIns(JSON.parse(localStorage.getItem('atomquest_checkIns') || '[]'));
    setEscalations(JSON.parse(localStorage.getItem('atomquest_escalations') || '[]'));
    setNotifications(JSON.parse(localStorage.getItem('atomquest_notifications') || '[]'));
    setAuditLog(JSON.parse(localStorage.getItem('atomquest_auditLog') || '[]'));

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AppContext.Provider value={{
      users, cycles, goals, checkIns, escalations, notifications, auditLog, currentUser,
      login, logout, setGoals, setCheckIns, setEscalations, setNotifications, setAuditLog
    }}>
      {children}
    </AppContext.Provider>
  );
};
