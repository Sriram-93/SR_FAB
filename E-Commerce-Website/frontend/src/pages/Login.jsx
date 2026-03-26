import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/');
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-sm animate-fade-in relative z-10">
        <div className="text-center mb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Private Access</span>
          <h1 className="font-serif text-4xl font-bold text-primary mt-2">Welcome Back</h1>
          <p className="mt-3 text-sm text-primary/50 font-medium">Step into your world of premium curation.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-primary/70">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-primary/10 bg-surface px-5 py-4 text-sm text-primary outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_20px_rgba(201,169,110,0.1)] rounded-none"
              placeholder="you@example.com"
            />
          </div>
          <div className="group">
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-primary/70">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-primary/10 bg-surface px-5 py-4 text-sm text-primary outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_20px_rgba(201,169,110,0.1)] rounded-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-bg transition-all duration-300 hover:bg-accent hover:-translate-y-1 hover:shadow-xl active:scale-95"
          >
            Sign In
          </button>
        </form>

        <p className="mt-10 text-center text-[11px] font-medium text-primary/40 uppercase tracking-widest">
          New to SR FAB?{' '}
          <Link to="/register" className="text-accent underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-all">Request access</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
