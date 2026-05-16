import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

// Essential demo users so the user can actually login to test
const initialUsers = [
  { id: 'emp1', name: 'Varun Employee', email: 'employee@atomberg.com', password: 'password123', role: 'employee', managerId: 'mgr1', dept: 'Engineering' },
  { id: 'mgr1', name: 'Atom Manager', email: 'manager@atomberg.com', password: 'password123', role: 'manager', dept: 'Engineering' },
  { id: 'adm1', name: 'Atom Admin', email: 'admin@atomberg.com', password: 'password123', role: 'admin', dept: 'HR' },
];

const initialCycles = [
  { id: 'c1', name: 'FY 2026-27 Annual Cycle', year: '2026', isActive: true, status: 'Goal Setting' }
];

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
    // 🚀 CLEAN SLATE MIGRATION (V5)
    // Ensures that old username-based data doesn't break the new email-based login.
    const currentVersion = 'atomquest_v5_stable';
    const installedVersion = localStorage.getItem('atomquest_version');

    if (installedVersion !== currentVersion) {
      // Clear old data to prevent crashes
      localStorage.removeItem('atomquest_users');
      localStorage.removeItem('atomquest_goals');
      localStorage.removeItem('atomquest_notifications');
      localStorage.removeItem('atomquest_checkIns');
      localStorage.removeItem('atomquest_cycles');
      localStorage.removeItem('atomquest_auditLog');
      localStorage.setItem('atomquest_version', currentVersion);
    }

    const storedUsers = localStorage.getItem('atomquest_users');
    const storedCycles = localStorage.getItem('atomquest_cycles');
    
    const finalUsers = storedUsers ? JSON.parse(storedUsers) : initialUsers;
    const finalCycles = storedCycles ? JSON.parse(storedCycles) : initialCycles;

    setUsers(finalUsers);
    setCycles(finalCycles);
    
    if (!storedUsers) localStorage.setItem('atomquest_users', JSON.stringify(initialUsers));
    if (!storedCycles) localStorage.setItem('atomquest_cycles', JSON.stringify(initialCycles));

    setGoals(JSON.parse(localStorage.getItem('atomquest_goals') || '[]'));
    setCheckIns(JSON.parse(localStorage.getItem('atomquest_checkIns') || '[]'));
    setEscalations(JSON.parse(localStorage.getItem('atomquest_escalations') || '[]'));
    setNotifications(JSON.parse(localStorage.getItem('atomquest_notifications') || '[]'));
    setAuditLog(JSON.parse(localStorage.getItem('atomquest_auditLog') || '[]'));

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  const persist = (key, value) => {
    setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('localStorage write failed:', e);
      }
    }, 0);
  };

  const saveGoals = (updated) => { setGoals(updated); persist('atomquest_goals', updated); };
  const saveCheckIns = (updated) => { setCheckIns(updated); persist('atomquest_checkIns', updated); };
  const saveEscalations = (updated) => { setEscalations(updated); persist('atomquest_escalations', updated); };
  const saveNotifications = (updated) => { setNotifications(updated); persist('atomquest_notifications', updated); };
  const saveAuditLog = (updated) => { setAuditLog(updated); persist('atomquest_auditLog', updated); };
  const saveUsers = (updated) => { setUsers(updated); persist('atomquest_users', updated); };
  const saveCycles = (updated) => { setCycles(updated); persist('atomquest_cycles', updated); };

  const login = (email, password) => {
    // Case-insensitive email check for demo convenience
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
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
      login, logout,
      saveGoals, saveCheckIns, saveEscalations, saveNotifications, saveAuditLog, saveUsers, saveCycles
    }}>
      {children}
    </AppContext.Provider>
  );
};
