import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const FALLBACK = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [bookingDate, setBookingDate] = useState('');
  const [message, setMessage] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get(`/properties/${id}`);
        if (res.data.success) setProperty(res.data.data);
        else navigate('/properties');
      } catch { navigate('/properties'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const getImg = (src) => src?.startsWith('/uploads') ? `http://localhost:5000${src}` : src || FALLBACK;

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { toast.warn('Please login to book this property'); navigate('/login'); return; }
    if (!bookingDate) { toast.warn('Please select a move-in date'); return; }
    setBooking(true);
    try {
      const res = await API.post('/bookings', { propertyId: id, bookingDate, message });
      if (res.data.success) {
        toast.success('Booking request submitted! The landlord will review it shortly.');
        setBookingDate(''); setMessage('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit booking');
    } finally { setBooking(false); }
  };

  if (loading) return (
    <div className="loading-overlay" style={{ minHeight: '80vh' }}>
      <div className="spinner-border text-primary" style={{ width: 56, height: 56 }}></div>
    </div>
  );
  if (!property) return null;

  const imgs = property.images?.length > 0 ? property.images : [FALLBACK];

  return (
    <div className="page-wrapper section-padding">
      <div className="container">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="btn mb-4" style={{ color: 'var(--text-secondary)', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: 'none' }}>
          <i className="bi bi-arrow-left me-2"></i>Back to listings
        </button>

        <div className="row g-5">
          {/* Left: Gallery + Details */}
          <div className="col-lg-8">
            {/* Gallery */}
            <div className="gallery-main mb-2">
              <img src={getImg(imgs[activeImg])} alt={property.title} />
            </div>
            {imgs.length > 1 && (
              <div className="gallery-thumbs">
                {imgs.map((img, i) => (
                  <div key={i} className={`gallery-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={getImg(img)} alt={`view-${i}`} />
                  </div>
                ))}
              </div>
            )}

            {/* Title & Location */}
            <div className="mt-4">
              <div className="d-flex flex-wrap gap-2 mb-2">
                <span className="status-pill" style={{ background: 'var(--primary)', color: '#fff' }}>{property.propertyType}</span>
                <span className={`status-pill status-${property.approvalStatus}`}>{property.approvalStatus}</span>
              </div>
              <h1 style={{ fontWeight: 800, fontSize: '1.8rem', color: 'var(--text-primary)' }}>{property.title}</h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>
                <i className="bi bi-geo-alt-fill me-1" style={{ color: 'var(--primary)' }}></i>
                {property.location}
              </p>
              <div className="d-flex align-items-center gap-2 mt-1">
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-main)' }}>
                  ${property.price?.toLocaleString()}
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>/month</span>
              </div>
            </div>

            {/* Meta */}
            <div className="d-flex gap-4 flex-wrap my-4 p-3" style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
              {[
                { icon: 'bi-door-open', label: 'Bedrooms', val: property.bedrooms },
                { icon: 'bi-droplet', label: 'Bathrooms', val: property.bathrooms },
                { icon: 'bi-house', label: 'Type', val: property.propertyType },
                { icon: 'bi-check-circle', label: 'Status', val: property.isAvailable ? 'Available' : 'Unavailable' },
              ].map(m => (
                <div key={m.label} className="text-center flex-fill">
                  <i className={`bi ${m.icon}`} style={{ fontSize: '1.4rem', color: 'var(--primary)', display: 'block', marginBottom: 4 }}></i>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{m.label}</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.val}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-4">
              <h5 style={{ fontWeight: 700, marginBottom: 10 }}>About this Property</h5>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="mb-4">
                <h5 style={{ fontWeight: 700, marginBottom: 14 }}>Amenities</h5>
                <div className="d-flex flex-wrap gap-2">
                  {property.amenities.map(a => (
                    <span key={a} style={{
                      background: 'var(--surface-2)', border: '1.5px solid var(--border)',
                      padding: '6px 14px', borderRadius: '99px',
                      fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-primary)',
                    }}>
                      <i className="bi bi-check-circle-fill me-1" style={{ color: 'var(--accent)' }}></i>{a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Virtual Tour Placeholder */}
            <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)', borderRadius: 'var(--radius)', padding: 32, textAlign: 'center', color: '#fff', marginBottom: 24 }}>
              <i className="bi bi-camera-video-fill" style={{ fontSize: '2.5rem', marginBottom: 10, display: 'block' }}></i>
              <h5 style={{ fontWeight: 700 }}>Virtual Property Tour</h5>
              <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '0.9rem', marginBottom: 16 }}>
                Experience this property from anywhere with our immersive 360° virtual tour
              </p>
              <button className="btn btn-warning fw-bold" style={{ borderRadius: 8 }}>
                <i className="bi bi-play-circle me-2"></i>Launch Virtual Tour
              </button>
            </div>
          </div>

          {/* Right: Owner + Booking */}
          <div className="col-lg-4">
            {/* Owner Card */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
              <h6 style={{ fontWeight: 700, marginBottom: 16 }}>Contact Landlord</h6>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: '1.2rem',
                }}>
                  {property.ownerId?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{property.ownerId?.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Property Owner</div>
                </div>
              </div>
              <div className="d-grid gap-2">
                <a href={`mailto:${property.contactInfo?.email}`} className="btn btn-sm" style={{ background: 'var(--surface-2)', color: 'var(--text-primary)', borderRadius: 8, textAlign: 'left' }}>
                  <i className="bi bi-envelope me-2" style={{ color: 'var(--primary)' }}></i>{property.contactInfo?.email}
                </a>
                <a href={`tel:${property.contactInfo?.phone}`} className="btn btn-sm" style={{ background: 'var(--surface-2)', color: 'var(--text-primary)', borderRadius: 8, textAlign: 'left' }}>
                  <i className="bi bi-telephone me-2" style={{ color: 'var(--accent)' }}></i>{property.contactInfo?.phone}
                </a>
              </div>
            </div>

            {/* Booking Card */}
            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--primary)', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow-md)' }}>
              <h6 style={{ fontWeight: 700, marginBottom: 4 }}>Request Booking</h6>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: 16 }}>
                Select your preferred move-in date
              </p>
              <form onSubmit={handleBook}>
                <div className="mb-3">
                  <label className="hh-label">Move-in Date</label>
                  <input type="date" id="booking-date" className="hh-form-control"
                    value={bookingDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setBookingDate(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="hh-label">Message (Optional)</label>
                  <textarea className="hh-form-control" id="booking-message" rows={3}
                    placeholder="Introduce yourself to the landlord..."
                    value={message} onChange={e => setMessage(e.target.value)}
                    style={{ resize: 'none' }} />
                </div>
                <button type="submit" id="booking-submit" className="btn-primary-hh btn w-100 py-2" disabled={booking}>
                  {booking ? <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</> : <><i className="bi bi-calendar-check me-2"></i>Request Booking</>}
                </button>
                {!user && (
                  <p className="text-center mt-2 mb-0" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <Link to="/login">Login</Link> to book this property
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
