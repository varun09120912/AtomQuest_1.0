import React, { useContext } from 'react';
import { AppContext } from '../../store/AppContext';
import { Settings } from 'lucide-react';

export default function CycleConfig() {
  const { cycles, setCycles } = useContext(AppContext);

  const toggleActive = (id) => {
    const updated = cycles.map(c => ({ ...c, isActive: c.id === id }));
    setCycles(updated);
    localStorage.setItem('atomquest_cycles', JSON.stringify(updated));
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8 flex items-center gap-3">
        <Settings size={32} className="text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cycle Configuration</h1>
          <p className="text-slate-500 mt-1">Manage global system phases and access windows.</p>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-sm">
              <th className="p-4">Phase Name</th>
              <th className="p-4">Open Date</th>
              <th className="p-4">Close Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map(c => (
              <tr key={c.id} className={`border-b border-slate-100 ${c.isActive ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                <td className="p-4 font-semibold text-slate-800">{c.name} - {c.phase}</td>
                <td className="p-4 text-slate-600">{c.opensAt}</td>
                <td className="p-4 text-slate-600">{c.closesAt}</td>
                <td className="p-4">
                  {c.isActive ? <span className="badge badge-success">Active</span> : <span className="badge badge-draft">Inactive</span>}
                </td>
                <td className="p-4">
                  {!c.isActive && (
                    <button onClick={() => toggleActive(c.id)} className="text-primary hover:underline font-semibold text-sm">
                      Set Active
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {cycles.length === 1 && (
        <div className="mt-4 flex gap-2">
           <button className="btn-secondary" onClick={() => {
              const dummy = [
                { id: 'c1', name: 'FY2026', phase: 'Phase 1 - Goal Setting', opensAt: '2026-05-01', closesAt: '2026-05-31', isActive: false, year: 2026 },
                { id: 'c2', name: 'FY2026', phase: 'Q1 Check-in', opensAt: '2026-07-01', closesAt: '2026-07-31', isActive: true, year: 2026 }
              ];
              setCycles(dummy);
              localStorage.setItem('atomquest_cycles', JSON.stringify(dummy));
           }}>
             Populate Demo Phases
           </button>
        </div>
      )}
    </div>
  );
}
