import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      toast.warn('Please fill in all fields'); return;
    }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.warn('Password must be at least 6 characters'); return; }
    setLoading(true);
    const result = await register(form.name, form.email, form.phone, form.password, form.confirmPassword);
    setLoading(false);
    if (result?.success) { toast.success('Account created successfully!'); navigate('/'); }
    else toast.error(result?.message || 'Registration failed');
  };

  const inputIcon = (icon, name, type, placeholder, extra = {}) => (
    <div style={{ position: 'relative' }}>
      <i className={`bi ${icon}`} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}></i>
      <input type={type} name={name} id={`reg-${name}`} className="hh-form-control" style={{ paddingLeft: 36, ...extra }}
        placeholder={placeholder} value={form[name]} onChange={handleChange} required />
    </div>
  );

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: 500 }}>
        <div className="auth-logo"><i className="bi bi-house-heart-fill me-2"></i>HouseHunt</div>
        <p className="auth-tagline">Create your free account today</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="hh-label">Full Name</label>
            {inputIcon('bi-person', 'name', 'text', 'John Doe')}
          </div>
          <div className="mb-3">
            <label className="hh-label">Email Address</label>
            {inputIcon('bi-envelope', 'email', 'email', 'you@example.com')}
          </div>
          <div className="mb-3">
            <label className="hh-label">Phone Number</label>
            {inputIcon('bi-telephone', 'phone', 'tel', '+1 (555) 000-0000')}
          </div>
          <div className="mb-3">
            <label className="hh-label">Password</label>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-lock" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}></i>
              <input type={showPass ? 'text' : 'password'} name="password" id="reg-password"
                className="hh-form-control" style={{ paddingLeft: 36, paddingRight: 40 }}
                placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="hh-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-lock-fill" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}></i>
              <input type="password" name="confirmPassword" id="reg-confirm"
                className="hh-form-control" style={{ paddingLeft: 36 }}
                placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" id="reg-submit" className="btn-primary-hh btn w-100 py-2" disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating account...</> : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4 mb-0" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
