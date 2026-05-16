import React, { useContext, useState } from 'react';
import { AppContext } from '../../store/AppContext';
import { Target, Edit2, Users } from 'lucide-react';

export default function SharedGoals() {
  const { currentUser, users, goals, setGoals, cycles } = useContext(AppContext);
  const activeCycle = cycles.find(c => c.isActive) || cycles[0];
  
  // Admin can push to ANYONE, Manager can push to MY TEAM
  const myTeam = currentUser.role === 'admin' 
    ? users.filter(u => u.role === 'employee' || u.role === 'manager') 
    : users.filter(u => u.managerId === currentUser.id);

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', thrustArea: 'Financial', uom: 'numeric_max', target: '' });
  const [editingGroupId, setEditingGroupId] = useState(null);

  const toggleEmployee = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter(e => e !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const handlePush = (e) => {
    e.preventDefault();
    if (!editingGroupId && selectedEmployees.length === 0) return alert('Select at least one employee');

    if (editingGroupId) {
       const updated = goals.map(g => g.sharedGoalGroupId === editingGroupId 
          ? { ...g, title: newGoal.title, description: newGoal.description, thrustArea: newGoal.thrustArea, uom: newGoal.uom, target: newGoal.target } 
          : g);
       setGoals(updated);
       localStorage.setItem('atomquest_goals', JSON.stringify(updated));
       alert('Shared goal updated across all assigned employees in real-time!');
       setEditingGroupId(null);
    } else {
       const groupId = 'sg_' + Date.now();
       const newGoals = selectedEmployees.map(empId => ({
         ...newGoal,
         id: 'g' + Date.now() + Math.random(),
         sharedGoalGroupId: groupId,
         employeeId: empId,
         cycleYear: activeCycle?.year,
         weightage: 10,
         status: 'draft',
         sharedFrom: currentUser.id,
         sharedOwner: false,
         createdAt: Date.now(),
         updatedAt: Date.now()
       }));

       const updated = [...goals, ...newGoals];
       setGoals(updated);
       localStorage.setItem('atomquest_goals', JSON.stringify(updated));
       alert('Goal successfully pushed to selected team members!');
    }
    
    setNewGoal({ title: '', description: '', thrustArea: 'Financial', uom: 'numeric_max', target: '' });
    setSelectedEmployees([]);
  };

  const handleEdit = (groupGoals) => {
    const template = groupGoals[0];
    setNewGoal({ title: template.title, description: template.description, thrustArea: template.thrustArea, uom: template.uom, target: template.target });
    setEditingGroupId(template.sharedGoalGroupId);
    window.scrollTo(0, 0);
  };

  // Find unique pushed goals (Admin sees all, Managers see their own)
  const editableGoals = goals.filter(g => (g.sharedFrom === currentUser.id || currentUser.role === 'admin') && g.sharedGoalGroupId);
  const groupedPushedGoals = editableGoals.reduce((acc, goal) => {
    if (!acc[goal.sharedGoalGroupId]) acc[goal.sharedGoalGroupId] = [];
    acc[goal.sharedGoalGroupId].push(goal);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Push & Manage Shared Goals</h1>
        <p className="text-slate-500 mt-1 font-medium">Create departmental KPIs. Edits here will automatically fix typos in real-time for all assigned employees.</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-12">
        <form onSubmit={handlePush} className={`glass-panel border-2 ${editingGroupId ? 'border-amber-400 bg-amber-50/50' : 'border-primary-500'}`}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
            <Target className={editingGroupId ? 'text-amber-500' : 'text-primary-600'} /> 
            {editingGroupId ? 'Edit Pushed Goal' : 'Create New Shared Goal'}
          </h2>
          <div className="mb-4">
            <label className="form-label">Goal Title</label>
            <input required className="form-control" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="form-label">Thrust Area</label>
            <select className="form-control" value={newGoal.thrustArea} onChange={e => setNewGoal({...newGoal, thrustArea: e.target.value})}>
                          <option>Channel & Distribution Growth</option>
              <option>Manufacturing Excellence</option>
              <option>Product Innovation</option>
              <option>Energy Efficiency & Sustainability</option>
              <option>Customer Delight & NPS</option>
              <option>People & Culture</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="form-label">Description</label>
            <textarea required rows="2" className="form-control" value={newGoal.description} onChange={e => setNewGoal({...newGoal, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="form-label">UoM</label>
              <select className="form-control" value={newGoal.uom} onChange={e => setNewGoal({...newGoal, uom: e.target.value})}>
                <option value="numeric_max">Numeric (Higher is better)</option>
                <option value="numeric_min">Numeric (Lower is better)</option>
                <option value="timeline">Timeline Date</option>
              </select>
            </div>
            <div>
              <label className="form-label">Target</label>
              <input required className="form-control" value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-3">
            {editingGroupId && (
               <button type="button" onClick={() => {setEditingGroupId(null); setNewGoal({ title: '', description: '', thrustArea: 'Financial', uom: 'numeric_max', target: '' });}} className="btn-secondary w-1/3">Cancel</button>
            )}
            <button type="submit" className={`${editingGroupId ? 'btn-primary w-2/3 bg-amber-500 hover:bg-amber-600' : 'btn-primary w-full'}`}>
              {editingGroupId ? 'Update Across All Employees' : 'Push Goal'}
            </button>
          </div>
        </form>

        <div className="glass-panel">
          <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2"><Users className="text-primary-600"/> Select Recipients</h2>
          {editingGroupId ? (
            <div className="p-6 bg-slate-100 rounded-xl text-center border-2 border-dashed border-slate-300">
               <p className="font-bold text-slate-600 mb-2">You are editing an existing shared goal.</p>
               <p className="text-sm text-slate-500">Recipients cannot be changed here. Your edits will automatically apply to all employees who already have this goal.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {myTeam.map(emp => (
                <label key={emp.id} className="flex items-center gap-3 p-4 border-2 border-slate-100 rounded-xl cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-all">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" 
                    checked={selectedEmployees.includes(emp.id)}
                    onChange={() => toggleEmployee(emp.id)}
                  />
                  <div>
                    <p className="font-bold text-slate-800">{emp.name}</p>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{emp.dept} • {emp.role}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        <div className="bg-slate-50 p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Active Shared Goals</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <th className="p-5">Goal Title & Target</th>
              <th className="p-5">Thrust Area</th>
              <th className="p-5">Assigned To</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedPushedGoals).length === 0 ? (
               <tr><td colSpan="4" className="p-8 text-center text-slate-500 font-medium">No shared goals have been pushed yet.</td></tr>
            ) : (
               Object.entries(groupedPushedGoals).map(([groupId, groupGoals]) => {
                 const template = groupGoals[0];
                 return (
                   <tr key={groupId} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                     <td className="p-5">
                       <p className="font-bold text-slate-800">{template.title}</p>
                       <p className="text-sm text-slate-500">Target: {template.target} {template.uom}</p>
                     </td>
                     <td className="p-5">
                       <span className="badge badge-primary">{template.thrustArea}</span>
                     </td>
                     <td className="p-5">
                       <div className="flex -space-x-2">
                         {groupGoals.map((g, i) => {
                           const emp = users.find(u => u.id === g.employeeId);
                           if (i > 2) return null;
                           return <div key={g.id} title={emp?.name} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">{emp?.name.charAt(0)}</div>
                         })}
                         {groupGoals.length > 3 && <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">+{groupGoals.length - 3}</div>}
                       </div>
                     </td>
                     <td className="p-5 text-right flex justify-end gap-2">
                        <button onClick={() => handleEdit(groupGoals)} className="p-2 text-slate-400 hover:text-amber-600 bg-white rounded-lg border border-slate-200 shadow-sm transition-colors">
                          <Edit2 size={16} />
                        </button>
                     </td>
                   </tr>
                 )
               })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
