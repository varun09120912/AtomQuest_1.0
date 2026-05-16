import React, { useContext } from 'react';
import { AppContext } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (login(email, password)) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      }
    }, 600);
  };

  const quickFill = (role) => {
    if (role === 'admin') { setEmail('admin@atomberg.com'); setPassword('password123'); }
    if (role === 'manager') { setEmail('manager@atomberg.com'); setPassword('password123'); }
    if (role === 'employee') { setEmail('employee@atomberg.com'); setPassword('password123'); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0d1b4b 0%, #0a3d6e 40%, #00897b 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      {/* Animated background streaks */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(18)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 120 + 60}px`,
            background: 'linear-gradient(to bottom, rgba(0,230,180,0.6), transparent)',
            left: `${5 + i * 5.5}%`,
            top: `${Math.random() * 100}%`,
            transform: `rotate(${-30 + Math.random() * 10}deg)`,
            opacity: 0.3 + Math.random() * 0.4,
            animation: `streak ${2 + Math.random() * 3}s ease-in-out infinite alternate`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes streak {
          0% { opacity: 0.2; transform: rotate(-28deg) translateY(0px); }
          100% { opacity: 0.6; transform: rotate(-28deg) translateY(-20px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-card { animation: fadeUp 0.6s ease forwards; }
        .input-field {
          width: 100%; padding: 13px 16px 13px 44px;
          border: 1.5px solid #e2e8f0; border-radius: 12px;
          font-size: 14px; font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none; background: #f8fafc; color: #1e293b;
          transition: all 0.2s; box-sizing: border-box;
        }
        .input-field:focus { border-color: #00897b; background: white; box-shadow: 0 0 0 3px rgba(0,137,123,0.12); }
        .login-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #00bfa5, #00897b);
          border: none; border-radius: 12px; color: white;
          font-size: 16px; font-weight: 700; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.25s; box-shadow: 0 4px 20px rgba(0,137,123,0.35);
        }
        .login-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,137,123,0.5); }
        .login-btn:active { transform: translateY(0); }
        .quick-chip {
          padding: 5px 14px; border-radius: 20px; border: 1.5px solid #e2e8f0;
          font-size: 12px; font-weight: 600; cursor: pointer; background: white;
          color: #64748b; transition: all 0.15s; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .quick-chip:hover { border-color: #00897b; color: #00897b; background: #f0fdfb; }
      `}</style>

      {/* Main container */}
      <div style={{ display: 'flex', width: '100%', maxWidth: 900, minHeight: 520, borderRadius: 28, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.5)', margin: '24px' }}>

        {/* LEFT — White login panel */}
        <div className="login-card" style={{
          flex: '1 1 55%', background: 'white', padding: '52px 48px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          position: 'relative', zIndex: 2,
          clipPath: 'polygon(0 0, 92% 0, 100% 100%, 0 100%)',
        }}>
          <div style={{ maxWidth: 360 }}>
            {/* Heading */}
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#00897b', lineHeight: 1.2, margin: '0 0 6px' }}>
              Welcome to<br />AtomQuest
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500, margin: '0 0 36px' }}>
              Sign in to manage your goals & OKRs
            </p>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 20, fontWeight: 500 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <Mail size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="email" required placeholder="Email Address"
                  className="input-field" value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                />
              </div>

              {/* Password */}
              <div style={{ position: 'relative', marginBottom: 28 }}>
                <Lock size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="password" required placeholder="Password"
                  className="input-field" value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                />
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading
                  ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  : <><span>Login</span><ArrowRight size={18} /></>
                }
              </button>
            </form>

            {/* Quick Fill Demo Accounts */}
            <div style={{ marginTop: 28, borderTop: '1px solid #f1f5f9', paddingTop: 20 }}>
              <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Quick Demo Login</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="quick-chip" onClick={() => quickFill('admin')} type="button">👑 Admin</button>
                <button className="quick-chip" onClick={() => quickFill('manager')} type="button">📋 Manager</button>
                <button className="quick-chip" onClick={() => quickFill('employee')} type="button">👤 Employee</button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Dark branded panel */}
        <div style={{
          flex: '1 1 45%', position: 'relative', display: 'flex',
          flexDirection: 'column', justifyContent: 'space-between', padding: '40px 36px',
          background: 'transparent', overflow: 'hidden',
        }}>
          {/* Top right decorative text */}
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>FY2026 Q1 Pulse</p>
          </div>

          {/* Center icon */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
              border: '2px solid rgba(0,230,180,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="rgba(0,230,180,0.6)" strokeWidth="2"/>
                <path d="M12 20 L20 12 L28 20 L20 28 Z" fill="rgba(0,230,180,0.4)" stroke="rgba(0,230,180,0.8)" strokeWidth="1.5"/>
                <circle cx="20" cy="20" r="4" fill="#00e6b4"/>
              </svg>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontSize: 13, fontWeight: 500, lineHeight: 1.6 }}>
              In-House Goal Setting<br/>& Tracking Portal
            </p>
          </div>

          {/* Atomberg Logo bottom right */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, textAlign: 'right' }}>Powered by</p>
              <img
                src="https://atomberg.com/assets/svgs/header-logo.svg"
                alt="Atomberg"
                style={{ height: 32, filter: 'brightness(0) invert(1)', opacity: 0.9 }}
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span style={{ display: 'none', color: 'white', fontWeight: 800, fontSize: 22, letterSpacing: 1 }}>ATOMBERG</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
