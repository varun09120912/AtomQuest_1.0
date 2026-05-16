import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../store/AppContext';
import { Target, CheckSquare, Users, BarChart2, LogOut, Settings, ShieldAlert, LayoutDashboard } from 'lucide-react';

export default function Layout() {
  const { currentUser, logout, cycles } = useContext(AppContext);
  const navigate = useNavigate();
  const activeCycle = cycles.find(c => c.isActive);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${isActive ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - Premium Dark Floating */}
      <div className="w-72 bg-dark text-white flex flex-col m-4 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Subtle decorative background pulse */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        
        <div className="p-8 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-primary-600 p-2 rounded-xl shadow-lg">
              <LayoutDashboard size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">AtomQuest</h2>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto relative z-10">
          <div className="px-4 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">Employee</div>
          <NavLink to="/dashboard/my-goals" className={navItemClass}>
            <Target size={20} /> My Goals
          </NavLink>
          <NavLink to="/dashboard/checkin" className={navItemClass}>
            <CheckSquare size={20} /> Check-in
          </NavLink>

          {(currentUser?.role === 'manager' || currentUser?.role === 'admin') && (
            <>
              <div className="mt-8 mb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Manager Tools</div>
              <NavLink to="/dashboard/team" className={navItemClass}>
                <Users size={20} /> Team Overview
              </NavLink>
              <NavLink to="/dashboard/approvals" className={navItemClass}>
                <CheckSquare size={20} /> Approvals
              </NavLink>
              <NavLink to="/dashboard/shared-goals" className={navItemClass}>
                <Target size={20} /> Push KPIs
              </NavLink>
            </>
          )}

          {currentUser?.role === 'admin' && (
            <>
              <div className="mt-8 mb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Admin Console</div>
              <NavLink to="/dashboard/analytics" className={navItemClass}>
                <BarChart2 size={20} /> Analytics
              </NavLink>
              <NavLink to="/dashboard/cycle-config" className={navItemClass}>
                <Settings size={20} /> Configuration
              </NavLink>
              <NavLink to="/dashboard/escalations" className={navItemClass}>
                <ShieldAlert size={20} /> Escalations
              </NavLink>
            </>
          )}
        </nav>
        
        {/* User Profile Area in Sidebar */}
        <div className="p-4 m-4 bg-slate-800/50 rounded-2xl border border-slate-700 backdrop-blur-sm flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-inner">
              {currentUser?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">{currentUser?.name}</p>
              <p className="text-xs text-slate-400 capitalize mt-0.5">{currentUser?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors p-2 bg-slate-700/50 hover:bg-slate-600 rounded-xl">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Sleek Topbar */}
        <header className="h-24 flex items-center justify-between px-10 shrink-0">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Welcome back, {currentUser?.name.split(' ')[0]} 👋</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Here is what's happening with your goals today.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-white border border-slate-200 text-slate-700 text-sm font-bold px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              {activeCycle ? `${activeCycle.name} - ${activeCycle.phase}` : 'No Active Cycle'}
            </span>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto px-10 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
