import React, { useContext, useState } from 'react';
import { AppContext } from '../../store/AppContext';
import { CheckSquare } from 'lucide-react';

export default function TeamCheckIns() {
  const { currentUser, users, checkIns, setCheckIns, goals } = useContext(AppContext);
  const myTeam = users.filter(u => u.managerId === currentUser.id);
  const teamIds = myTeam.map(u => u.id);
  const teamCheckIns = checkIns.filter(c => teamIds.includes(c.employeeId));
  
  const [comments, setComments] = useState({});

  const handleSaveComment = (checkInId) => {
    const comment = comments[checkInId];
    if (!comment) return;
    const updated = checkIns.map(c => c.id === checkInId ? { ...c, managerComment: comment, managerCommentAt: Date.now() } : c);
    setCheckIns(updated);
    localStorage.setItem('atomquest_checkIns', JSON.stringify(updated));
    alert('Comment saved!');
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Team Check-ins</h1>
        <p className="text-slate-500 mt-1 font-medium">Review Q1 actuals submitted by your team.</p>
      </div>

      <div className="space-y-8">
        {myTeam.map(emp => {
          const empCheckIns = teamCheckIns.filter(c => c.employeeId === emp.id);
          
          if (empCheckIns.length === 0) {
            return (
              <div key={emp.id} className="glass-panel p-6 flex justify-between items-center border-l-4 border-l-amber-400">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{emp.name}</h3>
                  <p className="text-amber-600 text-sm font-medium">Check-in not submitted yet.</p>
                </div>
                <button className="btn-secondary text-amber-700 border-amber-200 hover:bg-amber-50">Send Reminder</button>
              </div>
            );
          }

          return (
            <div key={emp.id} className="glass-panel p-0 overflow-hidden">
              <div className="bg-slate-50 p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-xl">{emp.name}</h3>
              </div>
              <div className="p-6 space-y-6">
                {empCheckIns.map(c => {
                  const goal = goals.find(g => g.id === c.goalId);
                  if (!goal) return null;
                  return (
                    <div key={c.id} className="border border-slate-200 rounded-2xl p-6">
                      <div className="flex justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-slate-800">{goal.title}</h4>
                          <p className="text-sm text-slate-500">Target: {goal.target} {goal.uom}</p>
                        </div>
                        <div className="text-right">
                          <span className="block text-xs text-slate-500">Score</span>
                          <span className={`text-2xl font-extrabold ${c.score == 100 ? 'text-emerald-500' : 'text-primary-600'}`}>{c.score}%</span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="form-label">Manager Comment</label>
                          <textarea 
                            className="form-control" 
                            rows="2" 
                            defaultValue={c.managerComment}
                            onChange={(e) => setComments({...comments, [c.id]: e.target.value})}
                          />
                        </div>
                        <div className="flex items-end">
                          <button onClick={() => handleSaveComment(c.id)} className="btn-primary">Save Comment</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
