import React, { useContext, useState } from 'react';
import { AppContext } from '../../store/AppContext';
import { CheckCircle } from 'lucide-react';

export default function CheckIn() {
  const { currentUser, goals, checkIns, setCheckIns, cycles } = useContext(AppContext);
  const activeCycle = cycles.find(c => c.isActive) || cycles[0];
  
  const myGoals = goals.filter(g => g.employeeId === currentUser.id && g.status === 'approved');
  
  const [actuals, setActuals] = useState({});

  const calculateScore = (actual, target, uom) => {
    if (actual === '' || actual === null) return 0;
    const a = Number(actual);
    const t = Number(target);
    if (uom.includes('_min')) return Math.min((a / t) * 100, 100).toFixed(0);
    if (uom.includes('_max')) return Math.min((t / a) * 100, 100).toFixed(0);
    if (uom === 'timeline') return a <= t ? 100 : 0;
    if (uom === 'zero') return a === 0 ? 100 : 0;
    return 0;
  };

  const handleSave = (goalId) => {
    const goal = myGoals.find(g => g.id === goalId);
    const actual = actuals[goalId];
    if (actual === undefined || actual === '') return alert('Enter actual value');
    
    const score = calculateScore(actual, goal.target, goal.uom);
    
    const newCheckIn = {
      id: 'chk' + Date.now(),
      goalId,
      employeeId: currentUser.id,
      quarter: activeCycle?.phase || 'Q1',
      year: activeCycle?.year,
      actual,
      status: Number(score) === 100 ? 'completed' : Number(score) > 0 ? 'on_track' : 'not_started',
      managerComment: '',
      submittedAt: Date.now(),
      score: Number(score)
    };

    const updated = [...checkIns.filter(c => !(c.goalId === goalId && c.quarter === activeCycle.phase)), newCheckIn];
    setCheckIns(updated);
    localStorage.setItem('atomquest_checkIns', JSON.stringify(updated));
    alert('Check-in saved successfully!');
  };

  if (activeCycle?.phase === 'Phase 1 - Goal Setting') {
    return <div className="p-8 text-center text-slate-500">Check-ins are locked during the Goal Setting phase.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Quarterly Check-In</h1>
        <p className="text-slate-500 mt-1">Log your actual achievements for {activeCycle?.phase}</p>
      </div>

      <div className="space-y-6">
        {myGoals.map(g => {
          const existing = checkIns.find(c => c.goalId === g.id && c.quarter === activeCycle?.phase);
          const currentActual = actuals[g.id] !== undefined ? actuals[g.id] : (existing ? existing.actual : '');
          const score = calculateScore(currentActual, g.target, g.uom);

          return (
            <div key={g.id} className="glass-panel border-l-4 border-l-primary">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{g.title}</h3>
                  <p className="text-sm text-slate-500">Target: {g.target} ({g.uom.replace('_', ' ')}) • Weightage: {g.weightage}%</p>
                </div>
                <div className="text-right">
                  <span className="block text-sm text-slate-500">Computed Score</span>
                  <span className={`text-2xl font-bold ${score == 100 ? 'text-green-600' : 'text-primary'}`}>{score}%</span>
                </div>
              </div>
              <div className="flex gap-4 items-end bg-slate-50 p-4 rounded-lg">
                <div className="flex-1">
                  <label className="form-label">Actual Achievement</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={currentActual} 
                    onChange={e => setActuals({...actuals, [g.id]: e.target.value})} 
                  />
                </div>
                <button onClick={() => handleSave(g.id)} className="btn-primary flex items-center gap-2 h-10">
                  <CheckCircle size={18} /> Save Check-In
                </button>
              </div>
            </div>
          );
        })}
        {myGoals.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-white border border-dashed border-slate-300 rounded-xl">
            No approved goals available for check-in.
          </div>
        )}
      </div>
    </div>
  );
}
