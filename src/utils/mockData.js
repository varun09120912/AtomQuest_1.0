export const mockUsers = [
  { id: 'emp1', name: 'Varun Employee', role: 'employee', managerId: 'mgr1', dept: 'Engineering', password: 'password123' },
  { id: 'mgr1', name: 'Atom Manager', role: 'manager', dept: 'Engineering', password: 'password123' },
  { id: 'adm1', name: 'Atom Admin', role: 'admin', dept: 'HR', password: 'password123' },
];

export const getInitialGoals = () => {
  const existing = localStorage.getItem('atomquest_goals');
  if (existing) return JSON.parse(existing);
  return [];
};

export const getInitialCheckIns = () => {
  const existing = localStorage.getItem('atomquest_checkIns');
  if (existing) return JSON.parse(existing);
  return [];
};

export const getInitialNotifications = () => {
  const existing = localStorage.getItem('atomquest_notifications');
  if (existing) return JSON.parse(existing);
  return [];
};

export const getInitialEscalations = () => {
  const existing = localStorage.getItem('atomquest_escalations');
  if (existing) return JSON.parse(existing);
  return [];
};

export const getInitialAuditLog = () => {
  const existing = localStorage.getItem('atomquest_auditLog');
  if (existing) return JSON.parse(existing);
  return [];
};

export const getInitialCycles = () => {
  const existing = localStorage.getItem('atomquest_cycles');
  if (existing) return JSON.parse(existing);
  return [
    { id: 'c1', name: 'FY 2026-27 Annual Cycle', year: '2026', isActive: true, status: 'Goal Setting' }
  ];
};
