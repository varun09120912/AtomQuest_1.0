import React, { useContext } from 'react';
import { AppContext } from '../../store/AppContext';
import { LayoutDashboard } from 'lucide-react';

export default function CompletionDashboard() {
  const { users, goals, checkIns } = useContext(AppContext);
  const employees = users.filter(u => u.role === 'employee');
  const totalEmployees = employees.length;
  
  const employeesWithGoals = new Set(goals.filter(g => g.status === 'approved').map(g => g.employeeId)).size;
  const employeesWithCheckIns = new Set(checkIns.map(c => c.employeeId)).size;
  
  const approvalRate = totalEmployees ? Math.round((employeesWithGoals / totalEmployees) * 100) : 0;
  const q1CompletionRate = totalEmployees ? Math.round((employeesWithCheckIns / totalEmployees) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex items-center gap-3">
        <LayoutDashboard size={32} className="text-primary-600" />
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Completion Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">Organization-wide compliance tracking.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="glass-panel p-6">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Submission Rate</h3>
          <p className="text-4xl font-extrabold text-slate-800">100%</p>
        </div>
        <div className="glass-panel p-6">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Approval Rate</h3>
          <p className="text-4xl font-extrabold text-primary-600">{approvalRate}%</p>
        </div>
        <div className="glass-panel p-6">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Q1 Completion</h3>
          <p className="text-4xl font-extrabold text-emerald-500">{q1CompletionRate}%</p>
        </div>
        <div className="glass-panel p-6 border-b-4 border-b-rose-500">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Active Escalations</h3>
          <p className="text-4xl font-extrabold text-rose-600">3</p>
        </div>
      </div>

      <div className="glass-panel mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Department Heatmap</h2>
        <div className="flex items-center justify-center h-48 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
           <p className="text-slate-400 font-medium">Heatmap grid data populates after Q2 ends.</p>
        </div>
      </div>
    </div>
  );
}
