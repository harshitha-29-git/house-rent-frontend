import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/');
    setNavOpen(false);
  };

  return (
    <nav className="hh-navbar navbar navbar-expand-lg">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <i className="bi bi-house-heart-fill" style={{ fontSize: '1.4rem' }}></i>
          HouseHunt
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle navigation"
          style={{ color: 'var(--text-primary)' }}
        >
          <i className={`bi ${navOpen ? 'bi-x-lg' : 'bi-list'}`} style={{ fontSize: '1.4rem' }}></i>
        </button>

        {/* Nav Links */}
        <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto gap-1">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={() => setNavOpen(false)} end>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/properties" onClick={() => setNavOpen(false)}>Browse</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about" onClick={() => setNavOpen(false)}>About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact" onClick={() => setNavOpen(false)}>Contact</NavLink>
            </li>
          </ul>

          {/* Right Section */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="btn border-0 p-1"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{ color: 'var(--text-primary)', background: 'transparent', fontSize: '1.2rem' }}
            >
              <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
            </button>

            {user ? (
              <div className="dropdown">
                <button
                  className="btn d-flex align-items-center gap-2 border-0 px-3 py-2"
                  style={{
                    background: 'var(--surface-2)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                  }}
                  data-bs-toggle="dropdown"
                >
                  <div
                    style={{
                      width: 30, height: 30,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '0.85rem', fontWeight: 700,
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  {user.name?.split(' ')[0]}
                  <i className="bi bi-chevron-down" style={{ fontSize: '0.75rem' }}></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2"
                  style={{ background: 'var(--surface)', borderRadius: 'var(--radius-sm)', minWidth: 180 }}>
                  {user.role === 'admin' ? (
                    <li>
                      <Link className="dropdown-item" to="/admin" style={{ color: 'var(--text-primary)' }} onClick={() => setNavOpen(false)}>
                        <i className="bi bi-speedometer2 me-2 text-warning"></i>Admin Dashboard
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link className="dropdown-item" to="/dashboard" style={{ color: 'var(--text-primary)' }} onClick={() => setNavOpen(false)}>
                        <i className="bi bi-grid me-2 text-primary"></i>My Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item" to="/add-property" style={{ color: 'var(--text-primary)' }} onClick={() => setNavOpen(false)}>
                      <i className="bi bi-plus-square me-2 text-success"></i>List Property
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" style={{ borderColor: 'var(--border)' }} /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn-outline-hh btn" onClick={() => setNavOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary-hh btn" onClick={() => setNavOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
