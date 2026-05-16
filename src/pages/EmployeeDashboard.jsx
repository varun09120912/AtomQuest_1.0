import React, { useState, useEffect } from 'react';
import { getInitialGoals, saveGoals, getActiveCycle } from '../utils/mockData';
import { Plus, Target, CheckCircle, Clock } from 'lucide-react';

export default function EmployeeDashboard({ currentUser }) {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [updateActualsId, setUpdateActualsId] = useState(null);
  const cycle = getActiveCycle();

  useEffect(() => {
    const allGoals = getInitialGoals();
    setGoals(allGoals.filter(g => g.employeeId === currentUser.id));
  }, [currentUser.id]);

  const totalWeightage = goals.reduce((acc, g) => acc + Number(g.weightage), 0);

  const handleSaveGoal = (newGoal) => {
    if (totalWeightage + Number(newGoal.weightage) > 100) {
      alert("Total weightage across all goals cannot exceed 100%.");
      return;
    }
    if (goals.length >= 8) {
      alert("Maximum 8 goals allowed.");
      return;
    }

    const allGoals = getInitialGoals();
    newGoal.id = 'g' + Date.now();
    newGoal.employeeId = currentUser.id;
    newGoal.isSubmitted = false;
    newGoal.isApproved = false;
    newGoal.isShared = false;
    newGoal.status = 'Not Started';
    newGoal.progressActuals = { Q1: null, Q2: null, Q3: null, Q4: null };
    
    allGoals.push(newGoal);
    saveGoals(allGoals);
    setGoals(allGoals.filter(g => g.employeeId === currentUser.id));
    setShowForm(false);
  };

  const handleSubmitGoals = () => {
    if (totalWeightage !== 100) {
      alert("Total weightage must equal exactly 100% to submit.");
      return;
    }
    const allGoals = getInitialGoals();
    const updated = allGoals.map(g => g.employeeId === currentUser.id ? { ...g, isSubmitted: true } : g);
    saveGoals(updated);
    setGoals(updated.filter(g => g.employeeId === currentUser.id));
    alert("Goals submitted to Manager for approval.");
  };

  const handleSaveActuals = (goalId, actual, status) => {
    const allGoals = getInitialGoals();
    const cycleKey = cycle.phase.split(' ')[0]; // 'Q1', 'Q2', etc.
    const updated = allGoals.map(g => {
      if(g.id === goalId) {
        return {
          ...g,
          status: status,
          progressActuals: { ...g.progressActuals, [cycleKey]: actual }
        };
      }
      return g;
    });
    saveGoals(updated);
    setGoals(updated.filter(g => g.employeeId === currentUser.id));
    setUpdateActualsId(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Goals</h1>
          <p className="text-muted mt-1">Manage your objectives and track achievements.</p>
        </div>
        <div className="flex-gap">
          {!showForm && cycle.phase === 'Phase 1 - Goal Setting' && !goals.every(g => g.isSubmitted) && (
            <button className="btn-secondary" onClick={() => setShowForm(true)}>
              <Plus size={20} /> Create Goal
            </button>
          )}
          {cycle.phase === 'Phase 1 - Goal Setting' && !goals.every(g => g.isSubmitted) && (
            <button className="btn-primary" onClick={handleSubmitGoals}>
              Submit Goals
            </button>
          )}
        </div>
      </div>

      <div className="grid-cols-3 mb-8">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex-between mb-4">
            <h3 className="text-muted text-sm">Total Weightage</h3>
            <Target size={20} color="var(--primary)" />
          </div>
          <p className="font-bold text-lg" style={{ color: totalWeightage === 100 ? 'var(--success)' : totalWeightage > 100 ? 'var(--danger)' : 'var(--warning)' }}>
            {totalWeightage}%
          </p>
          <p className="text-sm mt-1">Target: 100%</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex-between mb-4">
            <h3 className="text-muted text-sm">Active Goals</h3>
            <CheckCircle size={20} color="var(--success)" />
          </div>
          <p className="font-bold text-lg">{goals.length} / 8</p>
          <p className="text-sm mt-1">Max allowed: 8</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex-between mb-4">
            <h3 className="text-muted text-sm">Approval Status</h3>
            <Clock size={20} color="var(--warning)" />
          </div>
          <p className="font-bold text-lg">
            {goals.every(g => g.isApproved) && goals.length > 0 ? 'Approved' : goals.some(g => g.isSubmitted) ? 'Manager Review' : 'Draft'}
          </p>
          <p className="text-sm mt-1">Status</p>
        </div>
      </div>

      {showForm && (
        <GoalForm onSave={handleSaveGoal} onCancel={() => setShowForm(false)} />
      )}

      {!showForm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {goals.map(g => (
            <React.Fragment key={g.id}>
              <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="flex-gap" style={{ alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 className="font-semibold">{g.title}</h3>
                    {g.isShared && <span className="badge badge-info">Shared KPI</span>}
                    {g.isApproved ? <span className="badge badge-success">Approved</span> : g.isSubmitted ? <span className="badge badge-warning">Pending Approval</span> : <span className="badge badge-warning">Draft</span>}
                  </div>
                  <p className="text-sm text-muted">{g.description}</p>
                  <div className="flex-gap mt-4 text-sm" style={{ alignItems: 'center' }}>
                    <span><strong>Area:</strong> {g.thrustArea}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong>Weight:</strong> 
                      {!g.isSubmitted ? (
                        <input 
                          type="number" 
                          value={g.weightage} 
                          onChange={(e) => {
                            const newWeight = e.target.value;
                            const all = getInitialGoals();
                            const updated = all.map(goal => goal.id === g.id ? { ...goal, weightage: newWeight } : goal);
                            saveGoals(updated);
                            setGoals(updated.filter(goal => goal.employeeId === currentUser.id));
                          }}
                          style={{ width: '60px', padding: '0.2rem', background: 'transparent', border: '1px solid var(--border-light)', color: 'white', borderRadius: '4px' }}
                        />
                      ) : (
                        `${g.weightage}%`
                      )}
                      {!g.isSubmitted && '%'}
                    </span>
                    <span><strong>Target:</strong> {g.target} {g.uom}</span>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <p className="text-sm text-muted mb-1">Status</p>
                  <span className={`badge badge-${g.status === 'Completed' ? 'success' : g.status === 'On Track' ? 'warning' : 'danger'}`}>
                    {g.status}
                  </span>
                  
                  {cycle.phase.includes('Check-in') && g.isApproved && updateActualsId !== g.id && (
                    <div className="mt-4">
                      <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => setUpdateActualsId(g.id)}>
                        Update Actuals
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {updateActualsId === g.id && (
                <UpdateActualsForm 
                  goal={g} 
                  cyclePhase={cycle.phase}
                  onSave={handleSaveActuals} 
                  onCancel={() => setUpdateActualsId(null)} 
                />
              )}
            </React.Fragment>
          ))}
          {goals.length === 0 && (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <p className="text-muted">No goals created yet. Start by creating your first goal.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GoalForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '', description: '', thrustArea: 'Financial', uom: 'Numeric', target: '', weightage: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(formData.weightage < 10) {
      alert("Minimum weightage per goal is 10%.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h2 className="mb-4">Create New Goal</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid-cols-2">
          <div className="form-group">
            <label className="form-label">Goal Title</label>
            <input className="form-control" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Thrust Area</label>
            <select className="form-control" value={formData.thrustArea} onChange={e => setFormData({...formData, thrustArea: e.target.value})}>
              <option>Financial</option>
              <option>Customer</option>
              <option>Internal Process</option>
              <option>Learning & Growth</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        </div>

        <div className="grid-cols-3">
          <div className="form-group">
            <label className="form-label">Unit of Measurement (UoM)</label>
            <select className="form-control" value={formData.uom} onChange={e => setFormData({...formData, uom: e.target.value})}>
              <option>Numeric</option>
              <option>%</option>
              <option>Timeline</option>
              <option>Zero</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Target</label>
            <input type="text" className="form-control" required value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Weightage (%)</label>
            <input type="number" className="form-control" required min="10" max="100" value={formData.weightage} onChange={e => setFormData({...formData, weightage: e.target.value})} />
            <small className="text-muted">Min 10%</small>
          </div>
        </div>

        <div className="flex-gap mt-4" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-primary">Save Draft</button>
        </div>
      </form>
    </div>
  );
}

function UpdateActualsForm({ goal, cyclePhase, onSave, onCancel }) {
  const [actual, setActual] = useState('');
  const [status, setStatus] = useState(goal.status);

  const cycleKey = cyclePhase.split(' ')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(goal.id, actual, status);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '0.5rem', borderLeft: '4px solid var(--primary)' }}>
      <h3 className="mb-4 text-sm font-semibold">Update Progress - {cycleKey}</h3>
      <form onSubmit={handleSubmit} className="flex-gap" style={{ alignItems: 'flex-end' }}>
        <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
          <label className="form-label text-sm">Actual Achievement</label>
          <input type="text" className="form-control" required value={actual} onChange={e => setActual(e.target.value)} placeholder={`Target: ${goal.target}`} />
        </div>
        <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
          <label className="form-label text-sm">Status</label>
          <select className="form-control" value={status} onChange={e => setStatus(e.target.value)}>
            <option>Not Started</option>
            <option>On Track</option>
            <option>Completed</option>
          </select>
        </div>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary">Save Actuals</button>
      </form>
    </div>
  );
}
