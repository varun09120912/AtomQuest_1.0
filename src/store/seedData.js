export const seedUsers = [
  { id: 'u1', name: 'Kunal Pawar', email: 'kunal@atomquest.com', password: 'employee123', role: 'employee', dept: 'Sales', managerId: 'm1', grade: 'L2' },
  { id: 'u2', name: 'Pratik Karadkar', email: 'pratik@atomquest.com', password: 'employee123', role: 'employee', dept: 'Operations', managerId: 'm1', grade: 'L2' },
  { id: 'u3', name: 'Ayush Dhore', email: 'ayush@atomquest.com', password: 'employee123', role: 'employee', dept: 'Product & R&D', managerId: 'm2', grade: 'L3' },
  { id: 'u4', name: 'Soham Chandwadkar', email: 'soham@atomquest.com', password: 'employee123', role: 'employee', dept: 'Marketing', managerId: 'm2', grade: 'L1' },
  { id: 'u5', name: 'Simon Joshi', email: 'simon@atomquest.com', password: 'employee123', role: 'employee', dept: 'Customer Service', managerId: 'm1', grade: 'L2' },
  { id: 'm1', name: 'Rahul Desai', email: 'manager@atomquest.com', password: 'manager123', role: 'manager', dept: 'Sales & Ops', managerId: 'a1', grade: 'L4' },
  { id: 'm2', name: 'Priya Nair', email: 'salesmgr@atomquest.com', password: 'manager123', role: 'manager', dept: 'Product & Marketing', managerId: 'a1', grade: 'L4' },
  { id: 'a1', name: 'Varun Kadadi', email: 'admin@atomquest.com', password: 'admin123', role: 'admin', dept: 'HR & Strategy', managerId: null, grade: 'L5' }
];

export const seedCycles = [
  { id: 'c1', name: 'FY2026 — Q1 Pulse', phase: 'Q1', opensAt: '2026-04-01', closesAt: '2026-06-30', isActive: true, year: 2026 }
];

const NOW = Date.now();
const DAY = 86400000;

