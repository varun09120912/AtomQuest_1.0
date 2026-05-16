import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../store/AppContext';
import { Target, CheckSquare, Users, BarChart2, LogOut, Settings, ShieldAlert } from 'lucide-react';

export default function Layout() {
  const { currentUser, logout, cycles } = useContext(AppContext);
  const navigate = useNavigate();
  const activeCycle = cycles.find(c => c.isActive);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-slate-800'}`;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-dark text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white tracking-tight">AtomQuest</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink to="/dashboard/my-goals" className={navItemClass}>
            <Target size={20} /> My Goals
          </NavLink>
          <NavLink to="/dashboard/checkin" className={navItemClass}>
            <CheckSquare size={20} /> Quarterly Check-in
          </NavLink>

          {(currentUser?.role === 'manager' || currentUser?.role === 'admin') && (
            <>
              <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase">Manager Tools</div>
              <NavLink to="/dashboard/team" className={navItemClass}>
                <Users size={20} /> Team Dashboard
              </NavLink>
              <NavLink to="/dashboard/approvals" className={navItemClass}>
                <CheckSquare size={20} /> Approvals
              </NavLink>
              <NavLink to="/dashboard/shared-goals" className={navItemClass}>
                <Target size={20} /> Shared Goals
              </NavLink>
            </>
          )}

          {currentUser?.role === 'admin' && (
            <>
              <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase">Admin Console</div>
              <NavLink to="/dashboard/analytics" className={navItemClass}>
                <BarChart2 size={20} /> Analytics
              </NavLink>
              <NavLink to="/dashboard/cycle-config" className={navItemClass}>
                <Settings size={20} /> Cycle Config
              </NavLink>
              <NavLink to="/dashboard/escalations" className={navItemClass}>
                <ShieldAlert size={20} /> Escalation Log
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
              {activeCycle ? `${activeCycle.name} - ${activeCycle.phase}` : 'No Active Cycle'}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{currentUser?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{currentUser?.role}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
