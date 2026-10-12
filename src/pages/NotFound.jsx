import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="not-found-section">
      <div className="container text-center">
        <div className="error-code">404</div>
        <h2 style={{ fontWeight: 800, marginTop: 16, marginBottom: 8 }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: 32, maxWidth: 420, margin: '0 auto 32px' }}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <button className="btn-outline-hh btn px-4 py-2" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>Go Back
          </button>
          <Link to="/" className="btn-primary-hh btn px-4 py-2">
            <i className="bi bi-house me-2"></i>Back to Home
          </Link>
        </div>
        <div style={{ marginTop: 48, opacity: 0.35 }}>
          <i className="bi bi-house-slash" style={{ fontSize: '5rem', color: 'var(--primary)' }}></i>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
