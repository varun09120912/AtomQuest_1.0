import React, { useContext, useState } from 'react';
import { AppContext } from '../../store/AppContext';
import { CheckSquare, AlertCircle } from 'lucide-react';

export default function Approvals() {
  const { currentUser, goals, saveGoals, users } = useContext(AppContext);
  const myTeam = users.filter(u => u.managerId === currentUser.id);
  const teamIds = myTeam.map(u => u.id);
  
  const pendingGoals = goals.filter(g => teamIds.includes(g.employeeId) && g.status === 'pending');
  const employeesWithPending = myTeam.filter(u => pendingGoals.some(g => g.employeeId === u.id));

  const handleApproveAll = (employeeId) => {
    const updated = goals.map(g => 
      (g.employeeId === employeeId && g.status === 'pending') ? { ...g, status: 'approved', updatedAt: Date.now() } : g
    );
    saveGoals(updated);
  };

  const handleReturnAll = (employeeId) => {
    const updated = goals.map(g => 
      (g.employeeId === employeeId && g.status === 'pending') ? { ...g, status: 'returned', updatedAt: Date.now() } : g
    );
    saveGoals(updated);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Pending Approvals</h1>
        <p className="text-slate-500 mt-1">Review and approve goal sheets submitted by your direct reports.</p>
      </div>

      {employeesWithPending.length === 0 ? (
        <div className="glass-panel text-center py-16">
          <CheckSquare size={48} className="mx-auto mb-4 text-green-400" />
          <h2 className="text-xl font-bold text-slate-700">All Caught Up!</h2>
          <p className="text-slate-500 mt-2">There are no pending goals requiring your approval right now.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {employeesWithPending.map(emp => {
            const empGoals = pendingGoals.filter(g => g.employeeId === emp.id);
            const totalWeight = empGoals.reduce((s, g) => s + Number(g.weightage), 0);
            
            return (
              <div key={emp.id} className="glass-panel p-0 overflow-hidden border-2 border-blue-100">
                <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{emp.name}</h2>
                    <p className="text-sm text-slate-500">{emp.dept} • {empGoals.length} Goals Submitted</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-semibold ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
                      Total Weight: {totalWeight}%
                    </span>
                    <button onClick={() => handleReturnAll(emp.id)} className="btn-secondary">Return to Employee</button>
                    <button onClick={() => handleApproveAll(emp.id)} className="btn-primary" disabled={totalWeight !== 100}>Approve All</button>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  {empGoals.map(g => (
                    <div key={g.id} className="border border-slate-200 rounded-lg p-4 bg-white flex justify-between items-center hover:border-primary transition-colors">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">{g.title}</h4>
                        <p className="text-sm text-slate-500">{g.description}</p>
                      </div>
                      <div className="flex gap-6 items-center">
                        <div className="text-right">
                          <span className="block text-xs text-slate-500">Target</span>
                          <span className="font-semibold">{g.target} {g.uom}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-xs text-slate-500">Weightage</span>
                          <span className="font-semibold">{g.weightage}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
