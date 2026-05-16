import React, { useContext } from 'react';
import { AppContext } from '../../store/AppContext';
import { LayoutDashboard, Zap, Mail, FileSpreadsheet, Clock, Users, Target } from 'lucide-react';

export default function CompletionDashboard() {
  const { users, goals, checkIns, escalations } = useContext(AppContext);

  const employees = users.filter(u => u.role === 'employee');
  const totalEmployees = employees.length;

  // Dynamically compute per-department stats
  const depts = [...new Set(employees.map(u => u.dept))];

  const deptStats = depts.map(dept => {
    const deptEmployees = employees.filter(u => u.dept === dept);
    const deptIds = deptEmployees.map(u => u.id);
    const deptGoals = goals.filter(g => deptIds.includes(g.employeeId) && g.status === 'approved');
    const deptCheckIns = checkIns.filter(c => deptIds.includes(c.employeeId));
    const avgScore = deptCheckIns.length > 0
      ? Math.round(deptCheckIns.reduce((s, c) => s + (c.score || 0), 0) / deptCheckIns.length)
      : 0;
    const hasGoals = deptGoals.length > 0;
    return { dept, avgScore, hasGoals, empCount: deptEmployees.length, checkInCount: deptCheckIns.length };
  });

  const employeesWithGoals = new Set(goals.filter(g => g.status === 'approved').map(g => g.employeeId)).size;
  const employeesWithCheckIns = new Set(checkIns.map(c => c.employeeId)).size;
  const activeEscalations = escalations.filter(e => !e.resolved).length;

  const submissionRate = totalEmployees ? Math.round((employees.filter(u => goals.some(g => g.employeeId === u.id)).length / totalEmployees) * 100) : 0;
  const approvalRate   = totalEmployees ? Math.round((employeesWithGoals / totalEmployees) * 100) : 0;
  const q1Rate         = totalEmployees ? Math.round((employeesWithCheckIns / totalEmployees) * 100) : 0;

  const overallScore = checkIns.length > 0
    ? Math.round(checkIns.reduce((s, c) => s + (c.score || 0), 0) / checkIns.length)
    : 0;

  const noData = goals.length === 0;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-primary-600 p-2 rounded-xl shadow-lg">
          <LayoutDashboard size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Atomberg Performance Pulse</h1>
          <p className="text-slate-500 mt-1 font-medium">FY2026 Q1 — Organization-wide OKR compliance. Updates live as team submits data.</p>
        </div>
      </div>

      {/* Company Scorecard */}
      <div className="glass-panel mb-8 bg-gradient-to-br from-slate-900 to-primary-900 text-white border-0 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-primary-300 text-sm font-bold uppercase tracking-widest mb-1">Company Scorecard</p>
            <h2 className="text-3xl font-extrabold">FY2026 Q1 Performance Pulse</h2>
            <p className="text-slate-400 mt-1">{employees.length} employees · {depts.length} departments</p>
          </div>
          <div className="text-right">
            <p className="text-6xl font-extrabold text-primary-400">{overallScore}%</p>
            <p className="text-slate-400 text-sm">Company Avg Score</p>
          </div>
        </div>

        {noData ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-700 rounded-2xl">
            <p className="text-slate-400 font-semibold">Department scores will appear here once employees submit goals & check-ins.</p>
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(depts.length, 5)}, 1fr)` }}>
            {deptStats.map(d => (
              <div key={d.dept} className="bg-white/10 rounded-2xl p-4">
                <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-2 truncate">{d.dept}</p>
                <p className={`text-2xl font-extrabold ${d.avgScore >= 80 ? 'text-emerald-400' : d.avgScore >= 50 ? 'text-amber-400' : d.avgScore > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                  {d.checkInCount > 0 ? `${d.avgScore}%` : '—'}
                </p>
                <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
                  <div className={`h-1.5 rounded-full ${d.avgScore >= 80 ? 'bg-emerald-400' : d.avgScore >= 50 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${d.avgScore}%` }} />
                </div>
                <p className="text-xs text-slate-400 mt-1">{d.checkInCount}/{d.empCount} submitted</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="glass-panel p-6">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">OKR Submission Rate</h3>
          <p className="text-4xl font-extrabold text-slate-800">{submissionRate}%</p>
          <p className="text-slate-400 text-xs mt-1">{employees.filter(u => goals.some(g => g.employeeId === u.id)).length} of {totalEmployees} employees</p>
        </div>
        <div className="glass-panel p-6">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Approval Rate</h3>
          <p className="text-4xl font-extrabold text-primary-600">{approvalRate}%</p>
          <p className="text-slate-400 text-xs mt-1">{employeesWithGoals} approved</p>
        </div>
        <div className="glass-panel p-6">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Q1 Pulse Completion</h3>
          <p className="text-4xl font-extrabold text-emerald-500">{q1Rate}%</p>
          <p className="text-slate-400 text-xs mt-1">{employeesWithCheckIns} submitted check-ins</p>
        </div>
        <div className="glass-panel p-6 border-b-4 border-b-rose-500">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Active Escalations</h3>
          <p className="text-4xl font-extrabold text-rose-600">{activeEscalations}</p>
          <p className="text-slate-400 text-xs mt-1">require action</p>
        </div>
      </div>

      {/* Per-Dept Progress Bars */}
      <div className="glass-panel mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Department Check-in Progress</h2>
        {noData ? (
          <div className="flex items-center justify-center h-24 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <p className="text-slate-400 font-medium">Data populates as employees submit check-ins.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deptStats.map(d => {
              const pct = d.empCount > 0 ? Math.round((d.checkInCount / d.empCount) * 100) : 0;
              return (
                <div key={d.dept} className="flex items-center gap-4">
                  <div className="w-44 text-sm font-bold text-slate-700 shrink-0 truncate">{d.dept}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                    <div
                      className={`h-full rounded-full flex items-center justify-end pr-3 text-xs font-extrabold text-white transition-all duration-500 ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-400' : pct > 0 ? 'bg-primary-500' : 'bg-slate-200'}`}
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    >
                      {pct > 10 ? `${pct}%` : ''}
                    </div>
                  </div>
                  <div className="w-24 text-right text-sm font-semibold text-slate-600">{d.checkInCount}/{d.empCount} done</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Efficiency Impact Card */}
      <div className="glass-panel bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
        <div className="flex items-start gap-6">
          <div className="bg-emerald-500 p-4 rounded-2xl shadow-lg shrink-0">
            <Zap size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-emerald-700 text-sm font-bold uppercase tracking-widest mb-1">AtomQuest Impact Report</p>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-4">By Digitalising Goal Tracking, We Saved:</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-emerald-100">
                <Mail size={24} className="mx-auto mb-2 text-emerald-500" />
                <p className="text-3xl font-extrabold text-slate-900">{Math.max(goals.length * 12, 0) || '—'}</p>
                <p className="text-sm text-slate-500 font-medium">Status Emails Eliminated</p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-emerald-100">
                <FileSpreadsheet size={24} className="mx-auto mb-2 text-emerald-500" />
                <p className="text-3xl font-extrabold text-slate-900">{Math.max(employees.length, 0) || '—'}</p>
                <p className="text-sm text-slate-500 font-medium">Spreadsheets Replaced</p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-emerald-100">
                <Clock size={24} className="mx-auto mb-2 text-emerald-500" />
                <p className="text-3xl font-extrabold text-slate-900">{checkIns.length > 0 ? `${checkIns.length * 2} hrs` : '—'}</p>
                <p className="text-sm text-slate-500 font-medium">HR Review Hours Saved</p>
              </div>
            </div>
            <p className="text-emerald-700 text-sm font-semibold mt-4 italic">
              "Just like Atomberg's BLDC fans save energy without compromising performance, AtomQuest eliminates process waste without compromising accountability."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
