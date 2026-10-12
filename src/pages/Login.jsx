import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.warn('Please fill in all fields'); return; }
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result?.success) {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      toast.error(result?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo"><i className="bi bi-house-heart-fill me-2"></i>HouseHunt</div>
        <p className="auth-tagline">Welcome back! Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="hh-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-envelope" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}></i>
              <input
                type="email" name="email" id="login-email"
                className="hh-form-control" style={{ paddingLeft: 36 }}
                placeholder="you@example.com"
                value={form.email} onChange={handleChange} required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="hh-label">Password</label>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-lock" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}></i>
              <input
                type={showPass ? 'text' : 'password'} name="password" id="login-password"
                className="hh-form-control" style={{ paddingLeft: 36, paddingRight: 40 }}
                placeholder="Enter your password"
                value={form.password} onChange={handleChange} required
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          <button type="submit" id="login-submit" className="btn-primary-hh btn w-100 py-2" disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</> : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-4 mb-0" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>Create one free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
