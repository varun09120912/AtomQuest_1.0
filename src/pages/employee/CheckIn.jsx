import React, { useContext, useState } from 'react';
import { AppContext } from '../../store/AppContext';
import { CheckCircle, Clock, AlertCircle, Lock } from 'lucide-react';

export default function CheckIn() {
  const { currentUser, goals, checkIns, saveCheckIns, cycles, notifications, setNotifications } = useContext(AppContext);
  const activeCycle = cycles.find(c => c.isActive) || cycles[0];

  const myGoals = goals.filter(g => g.employeeId === currentUser.id && g.status === 'approved');
  const [actuals, setActuals] = useState({});

  const calculateScore = (actual, target, uom) => {
    if (actual === '' || actual === null || actual === undefined) return 0;
    const a = Number(actual);
    const t = Number(target);
    if (isNaN(a) || isNaN(t) || t === 0) return 0;
    // Lower is better: full score if actual <= target, partial if above target
    if (uom === 'numeric_min' || uom === 'percent_min') {
      if (a <= t) return 100;
      return Math.max(0, Math.round((t / a) * 100));
    }
    // Higher is better
    if (uom === 'numeric_max' || uom === 'percent_max') return Math.min(Math.round((a / t) * 100), 100);
    if (uom === 'timeline') return new Date(actual) <= new Date(target) ? 100 : 0;
    if (uom === 'zero') return a === 0 ? 100 : 0;
    return 0;
  };

  const handleSave = (goalId, markComplete = false) => {
    const goal = myGoals.find(g => g.id === goalId);
    const actual = actuals[goalId];
    if (actual === undefined || actual === '') return alert('Please enter your actual achievement first.');

    const score = Number(calculateScore(actual, goal.target, goal.uom));
    const status = markComplete ? 'completed' : score === 100 ? 'completed' : score > 0 ? 'on_track' : 'not_started';

    const newCheckIn = {
      id: 'chk' + Date.now(),
      goalId,
      employeeId: currentUser.id,
      quarter: activeCycle?.phase || 'Q1',
      year: activeCycle?.year,
      actual,
      status,
      managerComment: '',
      submittedAt: Date.now(),
      score
    };

    const updatedCI = [...checkIns.filter(c => !(c.goalId === goalId && c.quarter === activeCycle?.phase)), newCheckIn];
    saveCheckIns(updatedCI);

    // Notify manager that check-in was submitted
    const mgr = currentUser.managerId;
    if (mgr && notifications) {
      const notif = {
        id: 'n' + Date.now(),
        userId: mgr,
        title: 'Check-in Update Received',
        message: `${currentUser.name} has ${markComplete ? 'marked as COMPLETE' : 'updated actuals for'} goal: "${goal.title}". Score: ${score}%.`,
        type: 'checkin_update',
        timestamp: Date.now(),
        read: false
      };
      const updatedN = [...(notifications || []), notif];
      setNotifications(updatedN);
      localStorage.setItem('atomquest_notifications', JSON.stringify(updatedN));
    }

    alert(markComplete ? `✅ Goal marked as COMPLETE! Score: ${score}%` : `Check-in saved! Current Score: ${score}%`);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quarterly Check-In</h1>
        <p className="text-slate-500 mt-1 font-medium">Log your actual achievements for {activeCycle?.name}</p>
      </div>

      <div className="space-y-6">
        {myGoals.map(g => {
          const existing = checkIns.find(c => c.goalId === g.id && c.quarter === activeCycle?.phase);
          const currentActual = actuals[g.id] !== undefined ? actuals[g.id] : (existing ? existing.actual : '');
          const score = Number(calculateScore(currentActual, g.target, g.uom));
          const isCompleted = existing?.status === 'completed';

          const scoreColor = score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-500' : 'text-rose-500';
          const borderColor = isCompleted ? 'border-l-emerald-500' : score >= 80 ? 'border-l-primary-500' : 'border-l-amber-400';

          return (
            <div key={g.id} className={`glass-panel border-l-4 ${borderColor} relative overflow-hidden`}>
              {isCompleted && (
                <div className="absolute top-4 right-4">
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle size={12} /> COMPLETED
                  </span>
                </div>
              )}

              <div className="flex justify-between mb-4 pr-28">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{g.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{g.thrustArea} • Target: <strong>{g.target}</strong> • Weightage: <strong>{g.weightage}%</strong></p>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Live Score</span>
                  <span className={`text-3xl font-extrabold ${scoreColor}`}>{score}%</span>
                  <div className="w-20 bg-slate-100 rounded-full h-1.5 mt-1 ml-auto">
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${score}%` }} />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {isCompleted ? (
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-500">Submitted Actual</p>
                      <p className="text-xl font-extrabold text-slate-800">{existing.actual}</p>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold">
                      <CheckCircle size={20} />
                      <span>Manager is reviewing this</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 items-end flex-wrap">
                    <div className="flex-1 min-w-40">
                      <label className="form-label">Your Actual Achievement</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={`Target is ${g.target}`}
                        value={currentActual}
                        onChange={e => setActuals({ ...actuals, [g.id]: e.target.value })}
                      />
                    </div>
                    <button
                      onClick={() => handleSave(g.id, false)}
                      className="btn-secondary flex items-center gap-2 h-10"
                    >
                      <Clock size={16} /> Save Progress
                    </button>
                    <button
                      onClick={() => handleSave(g.id, true)}
                      className="btn-primary flex items-center gap-2 h-10 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle size={16} /> Mark as Complete ✓
                    </button>
                  </div>
                )}
              </div>

              {existing && !isCompleted && (
                <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                  <Clock size={12} /> Last saved: {new Date(existing.submittedAt).toLocaleString()}
                </p>
              )}
            </div>
          );
        })}

        {myGoals.length === 0 && (
          <div className="text-center py-16 text-slate-500 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
            <AlertCircle size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="font-bold text-lg">No approved goals available for check-in.</p>
            <p className="text-sm mt-1">Ask your manager to approve your goals first.</p>
          </div>
        )}
      </div>
    </div>
  );
}
