import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import PropertyCard from '../components/PropertyCard';

const FALLBACK = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=60';

const UserDashboard = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [tab, setTab] = useState('profile');
  const [myProps, setMyProps] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', password: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tab === 'listings') fetchMyProps();
    if (tab === 'bookings') { fetchBookings(); fetchIncoming(); }
    if (tab === 'favorites') fetchFavorites();
  }, [tab]);

  const fetchMyProps = async () => {
    setLoadingProps(true);
    try {
      const res = await API.get('/properties/my-listings');
      if (res.data.success) setMyProps(res.data.data);
    } catch { toast.error('Failed to load your listings'); }
    finally { setLoadingProps(false); }
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await API.get('/bookings');
      if (res.data.success) setBookings(res.data.data);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoadingBookings(false); }
  };

  const fetchIncoming = async () => {
    try {
      const res = await API.get('/bookings?role=landlord');
      if (res.data.success) setIncoming(res.data.data);
    } catch { /* silently fail if no landlord bookings */ }
  };

  const fetchFavorites = async () => {
    try {
      const res = await API.get('/users/favorites');
      if (res.data.success) setFavorites(res.data.data);
    } catch { toast.error('Failed to load favorites'); }
  };

  const handleDeleteProp = async (id) => {
    if (!window.confirm('Delete this property listing?')) return;
    try {
      await API.delete(`/properties/${id}`);
      setMyProps(myProps.filter(p => p._id !== id));
      toast.success('Property deleted');
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const handleBookingAction = async (id, status) => {
    try {
      const res = await API.put(`/bookings/${id}`, { status });
      if (res.data.success) {
        setIncoming(incoming.map(b => b._id === id ? { ...b, status } : b));
        toast.success(`Booking ${status}`);
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking request?')) return;
    try {
      await API.delete(`/bookings/${id}`);
      setBookings(bookings.filter(b => b._id !== id));
      toast.success('Booking cancelled');
    } catch (err) { toast.error(err.response?.data?.message || 'Cancel failed'); }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { name: profileForm.name, email: profileForm.email, phone: profileForm.phone };
    if (profileForm.password) payload.password = profileForm.password;
    const result = await updateProfile(payload);
    setSaving(false);
    if (result?.success) toast.success('Profile updated!');
    else toast.error(result?.message || 'Update failed');
  };

  const getImg = (src) => src?.startsWith('/uploads') ? `http://localhost:5000${src}` : src || FALLBACK;

  const StatusPill = ({ status }) => <span className={`status-pill status-${status}`}>{status}</span>;

  const TABS = [
    { id: 'profile', icon: 'bi-person', label: 'Profile' },
    { id: 'listings', icon: 'bi-house', label: 'My Listings' },
    { id: 'bookings', icon: 'bi-calendar', label: 'My Bookings' },
    { id: 'incoming', icon: 'bi-inbox', label: 'Incoming Requests' },
    { id: 'favorites', icon: 'bi-heart', label: 'Favorites' },
  ];

  return (
    <div className="page-wrapper section-padding">
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: '1.5rem',
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 style={{ fontWeight: 800, margin: 0 }}>Welcome, {user?.name?.split(' ')[0]}!</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>{user?.email}</p>
          </div>
          <Link to="/add-property" className="btn-primary-hh btn ms-auto">
            <i className="bi bi-plus-lg me-1"></i> List Property
          </Link>
        </div>

        {/* Tabs */}
        <div className="dash-tab-nav">
          {TABS.map(t => (
            <button key={t.id} className={`dash-tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <i className={`bi ${t.icon} me-1`}></i>{t.label}
            </button>
          ))}
        </div>

        {/* ── Profile Tab ── */}
        {tab === 'profile' && (
          <div style={{ maxWidth: 560 }}>
            <form onSubmit={handleProfileSave}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28 }}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="hh-label">Full Name</label>
                    <input className="hh-form-control" value={profileForm.name}
                      onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="hh-label">Email</label>
                    <input type="email" className="hh-form-control" value={profileForm.email}
                      onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="hh-label">Phone</label>
                    <input className="hh-form-control" value={profileForm.phone}
                      onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} />
                  </div>
                  <div className="col-12">
                    <label className="hh-label">New Password <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(leave blank to keep current)</span></label>
                    <input type="password" className="hh-form-control" placeholder="••••••••"
                      value={profileForm.password}
                      onChange={e => setProfileForm({ ...profileForm, password: e.target.value })} />
                  </div>
                  <div className="col-12">
                    <div className="d-flex align-items-center gap-2 p-2" style={{ background: 'var(--surface-2)', borderRadius: 8 }}>
                      <i className="bi bi-shield-check text-success"></i>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        Role: <strong style={{ color: 'var(--text-primary)' }}>{user?.role?.toUpperCase()}</strong>
                      </span>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn-primary-hh btn mt-4 px-4" disabled={saving}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : <><i className="bi bi-check-lg me-1"></i>Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── My Listings Tab ── */}
        {tab === 'listings' && (
          loadingProps ? <div className="loading-overlay"><div className="spinner-border text-primary"></div></div> :
          myProps.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-house-slash" style={{ fontSize: '3.5rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 14 }}></i>
              <h5>No listings yet</h5>
              <Link to="/add-property" className="btn-primary-hh btn mt-2">List Your First Property</Link>
            </div>
          ) : (
            <div className="row g-4">
              {myProps.map(p => (
                <div key={p._id} className="col-lg-4 col-md-6">
                  <div style={{ position: 'relative' }}>
                    <PropertyCard property={p} />
                    <div className="d-flex gap-2 mt-2">
                      <Link to={`/properties/${p._id}`} className="btn btn-sm flex-fill" style={{ background: 'var(--surface-2)', color: 'var(--text-primary)', borderRadius: 8 }}>
                        <i className="bi bi-eye me-1"></i>View
                      </Link>
                      <button onClick={() => handleDeleteProp(p._id)} className="btn btn-sm flex-fill btn-danger" style={{ borderRadius: 8 }}>
                        <i className="bi bi-trash me-1"></i>Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── My Bookings Tab ── */}
        {tab === 'bookings' && (
          loadingBookings ? <div className="loading-overlay"><div className="spinner-border text-primary"></div></div> :
          bookings.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-calendar-x" style={{ fontSize: '3.5rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 14 }}></i>
              <h5>No booking requests yet</h5>
              <Link to="/properties" className="btn-primary-hh btn mt-2">Browse Properties</Link>
            </div>
          ) : (
            <div className="row g-3">
              {bookings.map(b => (
                <div key={b._id} className="col-12">
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
                    <div className="d-flex align-items-start gap-3 flex-wrap">
                      <img src={getImg(b.propertyId?.images?.[0])} alt="prop"
                        style={{ width: 80, height: 60, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                      <div className="flex-fill">
                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                          <div>
                            <h6 style={{ fontWeight: 700, margin: 0 }}>{b.propertyId?.title}</h6>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                              <i className="bi bi-geo-alt me-1"></i>{b.propertyId?.location}
                              <span className="ms-3"><i className="bi bi-calendar me-1"></i>
                                Move-in: {new Date(b.bookingDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <StatusPill status={b.status} />
                        </div>
                        {b.message && <p style={{ margin: '8px 0 0', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>"{b.message}"</p>}
                      </div>
                      {b.status === 'pending' && (
                        <button onClick={() => handleCancelBooking(b._id)} className="btn btn-sm btn-outline-danger" style={{ borderRadius: 8 }}>
                          <i className="bi bi-x me-1"></i>Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── Incoming Requests Tab ── */}
        {tab === 'incoming' && (
          incoming.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox" style={{ fontSize: '3.5rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 14 }}></i>
              <h5>No incoming requests</h5>
              <p style={{ color: 'var(--text-secondary)' }}>Booking requests for your properties will appear here</p>
            </div>
          ) : (
            <div className="row g-3">
              {incoming.map(b => (
                <div key={b._id} className="col-12">
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
                    <div className="d-flex align-items-start gap-3 flex-wrap">
                      <img src={getImg(b.propertyId?.images?.[0])} alt="prop"
                        style={{ width: 80, height: 60, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                      <div className="flex-fill">
                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                          <div>
                            <h6 style={{ fontWeight: 700, margin: 0 }}>{b.propertyId?.title}</h6>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                              From: <strong>{b.userId?.name}</strong> · {b.userId?.email}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                              Move-in: {new Date(b.bookingDate).toLocaleDateString()}
                            </div>
                          </div>
                          <StatusPill status={b.status} />
                        </div>
                      </div>
                      {b.status === 'pending' && (
                        <div className="d-flex gap-2">
                          <button onClick={() => handleBookingAction(b._id, 'approved')}
                            className="btn btn-sm btn-success" style={{ borderRadius: 8 }}>
                            <i className="bi bi-check me-1"></i>Approve
                          </button>
                          <button onClick={() => handleBookingAction(b._id, 'rejected')}
                            className="btn btn-sm btn-danger" style={{ borderRadius: 8 }}>
                            <i className="bi bi-x me-1"></i>Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── Favorites Tab ── */}
        {tab === 'favorites' && (
          favorites.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-heart" style={{ fontSize: '3.5rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 14 }}></i>
              <h5>No favorites yet</h5>
              <Link to="/properties" className="btn-primary-hh btn mt-2">Discover Properties</Link>
            </div>
          ) : (
            <div className="row g-4">
              {favorites.map(p => (
                <div key={p._id} className="col-lg-4 col-md-6">
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
