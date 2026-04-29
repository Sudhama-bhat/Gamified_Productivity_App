import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import {
  Zap, TrendingUp, Target, BarChart2, Flame, Shield,
  CheckSquare, Star, Users
} from 'lucide-react';

function LogoIcon({ size = 18, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

const features = [
  { icon: Zap, title: 'Earn XP', desc: 'Complete tasks and earn experience points based on difficulty. Easy, Medium & Hard challenges await.' },
  { icon: TrendingUp, title: 'Level Up', desc: 'Progress through unique levels, each with its own title and rank milestone.' },
  { icon: Target, title: 'Unlock Achievements', desc: 'Discover badges for milestones — first task, streaks, XP earned, and more.' },
  { icon: BarChart2, title: 'Productivity Reports', desc: 'Visual analytics showing your task completion, XP trends, and daily activity.' },
  { icon: Flame, title: 'Streak System', desc: 'Build daily habits with streak tracking. Stay consistent to earn bonus rewards.' },
  { icon: Shield, title: 'Admin Control', desc: 'Admins manage categories, XP rules, level thresholds, and achievement configurations.' },
  { icon: CheckSquare, title: 'Task Management', desc: 'Create, organise and complete tasks with difficulty selection and priority levels.' },
  { icon: Star, title: 'Leaderboard', desc: 'Compete with other users. Climb to the top of the global rankings and stay ahead.' },
  { icon: Users, title: 'Role-Based Access', desc: 'Separate dashboards for Admins and Users, each with tailored features and controls.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate(`/${user.role}`);
  }, [user]);

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="logo">
          <div className="landing-logo-icon">
            <LogoIcon size={18} color="white" />
          </div>
          <span className="landing-logo-text">QuestFlow</span>
        </div>
        <div className="landing-nav-links">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/login')}>Login</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <span className="hero-badge">Gamified Productivity Platform</span>
        <h1>Turn Your Tasks Into<br /><span>Epic Achievements</span></h1>
        <p>Earn XP, level up, unlock achievements, and dominate the leaderboard. The productivity platform that makes work feel rewarding.</p>
        <div className="hero-ctas">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
            Start Your Journey
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      </section>

      {/* Divider */}
      <div className="landing-divider" />

      {/* Features */}
      <div className="landing-section">
        <div className="landing-section-header">
          <h2>Everything you need to stay productive</h2>
          <p>A complete gamified productivity system, built for individuals and teams.</p>
        </div>
        <div className="features-grid" style={{ padding: '0 0 20px' }}>
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon-wrap">
                <f.icon size={20} color="white" />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="landing-divider" />

      {/* How it works */}
      <div className="landing-section" style={{ textAlign: 'center' }}>
        <div className="landing-section-header">
          <h2>How It Works</h2>
          <p>Three simple steps to boost productivity through gamification.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', maxWidth: '700px', margin: '0 auto' }}>
          {[
            { step: '01', title: 'Register & Login', desc: 'Create an account and access your personalised dashboard.' },
            { step: '02', title: 'Create Tasks', desc: 'Add tasks with categories, difficulty, and due dates.' },
            { step: '03', title: 'Earn XP & Level Up', desc: 'Complete tasks to earn XP, unlock achievements, and climb the leaderboard.' },
          ].map(s => (
            <div key={s.step} style={{ padding: '24px', background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: '12px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d4d4d4', marginBottom: '8px' }}>{s.step}</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', color: '#111' }}>{s.title}</h3>
              <p style={{ fontSize: '0.82rem', color: '#888' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#111111', padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', marginBottom: '12px', letterSpacing: '-0.5px' }}>Ready to level up?</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '28px', fontSize: '0.9rem' }}>Join QuestFlow today and transform the way you work.</p>
        <button className="btn btn-lg" onClick={() => navigate('/register')}
          style={{ background: '#ffffff', color: '#111111', fontWeight: 700 }}>
          Create Free Account
        </button>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid #e8e8e8', color: '#aaa', fontSize: '0.78rem', background: '#fff' }}>
        <p>QuestFlow — Gamified Productivity | Developed by <strong style={{ color: '#555' }}>Sudhama Bhat</strong> · Sahyadri College</p>
      </footer>
    </div>
  );
}
