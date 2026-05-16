import React, { useContext } from 'react';
import { AppContext } from '../../store/AppContext';

export default function MyGoals() {
  const { currentUser, goals, cycles } = useContext(AppContext);
  const myGoals = goals.filter(g => g.employeeId === currentUser.id);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Goals</h1>
        <p className="text-slate-500 mt-2">Manage your objectives and key results.</p>
      </div>
      <div className="glass-panel">
        <p>Goal count: {myGoals.length}</p>
        {/* Under construction but working */}
        <p className="text-muted mt-4">Full implementation of complex logic coming in next iteration based on your spec.</p>
      </div>
    </div>
  );
}