export const seedGoals = [
  // ── Kunal Pawar (Sales) — APPROVED, Q1 check-in submitted
  { id: 'g1', employeeId: 'u1', cycleYear: 2026, title: 'Achieve Dealer Revenue Target — West Zone', description: 'Drive ₹2.5 Cr revenue through channel partners across West Zone dealers.', thrustArea: 'Channel & Distribution Growth', uom: 'numeric_max', target: 250, weightage: 35, status: 'approved', sharedFrom: null, sharedOwner: false, createdAt: NOW - 20*DAY, updatedAt: NOW - 15*DAY },
  { id: 'g2', employeeId: 'u1', cycleYear: 2026, title: 'Onboard 40 New Dealer Partners', description: 'Expand Atomberg distribution network by adding new authorised dealers.', thrustArea: 'Channel & Distribution Growth', uom: 'numeric_max', target: 40, weightage: 25, status: 'approved', sharedFrom: null, sharedOwner: false, createdAt: NOW - 20*DAY, updatedAt: NOW - 15*DAY },
  { id: 'g3', employeeId: 'u1', cycleYear: 2026, title: 'Maintain NPS ≥ 75 for Channel Partners', description: 'Collect quarterly NPS from dealer network and maintain score above 75.', thrustArea: 'Customer Delight & NPS', uom: 'numeric_max', target: 75, weightage: 20, status: 'approved', sharedFrom: null, sharedOwner: false, createdAt: NOW - 20*DAY, updatedAt: NOW - 15*DAY },
  { id: 'g4', employeeId: 'u1', cycleYear: 2026, title: 'Complete Atomberg Sales Certification', description: 'Complete all 3 internal sales enablement modules on product knowledge.', thrustArea: 'People & Culture', uom: 'timeline', target: '2026-05-31', weightage: 20, status: 'approved', sharedFrom: 'm1', sharedOwner: false, createdAt: NOW - 20*DAY, updatedAt: NOW - 15*DAY },

  // ── Pratik Karadkar (Operations) — APPROVED, check-in pending (escalation)
  { id: 'g5', employeeId: 'u2', cycleYear: 2026, title: 'Reduce BLDC Fan Defect Rate Below 1.2%', description: 'Improve QC processes on the production line to lower defect/rejection rate.', thrustArea: 'Manufacturing Excellence', uom: 'numeric_min', target: 1.2, weightage: 40, status: 'approved', sharedFrom: null, sharedOwner: false, createdAt: NOW - 20*DAY, updatedAt: NOW - 15*DAY },
  { id: 'g6', employeeId: 'u2', cycleYear: 2026, title: 'Achieve 98% On-Time Dispatch Rate', description: 'Ensure 98% of orders are dispatched within committed SLA.', thrustArea: 'Manufacturing Excellence', uom: 'percent_max', target: 98, weightage: 35, status: 'approved', sharedFrom: null, sharedOwner: false, createdAt: NOW - 20*DAY, updatedAt: NOW - 15*DAY },
  { id: 'g7', employeeId: 'u2', cycleYear: 2026, title: 'Reduce Warehouse Holding Cost by 15%', description: 'Optimise inventory management and reduce carrying cost through lean practices.', thrustArea: 'Manufacturing Excellence', uom: 'percent_max', target: 15, weightage: 25, status: 'approved', sharedFrom: null, sharedOwner: false, createdAt: NOW - 20*DAY, updatedAt: NOW - 15*DAY },

  // ── Ayush Dhore (Product & R&D) — APPROVED, check-in done, high scorer
  { id: 'g8', employeeId: 'u3', cycleYear: 2026, title: 'Launch Atomberg Smart Fan App v2.0', description: 'Ship the redesigned Atomberg IoT app with energy dashboard and scheduling.', thrustArea: 'Product Innovation', uom: 'timeline', target: '2026-06-15', weightage: 40, status: 'approved', sharedFrom: null, sharedOwner: false, createdAt: NOW - 25*DAY, updatedAt: NOW - 18*DAY },
  { id: 'g9', employeeId: 'u3', cycleYear: 2026, title: 'Achieve BLDC Motor Efficiency ≥ 88%', description: 'Improve motor design to push energy efficiency rating above 88%.', thrustArea: 'Energy Efficiency & Sustainability', uom: 'percent_max', target: 88, weightage: 35, status: 'approved', sharedFrom: null, sharedOwner: false, createdAt: NOW - 25*DAY, updatedAt: NOW - 18*DAY },
  { id: 'g10', employeeId: 'u3', cycleYear: 2026, title: 'File 2 New Product Patents', description: 'Submit patent applications for new motor control innovations.', thrustArea: 'Product Innovation', uom: 'numeric_max', target: 2, weightage: 25, status: 'approved', sharedFrom: null, sharedOwner: false, createdAt: NOW - 25*DAY, updatedAt: NOW - 18*DAY },

  // ── Soham Chandwadkar (Marketing) — APPROVED, check-in submitted
  { id: 'g11', employeeId: 'u4', cycleYear: 2026, title: 'Increase Flipkart Category Share to 18%', description: 'Grow Atomberg market share in the premium fan category on Flipkart.', thrustArea: 'Channel & Distribution Growth', uom: 'percent_max', target: 18, weightage: 30, status: 'approved', sharedFrom: null, sharedOwner: false, createdAt: NOW - 18*DAY, updatedAt: NOW - 12*DAY },
  { id: 'g12', employeeId: 'u4', cycleYear: 2026, title: 'Generate 5000 Qualified Marketing Leads', description: 'Run performance campaigns across digital channels for lead gen.', thrustArea: 'Channel & Distribution Growth', uom: 'numeric_max', target: 5000, weightage: 30, status: 'approved', sharedFrom: null, sharedOwner: false, createdAt: NOW - 18*DAY, updatedAt: NOW - 12*DAY },
  { id: 'g13', employeeId: 'u4', cycleYear: 2026, title: 'Launch "Save Energy, Save Money" Campaign', description: 'Run Atomberg sustainability campaign across YouTube, Instagram, and OTT.', thrustArea: 'Energy Efficiency & Sustainability', uom: 'timeline', target: '2026-05-01', weightage: 20, status: 'approved', sharedFrom: null, sharedOwner: false, createdAt: NOW - 18*DAY, updatedAt: NOW - 12*DAY },
  { id: 'g14', employeeId: 'u4', cycleYear: 2026, title: 'Reduce Customer Acquisition Cost by 20%', description: 'Improve funnel efficiency and reduce blended CAC across channels.', thrustArea: 'Customer Delight & NPS', uom: 'percent_max', target: 20, weightage: 20, status: 'approved', sharedFrom: null, sharedOwner: false, createdAt: NOW - 18*DAY, updatedAt: NOW - 12*DAY },

  // ── Simon Joshi (Customer Service) — NO GOALS SUBMITTED (HR-level escalation)
  // Simon has no goals — escalation active
];

