import { useState } from 'react';
import { supabase, HAS_SUPABASE } from '../lib/supabaseClient';

export default function AuthPage({ onLoginSuccess, onBack }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text: '' }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!email || !password) {
      setMessage({ type: 'error', text: 'Email dan password harus diisi!' });
      setLoading(false);
      return;
    }

    if (!HAS_SUPABASE) {
      // Mock mode auth handling
      setTimeout(() => {
        setLoading(false);
        if (activeTab === 'login') {
          const mockUser = { id: 'mock-user-uuid-1234-5678', email };
          setMessage({ type: 'success', text: 'Login berhasil (Mock Mode)!' });
          setTimeout(() => {
            onLoginSuccess(mockUser);
          }, 1000);
        } else {
          setMessage({ type: 'success', text: 'Registrasi berhasil (Mock Mode)! Silakan masuk.' });
          setActiveTab('login');
          setPassword('');
        }
      }, 800);
      return;
    }

    try {
      if (activeTab === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        setMessage({ type: 'success', text: 'Login berhasil!' });
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1000);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;

        // If email confirmation is required, tell user to check inbox
        if (data.user && data.session === null) {
          setMessage({
            type: 'success',
            text: 'Registrasi berhasil! Silakan periksa inbox email Anda untuk melakukan verifikasi akun.'
          });
        } else {
          setMessage({ type: 'success', text: 'Registrasi berhasil! Anda langsung masuk.' });
          setTimeout(() => {
            onLoginSuccess(data.user);
          }, 1000);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      // Translate typical errors into Indonesian
      let errMsg = err.message;
      if (err.message === 'Invalid login credentials') {
        errMsg = 'Email atau password salah. Silakan coba lagi.';
      } else if (err.message === 'User already registered') {
        errMsg = 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.';
      } else if (err.message === 'Signup requires a valid password') {
        errMsg = 'Password minimal terdiri dari 6 karakter.';
      }
      setMessage({ type: 'error', text: errMsg });
    } finally {
      if (activeTab === 'login') {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-in">
        <button 
          onClick={onBack} 
          style={{ 
            fontSize: 'var(--font-size-xs)', 
            color: 'var(--text-secondary)', 
            marginBottom: 'var(--space-md)',
            display: 'block',
            cursor: 'pointer' 
          }}
        >
          ← Kembali ke Beranda
        </button>

        <h1 className="auth-title">Studi<span>OS</span></h1>
        <p className="auth-subtitle">
          {!HAS_SUPABASE 
            ? 'Demo Mode (Supabase offline) — Gunakan email bebas'
            : 'Masuk atau daftar untuk membuka materi belajar premium'
          }
        </p>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => { setActiveTab('login'); setMessage(null); }}
          >
            Masuk
          </button>
          <button
            className={`auth-tab ${activeTab === 'register' ? 'auth-tab--active' : ''}`}
            onClick={() => { setActiveTab('register'); setMessage(null); }}
          >
            Daftar
          </button>
        </div>

        {message && (
          <div className={`auth-message auth-message--${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="nama@mahasiswa.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? 'Memproses...' : activeTab === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}
          </button>
        </form>
      </div>
    </div>
  );
}
