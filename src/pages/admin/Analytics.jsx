import React, { useContext } from 'react';
import { AppContext } from '../../store/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function Analytics() {
  const { goals, users, escalations, checkIns } = useContext(AppContext);
  const approvedGoals = goals.filter(g => g.status === 'approved');

  const thrustAreaCounts = approvedGoals.reduce((acc, g) => {
    acc[g.thrustArea] = (acc[g.thrustArea] || 0) + 1;
    return acc;
  }, {});
  
  const pieData = Object.keys(thrustAreaCounts).map(key => ({ name: key, value: thrustAreaCounts[key] }));
  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#6366f1', '#ef4444', '#ec4899'];
  const activeEscalations = escalations.filter(e => !e.resolved).length;
  const avgScore = checkIns.length > 0
    ? Math.round(checkIns.reduce((s, c) => s + (c.score || 0), 0) / checkIns.length)
    : 0;

  const employeeCount = users.filter(u => u.role === 'employee').length;
  const employeesWithGoals = new Set(goals.map(g => g.employeeId)).size;
  const submissionRate = Math.round((employeesWithGoals / employeeCount) * 100) || 0;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Organization Analytics</h1>
        <p className="text-slate-500 mt-1">Real-time completion and distribution metrics.</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="glass-panel">
          <h3 className="text-slate-500 text-sm font-semibold mb-2">Goal Submission Rate</h3>
          <p className="text-4xl font-bold text-primary">{submissionRate}%</p>
        </div>
        <div className="glass-panel">
          <h3 className="text-slate-500 text-sm font-semibold mb-2">Total Active Goals</h3>
          <p className="text-4xl font-bold text-slate-800">{approvedGoals.length}</p>
        </div>
        <div className="glass-panel">
          <h3 className="text-slate-500 text-sm font-semibold mb-2">Active Escalations</h3>
          <p className="text-4xl font-bold text-red-500">{activeEscalations}</p>
        </div>
        <div className="glass-panel">
          <h3 className="text-slate-500 text-sm font-semibold mb-2">Avg Check-in Score</h3>
          <p className={`text-4xl font-bold ${avgScore >= 80 ? 'text-emerald-500' : avgScore >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>{avgScore}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="glass-panel">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Goal Distribution by Thrust Area</h3>
          <div className="h-72">
            {pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-slate-400">Goal distribution will appear once goals are approved.</p>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>
        
        <div className="glass-panel">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Manager Effectiveness (Approvals)</h3>
          <div className="h-72 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
             <p className="text-slate-400">Add QoQ Actuals data to render completion heatmap</p>
          </div>
        </div>
      </div>
    </div>
  );
}