export const seedCheckIns = [
  // Kunal — check-in submitted
  { id: 'chk1', goalId: 'g1', employeeId: 'u1', quarter: 'Q1', year: 2026, actual: 198, status: 'on_track', managerComment: 'Good progress. Push for closure this month.', managerCommentAt: NOW - 2*DAY, submittedAt: NOW - 5*DAY, score: 79 },
  { id: 'chk2', goalId: 'g2', employeeId: 'u1', quarter: 'Q1', year: 2026, actual: 31, status: 'on_track', managerComment: '', managerCommentAt: null, submittedAt: NOW - 5*DAY, score: 78 },
  { id: 'chk3', goalId: 'g3', employeeId: 'u1', quarter: 'Q1', year: 2026, actual: 72, status: 'on_track', managerComment: '', managerCommentAt: null, submittedAt: NOW - 5*DAY, score: 96 },

  // Ayush — top performer
  { id: 'chk4', goalId: 'g8', employeeId: 'u3', quarter: 'Q1', year: 2026, actual: '2026-06-10', status: 'completed', managerComment: 'Excellent! Delivered ahead of schedule.', managerCommentAt: NOW - 1*DAY, submittedAt: NOW - 3*DAY, score: 100 },
  { id: 'chk5', goalId: 'g9', employeeId: 'u3', quarter: 'Q1', year: 2026, actual: 90, status: 'completed', managerComment: 'Outstanding engineering work.', managerCommentAt: NOW - 1*DAY, submittedAt: NOW - 3*DAY, score: 100 },
  { id: 'chk6', goalId: 'g10', employeeId: 'u3', quarter: 'Q1', year: 2026, actual: 2, status: 'completed', managerComment: '', managerCommentAt: null, submittedAt: NOW - 3*DAY, score: 100 },

  // Soham — submitted
  { id: 'chk7', goalId: 'g11', employeeId: 'u4', quarter: 'Q1', year: 2026, actual: 15, status: 'on_track', managerComment: '', managerCommentAt: null, submittedAt: NOW - 4*DAY, score: 83 },
  { id: 'chk8', goalId: 'g12', employeeId: 'u4', quarter: 'Q1', year: 2026, actual: 3800, status: 'on_track', managerComment: '', managerCommentAt: null, submittedAt: NOW - 4*DAY, score: 76 },
];

export const seedEscalations = [
  { id: 'esc1', employeeId: 'u2', type: 'checkin_overdue', triggeredAt: NOW - 12*DAY, level: 'manager', resolved: false, resolvedAt: null, resolvedBy: null },
  { id: 'esc2', employeeId: 'u5', type: 'goal_not_submitted', triggeredAt: NOW - 18*DAY, level: 'hr', resolved: false, resolvedAt: null, resolvedBy: null }
];

export const seedNotifications = [];

export const seedAuditLog = [
  { id: 'al1', timestamp: NOW - 20*DAY, actor: 'Rahul Desai', role: 'manager', action: 'GOALS_APPROVED', affectedPerson: 'Kunal Pawar', details: 'Approved 4 goals for FY2026 Q1. Total weightage: 100%.' },
  { id: 'al2', timestamp: NOW - 19*DAY, actor: 'Rahul Desai', role: 'manager', action: 'GOALS_APPROVED', affectedPerson: 'Pratik Karadkar', details: 'Approved 3 goals for FY2026 Q1.' },
  { id: 'al3', timestamp: NOW - 18*DAY, actor: 'Priya Nair', role: 'manager', action: 'GOALS_APPROVED', affectedPerson: 'Ayush Dhore', details: 'Approved 3 goals for FY2026 Q1.' },
  { id: 'al4', timestamp: NOW - 12*DAY, actor: 'Priya Nair', role: 'manager', action: 'GOALS_APPROVED', affectedPerson: 'Soham Chandwadkar', details: 'Approved 4 goals for FY2026 Q1.' },
  { id: 'al5', timestamp: NOW - 5*DAY, actor: 'Kunal Pawar', role: 'employee', action: 'CHECKIN_SUBMITTED', affectedPerson: 'Kunal Pawar', details: 'Q1 check-in submitted. Avg score: 84%.' },
  { id: 'al6', timestamp: NOW - 3*DAY, actor: 'Ayush Dhore', role: 'employee', action: 'CHECKIN_SUBMITTED', affectedPerson: 'Ayush Dhore', details: 'Q1 check-in submitted. Avg score: 100%. Top performer this quarter.' },
  { id: 'al7', timestamp: NOW - 4*DAY, actor: 'Soham Chandwadkar', role: 'employee', action: 'CHECKIN_SUBMITTED', affectedPerson: 'Soham Chandwadkar', details: 'Q1 check-in submitted. Avg score: 80%.' },
  { id: 'al8', timestamp: NOW - 12*DAY, actor: 'SYSTEM', role: 'system', action: 'ESCALATION_TRIGGERED', affectedPerson: 'Pratik Karadkar', details: 'Q1 check-in overdue by 12 days. Escalated to manager level.' },
  { id: 'al9', timestamp: NOW - 18*DAY, actor: 'SYSTEM', role: 'system', action: 'ESCALATION_TRIGGERED', affectedPerson: 'Simon Joshi', details: 'Goals not submitted after 18 days of cycle opening. Escalated to HR level.' },
  { id: 'al10', timestamp: NOW - 2*DAY, actor: 'Rahul Desai', role: 'manager', action: 'MANAGER_COMMENT', affectedPerson: 'Kunal Pawar', details: 'Manager reviewed Q1 check-in and added performance comment.' },
  { id: 'al11', timestamp: NOW - 1*DAY, actor: 'Priya Nair', role: 'manager', action: 'MANAGER_COMMENT', affectedPerson: 'Ayush Dhore', details: 'Manager acknowledged exceptional performance. Recommended for star performer award.' },
  { id: 'al12', timestamp: NOW - 25*DAY, actor: 'Varun Kadadi', role: 'admin', action: 'CYCLE_ACTIVATED', affectedPerson: 'All Employees', details: 'FY2026 Q1 Pulse cycle activated. Goal setting window opened for all employees.' },
];
