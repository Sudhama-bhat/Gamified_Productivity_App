import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader } from 'lucide-react';

function LogoIcon({ size = 22, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('All fields required');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      toast.success('Welcome to QuestFlow! Account created.');
      navigate('/user');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card animate-slide">
        <div className="auth-logo">
          <div className="auth-logo-img">
            <div className="auth-logo-icon">
              <LogoIcon size={22} color="white" />
            </div>
            <h1>QuestFlow</h1>
          </div>
          <p>Create your account and start your journey</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" className="form-control" placeholder="Enter your full name" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={show ? 'text' : 'password'} className="form-control" placeholder="Min 6 characters" value={form.password} onChange={handleChange} style={{ paddingRight: '44px' }} />
              <button type="button" onClick={() => setShow(s => !s)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#999', cursor: 'pointer', display: 'flex' }}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: '4px' }}>
            {loading ? <Loader size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> : null}
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <a onClick={() => navigate('/login')}>Sign in</a>
        </div>
        <div className="auth-switch" style={{ marginTop: '8px' }}>
          <a onClick={() => navigate('/')}>Back to Home</a>
        </div>
      </div>
    </div>
  );
}
