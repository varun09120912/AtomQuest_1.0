export const seedUsers = [
  { id: 'u1', name: 'Priya Sharma', email: 'employee@atomquest.com', password: 'employee123', role: 'employee', dept: 'Engineering', managerId: 'm1', grade: 'L2' },
  { id: 'u2', name: 'Amit Kulkarni', email: 'amit@atomquest.com', password: 'employee123', role: 'employee', dept: 'Engineering', managerId: 'm1', grade: 'L2' },
  { id: 'u3', name: 'Sara Thomas', email: 'sara@atomquest.com', password: 'employee123', role: 'employee', dept: 'Sales', managerId: 'm2', grade: 'L3' },
  { id: 'u4', name: 'Dev Patel', email: 'dev@atomquest.com', password: 'employee123', role: 'employee', dept: 'Engineering', managerId: 'm1', grade: 'L1' },
  { id: 'u5', name: 'Neha Roy', email: 'neha@atomquest.com', password: 'employee123', role: 'employee', dept: 'Marketing', managerId: 'm2', grade: 'L2' },
  { id: 'm1', name: 'Charlie Manager', email: 'manager@atomquest.com', password: 'manager123', role: 'manager', dept: 'Engineering', managerId: 'a1', grade: 'L4' },
  { id: 'm2', name: 'Sales Manager', email: 'salesmgr@atomquest.com', password: 'manager123', role: 'manager', dept: 'Sales', managerId: 'a1', grade: 'L4' },
  { id: 'a1', name: 'Diana Admin', email: 'admin@atomquest.com', password: 'admin123', role: 'admin', dept: 'HR', managerId: null, grade: 'L5' }
];

export const seedCycles = [
  { id: 'c1', name: 'FY2026', phase: 'Q1', opensAt: '2026-07-01', closesAt: '2026-07-31', isActive: true, year: 2026 }
];

export const seedGoals = [
  { id: 'g1', employeeId: 'u1', cycleYear: 2026, title: 'Release v1.0', description: 'Launch portal', thrustArea: 'Internal Process', uom: 'numeric_max', target: 100, weightage: 30, status: 'approved', sharedFrom: null, sharedOwner: false, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'g2', employeeId: 'u1', cycleYear: 2026, title: 'Zero Bugs', description: '0 P1 bugs', thrustArea: 'Customer', uom: 'zero', target: 0, weightage: 20, status: 'approved', sharedFrom: null, sharedOwner: false, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'g3', employeeId: 'u1', cycleYear: 2026, title: 'Learn AWS', description: 'Certification', thrustArea: 'Learning & Growth', uom: 'timeline', target: 1, weightage: 10, status: 'approved', sharedFrom: null, sharedOwner: false, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'g4', employeeId: 'u1', cycleYear: 2026, title: 'Team Mentorship', description: 'Mentor juniors', thrustArea: 'Learning & Growth', uom: 'timeline', target: 1, weightage: 20, status: 'approved', sharedFrom: 'm1', sharedOwner: false, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'g5', employeeId: 'u1', cycleYear: 2026, title: 'Reduce Latency', description: '<200ms', thrustArea: 'Internal Process', uom: 'percent_min', target: 100, weightage: 20, status: 'approved', sharedFrom: null, sharedOwner: false, createdAt: Date.now(), updatedAt: Date.now() },
  // Amit
  { id: 'g6', employeeId: 'u2', cycleYear: 2026, title: 'API Gateway', description: 'Build gateway', thrustArea: 'Internal Process', uom: 'numeric_max', target: 100, weightage: 100, status: 'pending', sharedFrom: null, sharedOwner: false, createdAt: Date.now() - 6 * 86400000, updatedAt: Date.now() }
];

export const seedCheckIns = [
  { id: 'chk1', goalId: 'g1', employeeId: 'u1', quarter: 'Q1', year: 2026, actual: 80, status: 'on_track', managerComment: '', managerCommentAt: null, submittedAt: Date.now(), score: 80 }
];

export const seedEscalations = [
  { id: 'esc1', employeeId: 'u2', type: 'approval_pending', triggeredAt: Date.now() - 86400000, level: 'manager', resolved: false, resolvedAt: null, resolvedBy: null },
  { id: 'esc2', employeeId: 'u5', type: 'goal_not_submitted', triggeredAt: Date.now(), level: 'hr', resolved: false, resolvedAt: null, resolvedBy: null }
];

export const seedNotifications = [];
export const seedAuditLog = [];
