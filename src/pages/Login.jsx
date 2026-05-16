import React, { useState } from 'react';
import { mockUsers } from '../utils/mockData';
import { Target, User, Shield, Briefcase } from 'lucide-react';

export default function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('employee');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = mockUsers.find(u => u.role === selectedRole);
    if (user) {
      onLogin(user);
    }
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '1rem', borderRadius: '50%' }}>
            <Target size={32} color="white" />
          </div>
        </div>
        
        <h1 className="mb-2">AtomQuest</h1>
        <p className="text-muted mb-8">Goal Setting & Tracking Portal</p>

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">Select Role to Demo</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              
              <button 
                type="button" 
                onClick={() => setSelectedRole('employee')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                  borderRadius: '8px', border: `1px solid ${selectedRole === 'employee' ? 'var(--primary)' : 'var(--border-light)'}`,
                  background: selectedRole === 'employee' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-main)'
                }}
              >
                <User size={20} color={selectedRole === 'employee' ? 'var(--primary)' : 'var(--text-muted)'} />
                <span className="font-semibold">Employee</span>
              </button>

              <button 
                type="button" 
                onClick={() => setSelectedRole('manager')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                  borderRadius: '8px', border: `1px solid ${selectedRole === 'manager' ? 'var(--primary)' : 'var(--border-light)'}`,
                  background: selectedRole === 'manager' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-main)'
                }}
              >
                <Briefcase size={20} color={selectedRole === 'manager' ? 'var(--primary)' : 'var(--text-muted)'} />
                <span className="font-semibold">Manager (L1)</span>
              </button>

              <button 
                type="button" 
                onClick={() => setSelectedRole('admin')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                  borderRadius: '8px', border: `1px solid ${selectedRole === 'admin' ? 'var(--primary)' : 'var(--border-light)'}`,
                  background: selectedRole === 'admin' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-main)'
                }}
              >
                <Shield size={20} color={selectedRole === 'admin' ? 'var(--primary)' : 'var(--text-muted)'} />
                <span className="font-semibold">Admin / HR</span>
              </button>

            </div>
          </div>

          <button type="submit" className="btn-primary mt-4" style={{ width: '100%' }}>
            Sign In to Demo
          </button>
        </form>
      </div>
    </div>
  );
}
