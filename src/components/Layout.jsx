import React, { useContext, useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../store/AppContext';
import { Target, CheckSquare, Users, BarChart2, LogOut, Settings, ShieldAlert, LayoutDashboard, AlertTriangle } from 'lucide-react';

export default function Layout() {
  const { currentUser, logout, cycles, notifications, setNotifications } = useContext(AppContext);
  const navigate = useNavigate();
  const activeCycle = cycles.find(c => c.isActive);

  // Find unread popup reminders
  const activeReminder = notifications?.find(n => n.userId === currentUser?.id && n.type === 'reminder_popup' && !n.read);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dismissReminder = () => {
    if (!activeReminder) return;
    const updated = notifications.map(n => n.id === activeReminder.id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('atomquest_notifications', JSON.stringify(updated));
  };

  const navItemClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${isActive ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`;

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      
      {/* Reminder Popup Modal */}
      {activeReminder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform scale-100 animate-in fade-in zoom-in duration-200">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 mb-6">
              <AlertTriangle size={32} className="text-amber-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-center text-slate-900 mb-2">{activeReminder.title}</h3>
            <p className="text-center text-slate-600 font-medium mb-8 leading-relaxed">
              {activeReminder.message}
            </p>
            <button 
              onClick={dismissReminder}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              I Understand, Go to Check-ins
            </button>
          </div>
        </div>
      )}
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
          <NavLink to="/dashboard/notifications" className={navItemClass}>
            <Target size={20} /> Notifications
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
              <NavLink to="/dashboard/team-checkins" className={navItemClass}>
                <CheckSquare size={20} /> Team Check-ins
              </NavLink>
            </>
          )}

          {currentUser?.role === 'admin' && (
            <>
              <div className="mt-8 mb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Admin Console</div>
              <NavLink to="/dashboard/analytics" className={navItemClass}>
                <BarChart2 size={20} /> Analytics
              </NavLink>
              <NavLink to="/dashboard/completion" className={navItemClass}>
                <Target size={20} /> Completion Dash
              </NavLink>
              <NavLink to="/dashboard/cycle-config" className={navItemClass}>
                <Settings size={20} /> Configuration
              </NavLink>
              <NavLink to="/dashboard/escalations" className={navItemClass}>
                <ShieldAlert size={20} /> Escalations
              </NavLink>
              <NavLink to="/dashboard/audit" className={navItemClass}>
                <CheckSquare size={20} /> Audit Trail
              </NavLink>
              <NavLink to="/dashboard/users" className={navItemClass}>
                <Users size={20} /> User Management
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
