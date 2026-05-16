export const mockUsers = [
  { id: 'emp1', name: 'Alice Smith', role: 'employee', managerId: 'mgr1', department: 'Engineering' },
  { id: 'emp2', name: 'Bob Jones', role: 'employee', managerId: 'mgr1', department: 'Engineering' },
  { id: 'mgr1', name: 'Charlie Manager', role: 'manager', department: 'Engineering' },
  { id: 'adm1', name: 'Diana Admin', role: 'admin', department: 'HR' },
];

export const getInitialGoals = () => {
  const existing = localStorage.getItem('atomquest_goals');
  if (existing) return JSON.parse(existing);
  
  const initial = [
    {
      id: 'g1',
      employeeId: 'emp1',
      title: 'Complete React Portal',
      description: 'Develop the goal tracking portal front-end.',
      thrustArea: 'Internal Process',
      uom: '%',
      target: 100,
      weightage: 50,
      status: 'Not Started',
      isSubmitted: true,
      isApproved: false,
      isShared: false,
      progressActuals: { Q1: null, Q2: null, Q3: null, Q4: null },
      managerComments: {}
    },
    {
      id: 'g2',
      employeeId: 'emp1',
      title: 'Zero Safety Incidents',
      description: 'Maintain 0 safety issues.',
      thrustArea: 'Learning & Growth',
      uom: 'Zero',
      target: 0,
      weightage: 50,
      status: 'On Track',
      isSubmitted: true,
      isApproved: true,
      isShared: true,
      progressActuals: { Q1: 0, Q2: null, Q3: null, Q4: null },
      managerComments: {}
    }
  ];
  localStorage.setItem('atomquest_goals', JSON.stringify(initial));
  return initial;
};

export const saveGoals = (goals) => {
  localStorage.setItem('atomquest_goals', JSON.stringify(goals));
};

export const getActiveCycle = () => {
  const existing = localStorage.getItem('atomquest_cycle');
  if (existing) return JSON.parse(existing);
  const initial = { phase: 'Phase 1 - Goal Setting', year: '2026-2027' };
  localStorage.setItem('atomquest_cycle', JSON.stringify(initial));
  return initial;
};

export const saveActiveCycle = (cycle) => {
  localStorage.setItem('atomquest_cycle', JSON.stringify(cycle));
};
