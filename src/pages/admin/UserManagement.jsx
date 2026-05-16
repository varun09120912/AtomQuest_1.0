import React, { useContext } from 'react';
import { AppContext } from '../../store/AppContext';
import { Users, UserPlus } from 'lucide-react';

export default function UserManagement() {
  const { users } = useContext(AppContext);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={32} className="text-primary-600" />
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">User Management</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage employees, roles, and hierarchy.</p>
          </div>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <UserPlus size={18} /> Add User
        </button>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <th className="p-5">Name</th>
              <th className="p-5">Email</th>
              <th className="p-5">Role</th>
              <th className="p-5">Department</th>
              <th className="p-5">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="p-5 font-bold text-slate-800">{u.name}</td>
                <td className="p-5 text-slate-500">{u.email}</td>
                <td className="p-5 capitalize font-medium text-primary-700">{u.role}</td>
                <td className="p-5 text-slate-600">{u.dept}</td>
                <td className="p-5">
                  <span className="badge badge-success">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
