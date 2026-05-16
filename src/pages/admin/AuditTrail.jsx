import React, { useContext } from 'react';
import { AppContext } from '../../store/AppContext';
import { FileText, Download } from 'lucide-react';

export default function AuditTrail() {
  const { auditLog } = useContext(AppContext);

  const exportCSV = () => {
    const headers = ['Timestamp', 'Actor', 'Action', 'Details'];
    const rows = auditLog.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.actor,
      log.action,
      log.details
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "audit_trail.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText size={32} className="text-primary-600" />
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Audit Trail</h1>
            <p className="text-slate-500 mt-1 font-medium">Immutable log of system events.</p>
          </div>
        </div>
        <button onClick={exportCSV} className="btn-secondary flex items-center gap-2">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <th className="p-5">Timestamp</th>
              <th className="p-5">Actor</th>
              <th className="p-5">Action</th>
              <th className="p-5">Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLog.length === 0 ? (
               <tr><td colSpan="4" className="p-8 text-center text-slate-500 font-medium">No audit logs available.</td></tr>
            ) : (
              auditLog.map(log => (
                <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="p-5 text-sm text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-5 font-bold text-slate-800">{log.actor}</td>
                  <td className="p-5 text-primary-700 font-medium">{log.action}</td>
                  <td className="p-5 text-slate-600 text-sm">{log.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
