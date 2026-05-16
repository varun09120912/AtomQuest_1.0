import React, { useContext, useState } from 'react';
import { AppContext } from '../../store/AppContext';
import { Target } from 'lucide-react';

export default function SharedGoals() {
  const { currentUser, users, goals, setGoals, cycles } = useContext(AppContext);
  const activeCycle = cycles.find(c => c.isActive) || cycles[0];
  const myTeam = users.filter(u => u.managerId === currentUser.id);

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', thrustArea: 'Financial', uom: 'numeric_max', target: '' });

  const toggleEmployee = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter(e => e !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const handlePush = (e) => {
    e.preventDefault();
    if (selectedEmployees.length === 0) return alert('Select at least one employee');

    const newGoals = selectedEmployees.map(empId => ({
      ...newGoal,
      id: 'g' + Date.now() + Math.random(),
      employeeId: empId,
      cycleYear: activeCycle?.year,
      weightage: 10, // default min, they must adjust
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
    setNewGoal({ title: '', description: '', thrustArea: 'Financial', uom: 'numeric_max', target: '' });
    setSelectedEmployees([]);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Push Shared Goal</h1>
        <p className="text-slate-500 mt-1">Create a departmental KPI and instantly add it to your team's goal sheets.</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <form onSubmit={handlePush} className="glass-panel border-2 border-primary">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Target size={20}/> Goal Details</h2>
          <div className="mb-4">
            <label className="form-label">Goal Title</label>
            <input required className="form-control" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="form-label">Thrust Area</label>
            <select className="form-control" value={newGoal.thrustArea} onChange={e => setNewGoal({...newGoal, thrustArea: e.target.value})}>
              <option>Financial</option>
              <option>Customer</option>
              <option>Internal Process</option>
              <option>Learning & Growth</option>
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
          <button type="submit" className="btn-primary w-full">Push Goal</button>
        </form>

        <div className="glass-panel">
          <h2 className="text-lg font-bold mb-4">Select Recipients</h2>
          <div className="space-y-3">
            {myTeam.map(emp => (
              <label key={emp.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-primary" 
                  checked={selectedEmployees.includes(emp.id)}
                  onChange={() => toggleEmployee(emp.id)}
                />
                <div>
                  <p className="font-bold text-slate-800">{emp.name}</p>
                  <p className="text-xs text-slate-500">{emp.dept}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
