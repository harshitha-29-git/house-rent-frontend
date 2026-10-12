import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';

const STATS = [
  { icon: '🏠', value: '2,400+', label: 'Properties Listed' },
  { icon: '👥', value: '18,000+', label: 'Happy Tenants' },
  { icon: '🌆', value: '120+', label: 'Cities Covered' },
  { icon: '⭐', value: '4.9/5', label: 'Average Rating' },
];

const AMENITY_ICONS = ['Wifi','Parking','Pool','Gym','Furnished','Pet Friendly'];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get('/properties?limit=6&sort=newest');
        if (res.data.success) setFeatured(res.data.data);
      } catch (err) {
        console.error('Failed to fetch featured properties', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="page-wrapper">
      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span style={{
                  background: 'rgba(255,255,255,.15)', color: '#fff',
                  padding: '5px 14px', borderRadius: '99px', fontSize: '0.82rem', fontWeight: 600,
                }}>
                  🏆 #1 House Rental Platform
                </span>
              </div>
              <h1 className="hero-title mb-3">
                Find Your Perfect<br />
                <span style={{ color: '#fbbf24' }}>Dream Home</span> Today
              </h1>
              <p className="hero-subtitle mb-4">
                Browse thousands of verified rental properties. Apartments, houses, villas and more — all in one place.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/properties" className="btn btn-warning fw-bold px-4 py-2" style={{ borderRadius: '10px' }}>
                  Browse Properties <i className="bi bi-arrow-right ms-1"></i>
                </Link>
                <Link to="/add-property" className="btn btn-outline-light fw-bold px-4 py-2" style={{ borderRadius: '10px' }}>
                  List Your Property
                </Link>
              </div>
              <div className="d-flex gap-4 mt-4 flex-wrap">
                {['✓ Free Listing', '✓ Verified Properties', '✓ Instant Booking'].map(t => (
                  <span key={t} style={{ color: 'rgba(255,255,255,.8)', fontSize: '0.85rem', fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div style={{ position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=700&q=80"
                  alt="Modern home"
                  style={{ borderRadius: '24px', boxShadow: '0 24px 80px rgba(0,0,0,.4)', width: '100%' }}
                />
                {/* Floating badge */}
                <div style={{
                  position: 'absolute', bottom: 24, left: 24,
                  background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(10px)',
                  borderRadius: '14px', padding: '12px 18px',
                  boxShadow: '0 8px 32px rgba(0,0,0,.2)',
                }}>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 500 }}>Average Rent</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#6c63ff' }}>$1,850 <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>/month</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Inline Search ── */}
          <div className="mt-5">
            <div className="search-card">
              <SearchBar inline={true} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="section-padding" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="row g-4">
            {STATS.map((s) => (
              <div key={s.label} className="col-6 col-md-3">
                <div className="stat-card">
                  <div className="stat-icon">{s.icon}</div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Listings ── */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-5">
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>
              HANDPICKED FOR YOU
            </div>
            <h2 className="section-title">Featured Properties</h2>
            <p className="section-subtitle">Explore our curated selection of top-rated rental properties</p>
          </div>

          {loading ? (
            <div className="loading-overlay">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-5" style={{ color: 'var(--text-secondary)' }}>
              <i className="bi bi-house-slash" style={{ fontSize: '3rem', marginBottom: 12, display: 'block' }}></i>
              No properties found yet. <Link to="/add-property">List the first one!</Link>
            </div>
          ) : (
            <div className="row g-4">
              {featured.map((p) => (
                <div key={p._id} className="col-lg-4 col-md-6">
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-5">
            <Link to="/properties" className="btn-primary-hh btn px-5 py-2">
              View All Properties <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why HouseHunt ── */}
      <section className="section-padding" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Why Choose <span className="gradient-text">HouseHunt?</span></h2>
            <p className="section-subtitle">Everything you need to find or rent a home, simplified</p>
          </div>
          <div className="row g-4">
            {[
              { icon: 'bi-shield-check', title: 'Verified Listings', desc: 'Every property goes through an admin approval process before appearing publicly.', color: '#6c63ff' },
              { icon: 'bi-lightning-charge', title: 'Instant Booking', desc: 'Request bookings instantly and get real-time status updates from landlords.', color: '#f59e0b' },
              { icon: 'bi-geo-alt', title: 'Location Aware', desc: 'Search by city or neighborhood and find rentals exactly where you want to live.', color: '#10b981' },
              { icon: 'bi-chat-dots', title: 'Direct Contact', desc: 'Connect directly with property owners — no middlemen, no extra fees.', color: '#ef4444' },
            ].map((f) => (
              <div key={f.title} className="col-lg-3 col-md-6">
                <div className="stat-card text-start">
                  <div style={{
                    width: 52, height: 52, borderRadius: '12px',
                    background: `${f.color}18`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                  }}>
                    <i className={`bi ${f.icon}`} style={{ fontSize: '1.5rem', color: f.color }}></i>
                  </div>
                  <h5 style={{ fontWeight: 700, marginBottom: 8 }}>{f.title}</h5>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ background: 'linear-gradient(135deg, #6c63ff, #4f46e5)', padding: '70px 0' }}>
        <div className="container text-center">
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '2rem', marginBottom: 12 }}>
            Ready to List Your Property?
          </h2>
          <p style={{ color: 'rgba(255,255,255,.75)', marginBottom: 28, fontSize: '1.05rem' }}>
            Join thousands of landlords already earning on HouseHunt
          </p>
          <Link to="/register" className="btn btn-warning fw-bold px-5 py-2" style={{ borderRadius: '10px', fontSize: '1rem' }}>
            Get Started Free <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
