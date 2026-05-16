import React, { useContext } from 'react';
import { AppContext } from '../../store/AppContext';
import { LayoutDashboard, Zap, Mail, FileSpreadsheet, Clock } from 'lucide-react';

const DEPT_SCORES = [
  { dept: 'Sales', q1: 84, pillar: 'Channel & Distribution Growth', color: 'bg-primary-600' },
  { dept: 'Operations', q1: 72, pillar: 'Manufacturing Excellence', color: 'bg-amber-500' },
  { dept: 'Product & R&D', q1: 100, pillar: 'Product Innovation', color: 'bg-emerald-500' },
  { dept: 'Marketing', q1: 80, pillar: 'Energy Efficiency & Sustainability', color: 'bg-violet-500' },
  { dept: 'Customer Service', q1: 0, pillar: 'Customer Delight & NPS', color: 'bg-rose-500' },
];

export default function CompletionDashboard() {
  const { users, goals, checkIns, escalations } = useContext(AppContext);
  const employees = users.filter(u => u.role === 'employee');
  const totalEmployees = employees.length;
  
  const employeesWithGoals = new Set(goals.filter(g => g.status === 'approved').map(g => g.employeeId)).size;
  const employeesWithCheckIns = new Set(checkIns.map(c => c.employeeId)).size;
  const activeEscalations = escalations.filter(e => !e.resolved).length;
  
  const approvalRate = totalEmployees ? Math.round((employeesWithGoals / totalEmployees) * 100) : 0;
  const q1CompletionRate = totalEmployees ? Math.round((employeesWithCheckIns / totalEmployees) * 100) : 0;
  const overallScore = Math.round(DEPT_SCORES.filter(d => d.q1 > 0).reduce((sum, d) => sum + d.q1, 0) / DEPT_SCORES.filter(d => d.q1 > 0).length);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-primary-600 p-2 rounded-xl shadow-lg">
          <LayoutDashboard size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Atomberg Performance Pulse</h1>
          <p className="text-slate-500 mt-1 font-medium">FY2026 Q1 — Organization-wide OKR compliance dashboard</p>
        </div>
      </div>

      {/* Company Scorecard */}
      <div className="glass-panel mb-8 bg-gradient-to-br from-slate-900 to-primary-900 text-white border-0 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-primary-300 text-sm font-bold uppercase tracking-widest mb-1">Company Scorecard</p>
            <h2 className="text-3xl font-extrabold">FY2026 Q1 Performance Pulse</h2>
            <p className="text-slate-400 mt-1">Overall company OKR achievement</p>
          </div>
          <div className="text-right">
            <p className="text-6xl font-extrabold text-primary-400">{overallScore}%</p>
            <p className="text-slate-400 text-sm">Average Score</p>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {DEPT_SCORES.map(dept => (
            <div key={dept.dept} className="bg-white/10 rounded-2xl p-4">
              <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">{dept.dept}</p>
              <p className={`text-2xl font-extrabold ${dept.q1 >= 80 ? 'text-emerald-400' : dept.q1 >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                {dept.q1}%
              </p>
              <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
                <div className={`h-1.5 rounded-full ${dept.q1 >= 80 ? 'bg-emerald-400' : dept.q1 >= 50 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${dept.q1}%` }} />
              </div>
              <p className={`text-xs font-semibold mt-1 ${dept.q1 >= 80 ? 'text-emerald-400' : dept.q1 >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                {dept.q1 >= 80 ? '🟢 On Track' : dept.q1 >= 50 ? '🟡 At Risk' : '🔴 Critical'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="glass-panel p-6">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">OKR Submission Rate</h3>
          <p className="text-4xl font-extrabold text-slate-800">80%</p>
        </div>
        <div className="glass-panel p-6">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Approval Rate</h3>
          <p className="text-4xl font-extrabold text-primary-600">{approvalRate}%</p>
        </div>
        <div className="glass-panel p-6">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Q1 Pulse Completion</h3>
          <p className="text-4xl font-extrabold text-emerald-500">{q1CompletionRate}%</p>
        </div>
        <div className="glass-panel p-6 border-b-4 border-b-rose-500">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Active Escalations</h3>
          <p className="text-4xl font-extrabold text-rose-600">{activeEscalations}</p>
        </div>
      </div>

      {/* Strategic Pillar Heatmap */}
      <div className="glass-panel mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Strategic Pillar Achievement</h2>
        <div className="space-y-4">
          {DEPT_SCORES.map(d => (
            <div key={d.dept} className="flex items-center gap-4">
              <div className="w-40 text-sm font-bold text-slate-700 shrink-0">{d.dept}</div>
              <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                <div 
                  className={`h-full rounded-full flex items-center justify-end pr-3 text-xs font-extrabold text-white transition-all duration-500 ${d.color}`}
                  style={{ width: `${Math.max(d.q1, 5)}%` }}
                >
                  {d.q1 > 10 ? `${d.q1}%` : ''}
                </div>
              </div>
              <div className="w-12 text-right font-bold text-slate-700">{d.q1}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Atomberg Easter Egg — Efficiency Impact Card */}
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
                <p className="text-3xl font-extrabold text-slate-900">847</p>
                <p className="text-sm text-slate-500 font-medium">Emails Eliminated</p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-emerald-100">
                <FileSpreadsheet size={24} className="mx-auto mb-2 text-emerald-500" />
                <p className="text-3xl font-extrabold text-slate-900">23</p>
                <p className="text-sm text-slate-500 font-medium">Spreadsheet Files Removed</p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-emerald-100">
                <Clock size={24} className="mx-auto mb-2 text-emerald-500" />
                <p className="text-3xl font-extrabold text-slate-900">14 hrs</p>
                <p className="text-sm text-slate-500 font-medium">HR Time Saved This Quarter</p>
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
