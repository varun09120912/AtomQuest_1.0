import React, { useState, useEffect } from 'react';
import { getInitialGoals, saveGoals, mockUsers, getActiveCycle } from '../utils/mockData';
import { Users, CheckCircle, MessageSquare, AlertCircle, Edit2, Plus } from 'lucide-react';

export default function ManagerDashboard({ currentUser }) {
  const [teamGoals, setTeamGoals] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [editGoalId, setEditGoalId] = useState(null);
  const [editData, setEditData] = useState({});
  const [commentGoalId, setCommentGoalId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [showSharedForm, setShowSharedForm] = useState(false);

  const cycle = getActiveCycle();
  const cycleKey = cycle.phase.split(' ')[0];

  useEffect(() => {
    const allGoals = getInitialGoals();
    const members = mockUsers.filter(u => u.managerId === currentUser.id);
    const memberIds = members.map(m => m.id);
    
    setTeamMembers(members);
    setTeamGoals(allGoals.filter(g => memberIds.includes(g.employeeId) && g.isSubmitted));
  }, [currentUser.id]);

  const handleApprove = (goalId) => {
    const allGoals = getInitialGoals();
    const updated = allGoals.map(g => g.id === goalId ? { ...g, isApproved: true } : g);
    saveGoals(updated);
    setTeamGoals(updated.filter(g => teamMembers.map(m=>m.id).includes(g.employeeId) && g.isSubmitted));
  };

  const handleSaveEdit = (goalId) => {
    const allGoals = getInitialGoals();
    const updated = allGoals.map(g => g.id === goalId ? { ...g, target: editData.target, weightage: editData.weightage } : g);
    saveGoals(updated);
    setTeamGoals(updated.filter(g => teamMembers.map(m=>m.id).includes(g.employeeId) && g.isSubmitted));
    setEditGoalId(null);
  };

  const handleSaveComment = (goalId) => {
    const allGoals = getInitialGoals();
    const updated = allGoals.map(g => {
      if(g.id === goalId) {
        return {
          ...g,
          managerComments: { ...g.managerComments, [cycleKey]: commentText }
        };
      }
      return g;
    });
    saveGoals(updated);
    setTeamGoals(updated.filter(g => teamMembers.map(m=>m.id).includes(g.employeeId) && g.isSubmitted));
    setCommentGoalId(null);
    setCommentText('');
  };

  const handlePushKPI = (kpiData) => {
    const allGoals = getInitialGoals();
    teamMembers.forEach(member => {
      allGoals.push({
        id: 'g' + Date.now() + Math.random(),
        employeeId: member.id,
        title: kpiData.title,
        description: kpiData.description,
        thrustArea: kpiData.thrustArea,
        uom: kpiData.uom,
        target: kpiData.target,
        weightage: 10, // Default 10%, employee adjusts later
        status: 'Not Started',
        isSubmitted: true,
        isApproved: true, // Auto approved because manager created it
        isShared: true,
        progressActuals: { Q1: null, Q2: null, Q3: null, Q4: null },
        managerComments: {}
      });
    });
    saveGoals(allGoals);
    setTeamGoals(allGoals.filter(g => teamMembers.map(m=>m.id).includes(g.employeeId) && g.isSubmitted));
    setShowSharedForm(false);
    alert('Shared KPI pushed to all team members successfully!');
  };

  const pendingApprovals = teamGoals.filter(g => !g.isApproved);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manager Dashboard</h1>
          <p className="text-muted mt-1">Approve goals and conduct quarterly check-ins.</p>
        </div>
      </div>

      <div className="grid-cols-3 mb-8">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex-between mb-4">
            <h3 className="text-muted text-sm">Team Members</h3>
            <Users size={20} color="var(--primary)" />
          </div>
          <p className="font-bold text-lg">{teamMembers.length}</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex-between mb-4">
            <h3 className="text-muted text-sm">Pending Approvals</h3>
            <AlertCircle size={20} color="var(--warning)" />
          </div>
          <p className="font-bold text-lg text-warning">{pendingApprovals.length}</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex-between mb-4">
            <h3 className="text-muted text-sm">Check-ins Completed</h3>
            <CheckCircle size={20} color="var(--success)" />
          </div>
          <p className="font-bold text-lg">1 / {teamMembers.length}</p>
        </div>
      </div>

      {showSharedForm && (
        <SharedKPIForm onSave={handlePushKPI} onCancel={() => setShowSharedForm(false)} />
      )}

      {!showSharedForm && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div className="flex-between mb-6">
            <h2>Team Goals Review</h2>
            {cycle.phase === 'Phase 1 - Goal Setting' && (
              <button className="btn-secondary" onClick={() => setShowSharedForm(true)}>
                <Plus size={16} /> Push Shared KPI
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {teamGoals.map(g => {
              const emp = teamMembers.find(m => m.id === g.employeeId);
              const isEditing = editGoalId === g.id;
              const isCommenting = commentGoalId === g.id;

              return (
                <div key={g.id} style={{ border: '1px solid var(--border-light)', borderRadius: '8px', padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
                  <div className="flex-between mb-2">
                    <div className="flex-gap" style={{ alignItems: 'center' }}>
                      <h3 className="font-semibold">{g.title}</h3>
                      <span className="badge badge-info">{emp?.name}</span>
                      {g.isApproved ? <span className="badge badge-success">Approved</span> : <span className="badge badge-warning">Pending</span>}
                    </div>
                    {!g.isApproved && (
                      <div className="flex-gap">
                        {!isEditing && (
                          <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }} onClick={() => { setEditGoalId(g.id); setEditData({target: g.target, weightage: g.weightage}); }}>
                            <Edit2 size={16} /> Edit
                          </button>
                        )}
                        <button className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }} onClick={() => handleApprove(g.id)}>
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted mb-4">{g.description}</p>
                  
                  {!isEditing ? (
                    <div className="grid-cols-4 text-sm mb-4">
                      <div><strong>Weightage:</strong> {g.weightage}%</div>
                      <div><strong>Target:</strong> {g.target} {g.uom}</div>
                      <div><strong>Actual ({cycleKey}):</strong> {g.progressActuals?.[cycleKey] !== null && g.progressActuals?.[cycleKey] !== undefined ? g.progressActuals[cycleKey] : '-'}</div>
                      <div><strong>Status:</strong> {g.status}</div>
                    </div>
                  ) : (
                    <div className="flex-gap mb-4" style={{ alignItems: 'flex-end' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label text-sm">Target</label>
                        <input type="text" className="form-control" value={editData.target} onChange={e => setEditData({...editData, target: e.target.value})} />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label text-sm">Weightage (%)</label>
                        <input type="number" className="form-control" value={editData.weightage} onChange={e => setEditData({...editData, weightage: e.target.value})} />
                      </div>
                      <button className="btn-primary" onClick={() => handleSaveEdit(g.id)}>Save Edit</button>
                      <button className="btn-secondary" onClick={() => setEditGoalId(null)}>Cancel</button>
                    </div>
                  )}

                  {cycle.phase.includes('Check-in') && g.isApproved && (
                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '1rem' }}>
                      {!isCommenting ? (
                        <div className="flex-between">
                          <div className="flex-gap" style={{ alignItems: 'center', color: 'var(--text-muted)' }}>
                            <MessageSquare size={16} />
                            <span className="text-sm">Manager Comment ({cycleKey}): {g.managerComments?.[cycleKey] || 'None'}</span>
                          </div>
                          <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }} onClick={() => { setCommentGoalId(g.id); setCommentText(g.managerComments?.[cycleKey] || ''); }}>
                            Add Comment
                          </button>
                        </div>
                      ) : (
                        <div className="flex-gap">
                          <input className="form-control" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Enter feedback..." style={{ flex: 1 }} />
                          <button className="btn-primary" onClick={() => handleSaveComment(g.id)}>Save Comment</button>
                          <button className="btn-secondary" onClick={() => setCommentGoalId(null)}>Cancel</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            {teamGoals.length === 0 && (
              <p className="text-muted text-center py-4">No team goals submitted yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SharedKPIForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '', description: '', thrustArea: 'Financial', uom: 'Numeric', target: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="glass-panel mb-8" style={{ padding: '2rem', border: '1px solid var(--primary)' }}>
      <h2 className="mb-4 text-gradient">Push Shared Departmental KPI</h2>
      <p className="text-muted mb-6">This goal will be automatically added to all your team members' goal sheets. They will only be able to adjust the weightage.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid-cols-2">
          <div className="form-group">
            <label className="form-label">Goal Title</label>
            <input className="form-control" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Reduce Dept Costs by 10%" />
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
          <textarea className="form-control" rows="2" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        </div>

        <div className="grid-cols-2">
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
            <label className="form-label">Target Value</label>
            <input type="text" className="form-control" required value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})} />
          </div>
        </div>

        <div className="flex-gap mt-4" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-primary">Push to Team</button>
        </div>
      </form>
    </div>
  );
}
