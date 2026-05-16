import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Target, LayoutDashboard, CheckSquare, BarChart } from 'lucide-react';
import { getActiveCycle } from '../utils/mockData';

export default function Layout({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const cycle = getActiveCycle();

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '0.5rem', borderRadius: '8px' }}>
            <Target size={24} color="white" />
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>AtomQuest</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <button 
            className="btn-secondary" 
            style={{ 
              justifyContent: 'flex-start', 
              border: 'none', 
              background: location.pathname === '/' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: location.pathname === '/' ? 'var(--primary)' : 'var(--text-main)'
            }}
            onClick={() => navigate('/')}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          
          <div className="glass-panel mt-8" style={{ padding: '1rem', border: '1px solid var(--primary)' }}>
            <p className="text-sm text-muted mb-2">Active Cycle</p>
            <p className="font-bold text-gradient">{cycle.phase}</p>
            <p className="text-sm">{cycle.year}</p>
          </div>
        </nav>

        <div className="mt-auto" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--secondary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-sm">{currentUser.name}</p>
              <p className="text-sm text-muted" style={{ textTransform: 'capitalize' }}>{currentUser.role}</p>
            </div>
          </div>
          <button className="btn-danger" style={{ width: '100%', justifyContent: 'center' }} onClick={onLogout}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
