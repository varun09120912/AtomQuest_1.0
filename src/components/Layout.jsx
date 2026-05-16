import React, { useContext, useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../store/AppContext';
import { Target, CheckSquare, Users, BarChart2, LogOut, Settings, ShieldAlert, LayoutDashboard, AlertTriangle, Bell, X } from 'lucide-react';
import AtomBot from './AtomBot';

export default function Layout() {
  const { currentUser, logout, cycles, notifications, saveNotifications } = useContext(AppContext);
  const navigate = useNavigate();
  const activeCycle = cycles.find(c => c.isActive);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Popup reminder (manager sends)
  const activeReminder = notifications?.find(n => n.userId === currentUser?.id && n.type === 'reminder_popup' && !n.read);

  // All unread notifications for bell badge
  const myUnread = notifications?.filter(n => n.userId === currentUser?.id && !n.read && n.type !== 'reminder_popup') || [];
  const myNotifs = notifications?.filter(n => n.userId === currentUser?.id && n.type !== 'reminder_popup').slice().reverse().slice(0, 5) || [];

  const handleLogout = () => { logout(); navigate('/login'); };

  const dismissReminder = () => {
    if (!activeReminder) return;
    const updated = notifications.map(n => n.id === activeReminder.id ? { ...n, read: true } : n);
    saveNotifications(updated);
  };

  const markAllRead = () => {
    const updated = notifications.map(n => n.userId === currentUser?.id ? { ...n, read: true } : n);
    saveNotifications(updated);
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${isActive ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`;

  const notifIcon = (type) => {
    if (type === 'goal_assigned') return '📋';
    if (type === 'goal_approved') return '✅';
    if (type === 'goal_returned') return '↩️';
    if (type === 'checkin_reminder') return '⏰';
    return '🔔';
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">

      {/* Reminder Popup Modal */}
      {activeReminder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 mb-6">
              <AlertTriangle size={32} className="text-amber-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-center text-slate-900 mb-2">{activeReminder.title}</h3>
            <p className="text-center text-slate-600 font-medium mb-8 leading-relaxed">{activeReminder.message}</p>
            <button onClick={dismissReminder} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md">
              I Understand, Go to Check-ins
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-72 bg-dark text-white flex flex-col m-4 rounded-3xl shadow-2xl relative overflow-hidden">
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
          <NavLink to="/dashboard/my-goals" className={navItemClass}><Target size={20} /> My Goals</NavLink>
          <NavLink to="/dashboard/checkin" className={navItemClass}><CheckSquare size={20} /> Check-in</NavLink>
          <NavLink to="/dashboard/notifications" className={navItemClass}><Target size={20} /> Notifications</NavLink>

          {(currentUser?.role === 'manager' || currentUser?.role === 'admin') && (<>
            <div className="mt-8 mb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Manager Tools</div>
            <NavLink to="/dashboard/team" className={navItemClass}><Users size={20} /> Team Overview</NavLink>
            <NavLink to="/dashboard/approvals" className={navItemClass}><CheckSquare size={20} /> Approvals</NavLink>
            <NavLink to="/dashboard/shared-goals" className={navItemClass}><Target size={20} /> Push KPIs</NavLink>
            <NavLink to="/dashboard/team-checkins" className={navItemClass}><CheckSquare size={20} /> Team Check-ins</NavLink>
          </>)}

          {currentUser?.role === 'admin' && (<>
            <div className="mt-8 mb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Admin Console</div>
            <NavLink to="/dashboard/analytics" className={navItemClass}><BarChart2 size={20} /> Analytics</NavLink>
            <NavLink to="/dashboard/completion" className={navItemClass}><Target size={20} /> Completion Dash</NavLink>
            <NavLink to="/dashboard/cycle-config" className={navItemClass}><Settings size={20} /> Configuration</NavLink>
            <NavLink to="/dashboard/escalations" className={navItemClass}><ShieldAlert size={20} /> Escalations</NavLink>
            <NavLink to="/dashboard/audit" className={navItemClass}><CheckSquare size={20} /> Audit Trail</NavLink>
            <NavLink to="/dashboard/users" className={navItemClass}><Users size={20} /> User Management</NavLink>
          </>)}
        </nav>

        <div className="p-4 m-4 bg-slate-800/50 rounded-2xl border border-slate-700 flex items-center justify-between relative z-10">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 flex items-center justify-between px-10 shrink-0">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Welcome back, {currentUser?.name.split(' ')[0]} 👋</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Here is what's happening with your goals today.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-white border border-slate-200 text-slate-700 text-sm font-bold px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              {activeCycle ? `${activeCycle.name}` : 'No Active Cycle'}
            </span>

            {/* 🔔 Notification Bell with Red Dot */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative w-11 h-11 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:border-primary-300"
              >
                <Bell size={20} className="text-slate-600" />
                {myUnread.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-extrabold rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {myUnread.length > 9 ? '9+' : myUnread.length}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {showNotifDropdown && (
                <div className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-40 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h3 className="font-extrabold text-slate-800">Notifications</h3>
                    <div className="flex items-center gap-2">
                      {myUnread.length > 0 && (
                        <button onClick={markAllRead} className="text-xs text-primary-600 font-bold hover:underline">Mark all read</button>
                      )}
                      <button onClick={() => setShowNotifDropdown(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {myNotifs.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-sm">No notifications yet</div>
                    ) : (
                      myNotifs.map(n => (
                        <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-primary-50' : ''}`}>
                          <div className="flex gap-3 items-start">
                            <span className="text-xl mt-0.5">{notifIcon(n.type)}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-bold truncate ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</p>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                              <p className="text-xs text-slate-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                            </div>
                            {!n.read && <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0"></div>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-slate-100 text-center">
                    <button onClick={() => { navigate('/dashboard/notifications'); setShowNotifDropdown(false); }} className="text-xs text-primary-600 font-bold hover:underline">
                      View all notifications →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-10 pb-10">
          <Outlet />
        </main>
      </div>
      {/* AtomBot Floating Assistant */}
      <AtomBot />
    </div>
  );
}
