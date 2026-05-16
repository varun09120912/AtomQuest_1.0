import React, { useContext } from 'react';
import { AppContext } from '../../store/AppContext';
import { ShieldAlert, Check } from 'lucide-react';

export default function EscalationLog() {
  const { escalations, setEscalations, users } = useContext(AppContext);

  const resolveEscalation = (id) => {
    const updated = escalations.map(e => e.id === id ? { ...e, resolved: true, resolvedAt: Date.now() } : e);
    setEscalations(updated);
    localStorage.setItem('atomquest_escalations', JSON.stringify(updated));
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex items-center gap-3">
        <ShieldAlert size={32} className="text-red-500" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Escalation Log</h1>
          <p className="text-slate-500 mt-1">Rule-based SLA breaches requiring intervention.</p>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-sm">
              <th className="p-4">Type</th>
              <th className="p-4">Affected Employee</th>
              <th className="p-4">Level</th>
              <th className="p-4">Triggered At</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {escalations.map(esc => {
              const emp = users.find(u => u.id === esc.employeeId);
              return (
                <tr key={esc.id} className={`border-b border-slate-100 ${!esc.resolved ? 'bg-red-50/30' : 'opacity-75'}`}>
                  <td className="p-4 font-semibold text-slate-800 capitalize">{esc.type.replace(/_/g, ' ')}</td>
                  <td className="p-4 text-slate-600">{emp?.name || 'Unknown'}</td>
                  <td className="p-4">
                    <span className={`badge ${esc.level === 'hr' ? 'badge-danger' : 'badge-warning'} uppercase`}>{esc.level}</span>
                  </td>
                  <td className="p-4 text-slate-600">{new Date(esc.triggeredAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    {esc.resolved ? <span className="badge badge-success">Resolved</span> : <span className="badge badge-danger">Active</span>}
                  </td>
                  <td className="p-4">
                    {!esc.resolved && (
                      <button onClick={() => resolveEscalation(esc.id)} className="btn-secondary py-1 px-3 text-sm flex items-center gap-1">
                        <Check size={14} /> Resolve
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {escalations.length === 0 && (
              <tr><td colSpan="6" className="text-center py-8 text-slate-500">No escalations triggered.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
