import React, { useContext } from 'react';
import { AppContext } from '../../store/AppContext';
import { Bell, Check } from 'lucide-react';

export default function Notifications() {
  const { currentUser, notifications, setNotifications } = useContext(AppContext);
  const myNotifications = notifications.filter(n => n.userId === currentUser.id);

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('atomquest_notifications', JSON.stringify(updated));
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8 flex items-center gap-3">
        <Bell size={32} className="text-primary-600" />
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1 font-medium">Updates and alerts regarding your goals.</p>
        </div>
      </div>

      <div className="space-y-4">
        {myNotifications.length === 0 ? (
          <div className="glass-panel text-center py-12 text-slate-500">
            You have no notifications.
          </div>
        ) : (
          myNotifications.map(n => (
            <div key={n.id} className={`glass-panel p-6 flex justify-between items-center transition-all ${n.read ? 'opacity-70' : 'border-l-4 border-l-primary-600 shadow-md'}`}>
              <div>
                <h3 className={`text-lg ${n.read ? 'font-semibold text-slate-700' : 'font-bold text-slate-900'}`}>{n.title}</h3>
                <p className="text-slate-600 mt-1">{n.message}</p>
                <p className="text-xs text-slate-400 mt-2">{new Date(n.timestamp).toLocaleString()}</p>
              </div>
              {!n.read && (
                <button onClick={() => markAsRead(n.id)} className="btn-secondary flex items-center gap-2">
                  <Check size={16} /> Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
