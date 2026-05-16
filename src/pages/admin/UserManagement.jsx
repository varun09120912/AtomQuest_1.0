import React, { useContext, useState } from 'react';
import { AppContext } from '../../store/AppContext';
import { Users, UserPlus, Trash2, Edit2 } from 'lucide-react';

export default function UserManagement() {
  const { users, setUsers } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'employee', dept: 'Engineering', managerId: '', phone: ''
  });

  const managers = users.filter(u => u.role === 'manager' || u.role === 'admin');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const updated = users.map(u => u.id === editingId ? { ...u, ...formData } : u);
      setUsers(updated);
      localStorage.setItem('atomquest_users', JSON.stringify(updated));
    } else {
      const newUser = {
        ...formData,
        id: 'u' + Date.now(),
        grade: 'L1'
      };
      const updated = [...users, newUser];
      setUsers(updated);
      localStorage.setItem('atomquest_users', JSON.stringify(updated));
    }
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', email: '', password: '', role: 'employee', dept: 'Engineering', managerId: '', phone: '' });
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      const updated = users.filter(u => u.id !== id);
      setUsers(updated);
      localStorage.setItem('atomquest_users', JSON.stringify(updated));
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary-600 p-2 rounded-xl shadow-lg">
            <Users size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage employees, roles, and hierarchy dynamically.</p>
          </div>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', email: '', password: '', role: 'employee', dept: 'Engineering', managerId: '', phone: '' }); }} className="btn-primary flex items-center gap-2">
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-panel mb-8 border-2 border-primary-500">
          <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit User' : 'Create New User'}</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="form-label">Full Name</label>
              <input required className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <input required type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label className="form-label">Password</label>
              <input required className="form-control" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Phone Number</label>
              <input className="form-control" placeholder="+1..." value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="form-label">System Role</label>
              <select className="form-control" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin / HR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="form-label">Department</label>
              <input required className="form-control" value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Assign Manager</label>
              <select className="form-control" value={formData.managerId} onChange={e => setFormData({...formData, managerId: e.target.value})}>
                <option value="">No Manager</option>
                {managers.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save User Record</button>
          </div>
        </form>
      )}

      <div className="glass-panel p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <th className="p-5">Name</th>
              <th className="p-5">Contact Details</th>
              <th className="p-5">Role & Dept</th>
              <th className="p-5">Manager</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const mgr = users.find(m => m.id === u.managerId);
              return (
                <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="p-5 font-bold text-slate-800">{u.name}</td>
                  <td className="p-5 text-sm">
                    <p className="text-slate-700 font-medium">{u.email}</p>
                    <p className="text-slate-400">{u.phone || 'No phone'}</p>
                  </td>
                  <td className="p-5">
                    <span className={`badge mb-1 ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'manager' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                      {u.role}
                    </span>
                    <p className="text-slate-500 text-xs">{u.dept}</p>
                  </td>
                  <td className="p-5 text-slate-600 text-sm">{mgr ? mgr.name : '—'}</td>
                  <td className="p-5 text-right flex justify-end gap-2">
                    <button onClick={() => handleEdit(u)} className="p-2 text-slate-400 hover:text-primary-600 bg-white rounded-lg border border-slate-200 shadow-sm transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(u.id)} className="p-2 text-slate-400 hover:text-red-600 bg-white rounded-lg border border-slate-200 shadow-sm transition-colors">
                      <Trash2 size={16} />
                    </button>
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
