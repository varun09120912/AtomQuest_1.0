import React, { useContext, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../store/AppContext';
import { Target, CheckSquare, Users, BarChart2, LogOut, ShieldAlert, LayoutDashboard, Bell, X, AlertTriangle } from 'lucide-react';
import AtomBot from './AtomBot';

export default function Layout() {
  const { currentUser, logout, cycles, notifications, saveNotifications } = useContext(AppContext);
  const navigate = useNavigate();
  const activeCycle = cycles.find(c => c.isActive);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const activeReminder = notifications?.find(n => n.userId === currentUser?.id && n.type === 'reminder_popup' && !n.read);
  const myUnread = notifications?.filter(n => n.userId === currentUser?.id && !n.read && n.type !== 'reminder_popup') || [];
  const myNotifs = notifications?.filter(n => n.userId === currentUser?.id && n.type !== 'reminder_popup').slice().reverse().slice(0, 5) || [];

  const handleLogout = () => { logout(); navigate('/login'); };

  const markAllRead = () => {
    const updated = notifications.map(n => n.userId === currentUser.id ? { ...n, read: true } : n);
    saveNotifications(updated);
  };

  const dismissReminder = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-dark text-slate-300 flex flex-col fixed inset-y-0 shadow-2xl z-20 overflow-y-auto custom-scrollbar">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Target className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter italic">ATOMQUEST</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Core Journey</p>
          
          <NavLink to="/dashboard/my-goals" className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'hover:bg-slate-800/50 hover:text-white'}`}>
            <Target size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-semibold">My Goals</span>
          </NavLink>

          <NavLink to="/dashboard/checkin" className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'hover:bg-slate-800/50 hover:text-white'}`}>
            <CheckSquare size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Check-ins</span>
          </NavLink>

          {(currentUser.role === 'manager' || currentUser.role === 'admin') && (
            <div className="pt-8 space-y-1">
              <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Management</p>
              <NavLink to="/dashboard/team" className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'hover:bg-slate-800/50 hover:text-white'}`}>
                <LayoutDashboard size={20} />
                <span className="font-semibold">Team View</span>
              </NavLink>
              <NavLink to="/dashboard/approvals" className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'hover:bg-slate-800/50 hover:text-white'}`}>
                <CheckSquare size={20} />
                <span className="font-semibold">Approvals</span>
              </NavLink>
              <NavLink to="/dashboard/shared-goals" className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'hover:bg-slate-800/50 hover:text-white'}`}>
                <Users size={20} />
                <span className="font-semibold">Shared Goals</span>
              </NavLink>
            </div>
          )}

          {currentUser.role === 'admin' && (
            <div className="pt-8 space-y-1">
              <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Administration</p>
              <NavLink to="/dashboard/analytics" className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'hover:bg-slate-800/50 hover:text-white'}`}>
                <BarChart2 size={20} />
                <span className="font-semibold">Analytics</span>
              </NavLink>
              <NavLink to="/dashboard/audit" className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'hover:bg-slate-800/50 hover:text-white'}`}>
                <ShieldAlert size={20} />
                <span className="font-semibold">Audit Trail</span>
              </NavLink>
            </div>
          )}
        </nav>

        <div className="p-4 mt-auto">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-red-500/10 hover:text-red-500 transition-all group">
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="font-bold uppercase text-xs tracking-wider">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-72 flex flex-col min-h-screen overflow-x-hidden">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-[2px] bg-slate-200"></div>
            <p className="text-slate-500 font-medium">Cycle: <span className="text-primary-700 font-bold">{activeCycle?.name || 'Loading...'}</span></p>
          </div>

          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all relative group"
              >
                <Bell size={22} className="group-hover:rotate-12 transition-transform" />
                {myUnread.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-extrabold rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {myUnread.length > 9 ? '9+' : myUnread.length}
                  </span>
                )}
              </button>
              
              {showNotifDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <p className="font-bold text-slate-800">Notifications</p>
                    <button onClick={markAllRead} className="text-xs font-bold text-primary-600 hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {myNotifs.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-sm italic">All caught up! No new alerts.</div>
                    ) : (
                      myNotifs.map(n => (
                        <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 ${!n.read ? 'bg-primary-50/30' : ''}`}>
                          <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!n.read ? 'bg-primary-500' : 'bg-slate-200'}`}></div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{n.title}</p>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                            <p className="text-[10px] text-slate-400 mt-2 font-medium">{new Date(n.timestamp).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 bg-slate-100/50 p-2 pr-6 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                {currentUser?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 leading-none">{currentUser?.name}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider">{currentUser?.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 flex-1">
          {activeReminder && (
             <div className="mb-8 bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl flex items-center justify-between animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-5">
                   <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
                      <AlertTriangle size={28} />
                   </div>
                   <div>
                      <h4 className="text-amber-900 font-bold text-lg">Deadline Reminder</h4>
                      <p className="text-amber-700 font-medium">{activeReminder.message}</p>
                   </div>
                </div>
                <button onClick={() => dismissReminder(activeReminder.id)} className="p-3 hover:bg-amber-100 rounded-2xl transition-colors text-amber-500">
                   <X size={24} />
                </button>
             </div>
          )}
          <Outlet />
        </main>
      </div>
      {/* AtomBot Floating Assistant */}
      <AtomBot />
    </div>
  );
}
