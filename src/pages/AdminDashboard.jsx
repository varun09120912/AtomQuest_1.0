import React, { useState } from 'react';
import { getInitialGoals, mockUsers, getActiveCycle, saveActiveCycle } from '../utils/mockData';
import { Settings, BarChart2, Shield, Download, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export default function AdminDashboard() {
  const allGoals = getInitialGoals();
  const totalEmployees = mockUsers.filter(u => u.role === 'employee').length;
  const employeesWithGoals = new Set(allGoals.map(g => g.employeeId)).size;
  const submissionRate = Math.round((employeesWithGoals / totalEmployees) * 100) || 0;

  const [cycle, setCycle] = useState(getActiveCycle());

  const handleUpdateCycle = () => {
    saveActiveCycle(cycle);
    alert('Cycle updated successfully! Refreshing app context...');
    window.location.reload();
  };

  // Analytics Data
  const thrustAreaCounts = allGoals.reduce((acc, g) => {
    acc[g.thrustArea] = (acc[g.thrustArea] || 0) + 1;
    return acc;
  }, {});
  const thrustData = Object.keys(thrustAreaCounts).map(key => ({ name: key, value: thrustAreaCounts[key] }));
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#0EA5E9'];

  const statusCounts = allGoals.reduce((acc, g) => {
    acc[g.status] = (acc[g.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.keys(statusCounts).map(key => ({ name: key, goals: statusCounts[key] }));

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Console</h1>
          <p className="text-muted mt-1">System configuration, compliance, and reporting.</p>
        </div>
        <button className="btn-secondary">
          <Download size={20} /> Export Report
        </button>
      </div>

      <div className="grid-cols-4 mb-8">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex-between mb-4">
            <h3 className="text-muted text-sm">Goal Submission Rate</h3>
            <BarChart2 size={20} color="var(--primary)" />
          </div>
          <p className="font-bold text-lg">{submissionRate}%</p>
          <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '4px', borderRadius: '2px', marginTop: '0.5rem' }}>
            <div style={{ width: `${submissionRate}%`, background: 'var(--primary)', height: '100%', borderRadius: '2px' }}></div>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex-between mb-4">
            <h3 className="text-muted text-sm">Pending Approvals</h3>
            <Shield size={20} color="var(--warning)" />
          </div>
          <p className="font-bold text-lg text-warning">{allGoals.filter(g => !g.isApproved).length}</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex-between mb-4">
            <h3 className="text-muted text-sm">System Status</h3>
            <Settings size={20} color="var(--success)" />
          </div>
          <p className="font-bold text-lg text-success">Healthy</p>
        </div>
      </div>

      <div className="grid-cols-2 mb-8">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 className="mb-4">Cycle Management</h2>
          <div className="form-group">
            <label className="form-label">Current Phase</label>
            <select className="form-control" value={cycle.phase} onChange={e => setCycle({...cycle, phase: e.target.value})}>
              <option value="Phase 1 - Goal Setting">Phase 1 - Goal Setting</option>
              <option value="Q1 Check-in">Q1 Check-in</option>
              <option value="Q2 Check-in">Q2 Check-in</option>
              <option value="Q3 Check-in">Q3 Check-in</option>
              <option value="Q4 / Annual Review">Q4 / Annual Review</option>
            </select>
          </div>
          <button className="btn-primary mt-2" onClick={handleUpdateCycle}>Update Cycle</button>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 className="mb-4">Escalation & Audit Log</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <p className="text-sm font-semibold">Goal Unlocked</p>
              <p className="text-xs text-muted mt-1">Admin Diana unlocked goals for Alice Smith for Q1 editing. (2 hrs ago)</p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
              <p className="text-sm font-semibold text-danger">Escalation Triggered</p>
              <p className="text-xs text-muted mt-1">Manager Charlie has not approved goals for 5 days. Auto-escalated to Skip-Level Manager.</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-4 mt-8 flex-gap" style={{ alignItems: 'center' }}>
        <PieChartIcon size={24} color="var(--primary)" /> Analytics Module
      </h2>
      <div className="grid-cols-2 mb-8">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 className="mb-4 text-sm font-semibold text-muted">Goal Distribution by Thrust Area</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={thrustData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {thrustData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0A0F1C', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 className="mb-4 text-sm font-semibold text-muted">Org Completion Status</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ background: '#0A0F1C', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Bar dataKey="goals" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
