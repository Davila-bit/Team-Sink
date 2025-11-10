import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      await register(formData.email, formData.password);
      navigate('/profile'); // Redirect to complete profile
    } catch (err) {
      setError(err.message || 'Failed to create account');
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
          <p className="text-latte-subtext0 dark:text-mocha-subtext0">Create your account to get started</p>
        </header>

        {/* Register Card */}
        <main className="card" role="main">
          <h2 className="text-2xl font-bold text-latte-text dark:text-mocha-text mb-6">Register</h2>

          {error && (
            <div
              className="bg-latte-red/10 dark:bg-mocha-red/20 border border-latte-red dark:border-mocha-red text-latte-red dark:text-mocha-red px-4 py-3 rounded-lg mb-4"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Registration form">
            <div>
              <label htmlFor="email" className="label-text">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
                minLength={6}
                aria-required="true"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby="password-hint"
                autoComplete="new-password"
              />
              <p id="password-hint" className="text-sm text-latte-subtext0 dark:text-mocha-subtext0 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label-text">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
                minLength={6}
                aria-required="true"
                aria-invalid={error ? 'true' : 'false'}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              aria-busy={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-latte-subtext0 dark:text-mocha-subtext0">
              Already have an account?{' '}
              <Link to="/login" className="text-latte-blue dark:text-mocha-blue font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-latte-blue dark:focus:ring-mocha-blue focus:ring-offset-2 dark:focus:ring-offset-mocha-base rounded">
                Login here
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

export default Register;
