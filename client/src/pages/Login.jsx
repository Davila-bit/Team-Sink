import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-latte-base dark:bg-mocha-base flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-latte-blue dark:text-mocha-blue mb-2">Relief Net</h1>
          <p className="text-latte-subtext0 dark:text-mocha-subtext0">Sign in to access resources</p>
        </header>

        {/* Login Card */}
        <main className="card" role="main">
          <h2 className="text-2xl font-bold text-latte-text dark:text-mocha-text mb-6">Login</h2>

          {error && (
            <div
              className="bg-latte-red/10 dark:bg-mocha-red/20 border border-latte-red dark:border-mocha-red text-latte-red dark:text-mocha-red px-4 py-3 rounded-lg mb-4"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Login form">
            <div>
              <label htmlFor="email" className="label-text">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
                aria-required="true"
                aria-invalid={error ? 'true' : 'false'}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="label-text">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                aria-required="true"
                aria-invalid={error ? 'true' : 'false'}
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-latte-blue dark:text-mocha-blue hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              aria-busy={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-latte-subtext0 dark:text-mocha-subtext0">
              Don't have an account?{' '}
              <Link to="/register" className="text-latte-blue dark:text-mocha-blue font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-latte-blue dark:focus:ring-mocha-blue focus:ring-offset-2 dark:focus:ring-offset-mocha-base rounded">
                Register here
              </Link>
            </p>
          </div>
        </main>

        {/* Help Section */}
        <nav className="mt-6 text-center" aria-label="Additional navigation">
          <Link to="/" className="text-latte-blue dark:text-mocha-blue hover:underline focus:outline-none focus:ring-2 focus:ring-latte-blue dark:focus:ring-mocha-blue focus:ring-offset-2 dark:focus:ring-offset-mocha-base rounded">
            Back to Home
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Login;
