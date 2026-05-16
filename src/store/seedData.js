// ─── USERS ONLY — all other data starts empty ───────────────────────
// Goals, check-ins, escalations, audit logs are all generated live
// by the users themselves through the app.

export const seedUsers = [
  { id: 'u1', name: 'Kunal Pawar',       email: 'kunal@atomquest.com',   password: 'employee123', role: 'employee', dept: 'Sales',          managerId: 'm1', grade: 'L2', phone: '+91 98765 00001' },
  { id: 'u2', name: 'Pratik Karadkar',   email: 'pratik@atomquest.com',  password: 'employee123', role: 'employee', dept: 'Operations',      managerId: 'm1', grade: 'L2', phone: '+91 98765 00002' },
  { id: 'u3', name: 'Ayush Dhore',       email: 'ayush@atomquest.com',   password: 'employee123', role: 'employee', dept: 'Product & R&D',   managerId: 'm2', grade: 'L3', phone: '+91 98765 00003' },
  { id: 'u4', name: 'Soham Chandwadkar', email: 'soham@atomquest.com',   password: 'employee123', role: 'employee', dept: 'Marketing',       managerId: 'm2', grade: 'L1', phone: '+91 98765 00004' },
  { id: 'u5', name: 'Simon Joshi',       email: 'simon@atomquest.com',   password: 'employee123', role: 'employee', dept: 'Customer Service', managerId: 'm1', grade: 'L2', phone: '+91 98765 00005' },
  { id: 'm1', name: 'Rahul Desai',       email: 'manager@atomquest.com', password: 'manager123',  role: 'manager',  dept: 'Sales & Ops',    managerId: 'a1', grade: 'L4', phone: '+91 98765 00006' },
  { id: 'm2', name: 'Priya Nair',        email: 'salesmgr@atomquest.com',password: 'manager123',  role: 'manager',  dept: 'Product & Mktg', managerId: 'a1', grade: 'L4', phone: '+91 98765 00007' },
  { id: 'a1', name: 'Varun Kadadi',      email: 'admin@atomquest.com',   password: 'admin123',    role: 'admin',    dept: 'HR & Strategy',  managerId: null, grade: 'L5', phone: '+91 98765 00008' },
];

export const seedCycles = [
  {
    id: 'c1',
    name: 'FY2026 — Q1 Pulse',
    phase: 'Q1',
    opensAt: '2026-04-01',
    closesAt: '2026-06-30',
    isActive: true,
    year: 2026
  }
];

// All empty — data is created live by users
export const seedGoals         = [];
export const seedCheckIns      = [];
export const seedEscalations   = [];
export const seedNotifications = [];
export const seedAuditLog      = [
  {
    id: 'al_init',
    timestamp: Date.now(),
    actor: 'Varun Kadadi',
    role: 'admin',
    action: 'SYSTEM_INITIALIZED',
    affectedPerson: 'All Users',
    details: 'AtomQuest portal initialized. FY2026 Q1 Pulse cycle is now active.'
  }
];
