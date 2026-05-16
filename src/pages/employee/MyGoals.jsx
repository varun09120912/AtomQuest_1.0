import React, { useContext, useState } from 'react';
import { AppContext } from '../../store/AppContext';
import { Target, Plus, Trash2, Lock, AlertCircle } from 'lucide-react';

export default function MyGoals() {
  const { currentUser, goals, saveGoals, cycles, notifications, setNotifications, auditLog, saveAuditLog, users } = useContext(AppContext);
  const activeCycle = cycles.find(c => c.isActive) || cycles[0];
  
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', thrustArea: 'Financial', uom: 'numeric_max', target: '', weightage: '' });

  const myGoals = goals.filter(g => g.employeeId === currentUser.id);
  const totalWeightage = myGoals.reduce((sum, g) => sum + Number(g.weightage), 0);
  
  const isDraftPhase = myGoals.length === 0 || myGoals.every(g => g.status === 'draft' || g.status === 'returned');
  const isPending = myGoals.some(g => g.status === 'pending');
  const isApproved = myGoals.some(g => g.status === 'approved');

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (myGoals.length >= 8) return alert('Maximum 8 goals allowed.');
    if (Number(newGoal.weightage) < 10) return alert('Minimum weightage is 10%.');
    if (totalWeightage + Number(newGoal.weightage) > 100) return alert(`Total weightage cannot exceed 100%. You have ${100 - totalWeightage}% remaining.`);

    const goal = {
      ...newGoal,
      id: 'g' + Date.now(),
      employeeId: currentUser.id,
      cycleYear: activeCycle?.year,
      status: 'draft',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    const updated = [...goals, goal];
    saveGoals(updated);
    setShowForm(false);
    setNewGoal({ title: '', description: '', thrustArea: 'Financial', uom: 'numeric_max', target: '', weightage: '' });
  };

  const handleDelete = (id) => {
    const updated = goals.filter(g => g.id !== id);
    saveGoals(updated);
  };

  const handleSubmit = () => {
    if (totalWeightage !== 100) return alert(`Total weightage must be exactly 100% to submit. Currently: ${totalWeightage}%.`);
    if (myGoals.filter(g => g.status === 'draft' || g.status === 'returned').length === 0)
      return alert('No draft goals to submit.');

    // Only move draft/returned → pending; leave approved ones untouched
    const updated = goals.map(g =>
      (g.employeeId === currentUser.id && (g.status === 'draft' || g.status === 'returned'))
        ? { ...g, status: 'pending', updatedAt: Date.now() }
        : g
    );
    saveGoals(updated);

    // Notify the employee's manager
    const manager = users.find(u => u.id === currentUser.managerId);
    if (manager && notifications !== undefined) {
      const notif = {
        id: 'n' + Date.now(),
        userId: manager.id,
        title: 'Goal Sheet Submitted for Approval',
        message: `${currentUser.name} has submitted ${myGoals.filter(g => g.status === 'draft' || g.status === 'returned').length} goals for your approval. Total weightage: ${totalWeightage}%.`,
        type: 'approval_request',
        timestamp: Date.now(),
        read: false
      };
      const updatedN = [...(notifications || []), notif];
      setNotifications(updatedN);
      localStorage.setItem('atomquest_notifications', JSON.stringify(updatedN));
    }

    // Add audit log
    if (saveAuditLog) {
      const entry = {
        id: 'al' + Date.now(),
        timestamp: Date.now(),
        actor: currentUser.name,
        role: currentUser.role,
        action: 'GOALS_SUBMITTED',
        affectedPerson: currentUser.name,
        details: `Submitted ${myGoals.filter(g => g.status === 'draft' || g.status === 'returned').length} goals for manager approval. Total weightage: ${totalWeightage}%.`
      };
      saveAuditLog([...(auditLog || []), entry]);
    }

    alert('✅ Goals submitted for approval! Your manager has been notified.');
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Goals</h1>
          <p className="text-slate-500 mt-1">Manage your objectives for {activeCycle?.name}</p>
        </div>
        {isDraftPhase && (
          <button 
            className="btn-primary flex items-center gap-2" 
            onClick={() => setShowForm(true)}
            disabled={myGoals.length >= 8}
          >
            <Plus size={18} /> Add Goal
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="glass-panel flex flex-col">
          <span className="text-slate-500 text-sm font-semibold mb-2">Total Weightage</span>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-bold ${totalWeightage === 100 ? 'text-green-600' : totalWeightage > 100 ? 'text-red-600' : 'text-yellow-600'}`}>
              {totalWeightage}%
            </span>
            <span className="text-sm text-slate-400 mb-1">/ 100%</span>
          </div>
        </div>
        <div className="glass-panel flex flex-col">
          <span className="text-slate-500 text-sm font-semibold mb-2">Goal Count</span>
          <span className="text-4xl font-bold text-slate-800">{myGoals.length} <span className="text-lg text-slate-400">/ 8</span></span>
        </div>
        <div className="glass-panel flex flex-col">
          <span className="text-slate-500 text-sm font-semibold mb-2">Status</span>
          {isApproved ? <span className="badge badge-success self-start mt-2 text-base px-3 py-1">Approved & Locked</span> :
           isPending ? <span className="badge badge-warning self-start mt-2 text-base px-3 py-1">Awaiting Manager</span> :
           <span className="badge badge-draft self-start mt-2 text-base px-3 py-1">Drafting</span>}
        </div>
      </div>

      {isPending && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-8 flex items-center gap-3">
          <AlertCircle size={20} />
          <p>Your goals have been submitted and are pending manager approval. You cannot make edits at this time.</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAddGoal} className="glass-panel mb-8 border-primary border-2">
          <h2 className="text-lg font-bold mb-4">Create New Goal</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="form-label">Goal Title</label>
              <input required className="form-control" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} />
            </div>
            <div>
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
          </div>
          <div className="mb-4">
            <label className="form-label">Description</label>
            <textarea required rows="2" className="form-control" value={newGoal.description} onChange={e => setNewGoal({...newGoal, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="form-label">UoM</label>
              <select className="form-control" value={newGoal.uom} onChange={e => setNewGoal({...newGoal, uom: e.target.value})}>
                <option value="numeric_max">Numeric (Higher is better)</option>
                <option value="numeric_min">Numeric (Lower is better)</option>
                <option value="percent_max">% (Higher is better)</option>
                <option value="timeline">Timeline Date</option>
                <option value="zero">Zero Tolerance</option>
              </select>
            </div>
            <div>
              <label className="form-label">Target</label>
              <input required className="form-control" value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Weightage (%)</label>
              <input required type="number" min="10" max="100" className="form-control" value={newGoal.weightage} onChange={e => setNewGoal({...newGoal, weightage: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Draft</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {myGoals.map(g => (
          <div key={g.id} className="glass-panel flex flex-col relative overflow-hidden">
            {g.status === 'approved' && <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  {g.title} {g.status === 'approved' && <Lock size={16} className="text-slate-400" />}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{g.description}</p>
              </div>
              {isDraftPhase && (
                <button onClick={() => handleDelete(g.id)} className="text-red-400 hover:text-red-600 transition-colors p-2">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg text-sm border border-slate-100">
              <div><span className="text-slate-500 block text-xs mb-1">Thrust Area</span><span className="font-semibold">{g.thrustArea}</span></div>
              <div><span className="text-slate-500 block text-xs mb-1">Target ({g.uom})</span><span className="font-semibold">{g.target}</span></div>
              <div><span className="text-slate-500 block text-xs mb-1">Weightage</span><span className="font-semibold">{g.weightage}%</span></div>
              <div><span className="text-slate-500 block text-xs mb-1">Status</span>
                <span className={`badge capitalize ${g.status==='approved'?'badge-success':g.status==='pending'?'badge-warning':'badge-draft'}`}>{g.status}</span>
              </div>
            </div>
          </div>
        ))}
        {myGoals.length === 0 && !showForm && (
          <div className="text-center py-12 text-slate-500 bg-white border border-dashed border-slate-300 rounded-xl">
            <Target size={48} className="mx-auto mb-4 text-slate-300" />
            <p>You have not created any goals yet.</p>
          </div>
        )}
      </div>

      {isDraftPhase && myGoals.length > 0 && (
        <div className="mt-8 flex justify-end">
          <button 
            className="btn-primary px-8 py-3 text-lg"
            onClick={handleSubmit}
            disabled={totalWeightage !== 100}
          >
            Submit Goals for Approval
          </button>
        </div>
      )}
    </div>
  );
}
