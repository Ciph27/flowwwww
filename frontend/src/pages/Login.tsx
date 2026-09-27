import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { LoginCredentials } from '../types/user';
import './Login.css';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const authResponse = await authService.login(credentials);
      authService.setAuth(authResponse);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 503) {
        setError('Database connection failed. Please contact your system administrator.');
      } else if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (err.response?.status === 403) {
        setError('Account is inactive. Please contact your administrator.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-application">
      <div className="login-window">
        <div className="login-header">
          <div className="application-title">
            <h1>STOCKFLOW AFRICA</h1>
            <p>Inventory • Stores • Procurement • POS</p>
          </div>
        </div>

        <div className="login-body">
          <div className="login-title">
            <h2>Business & Inventory Management</h2>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-banner">{error}</div>}

            <div className="form-field">
              <label htmlFor="email">Email / Username</label>
              <input
                type="text"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                autoComplete="username"
                autoFocus
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? '👁' : '👁‍🗨'}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'LOGIN'}
              </button>
              <button type="button" className="btn-secondary" disabled={isLoading}>
                EXIT
              </button>
            </div>

            <div className="form-footer">
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
          </form>
        </div>

        <div className="login-footer">
          <div className="footer-info">
            <span>StockFlow Africa</span>
            <span className="separator">|</span>
            <span>Version 1.0</span>
            <span className="separator">|</span>
            <span>© Nehanda Technologies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;