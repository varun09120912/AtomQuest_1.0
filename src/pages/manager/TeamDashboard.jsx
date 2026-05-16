import React, { useContext } from 'react';
import { AppContext } from '../../store/AppContext';
import { Users } from 'lucide-react';

export default function TeamDashboard() {
  const { currentUser, users, goals } = useContext(AppContext);
  const myTeam = users.filter(u => u.managerId === currentUser.id);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex items-center gap-3">
        <Users size={32} className="text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Team Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your direct reports.</p>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-sm">
              <th className="p-4">Name</th>
              <th className="p-4">Dept</th>
              <th className="p-4">Total Goals</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {myTeam.map(emp => {
              const empGoals = goals.filter(g => g.employeeId === emp.id);
              const isApproved = empGoals.length > 0 && empGoals.every(g => g.status === 'approved');
              const isPending = empGoals.some(g => g.status === 'pending');
              const isDraft = empGoals.every(g => g.status === 'draft') || empGoals.length === 0;

              return (
                <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-semibold text-slate-800">{emp.name}</td>
                  <td className="p-4 text-slate-600">{emp.dept}</td>
                  <td className="p-4 font-bold text-slate-700">{empGoals.length}</td>
                  <td className="p-4">
                    {isApproved ? <span className="badge badge-success">Approved</span> :
                     isPending ? <span className="badge badge-warning">Needs Approval</span> :
                     <span className="badge badge-draft">Drafting</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
