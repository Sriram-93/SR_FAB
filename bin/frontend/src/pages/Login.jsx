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
    <div className="flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-primary">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted">Sign in to your SR FAB account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-primary">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 px-4 py-3 text-sm text-primary outline-none transition focus:border-accent"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-primary">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 px-4 py-3 text-sm text-primary outline-none transition focus:border-accent"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-accent"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-accent transition hover:text-primary">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
