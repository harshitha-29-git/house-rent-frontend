import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';

const FALLBACK = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=60';

const AdminDashboard = () => {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => {
    if (tab === 'properties') fetchProperties();
    if (tab === 'users') fetchUsers();
    if (tab === 'bookings') fetchBookings();
  }, [tab]);

  const fetchStats = async () => {
    try {
      const res = await API.get('/admin/dashboard');
      if (res.data.success) setStats(res.data.data);
    } catch { toast.error('Failed to load stats'); }
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/properties');
      if (res.data.success) setProperties(res.data.data);
    } catch { toast.error('Failed to load properties'); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/users');
      if (res.data.success) setUsers(res.data.data);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/bookings');
      if (res.data.success) setBookings(res.data.data);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/admin/property/${id}/approve`);
      setProperties(properties.map(p => p._id === id ? { ...p, approvalStatus: 'approved' } : p));
      toast.success('Property approved and published!');
      fetchStats();
    } catch { toast.error('Failed to approve'); }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/admin/property/${id}/reject`);
      setProperties(properties.map(p => p._id === id ? { ...p, approvalStatus: 'rejected' } : p));
      toast.success('Property rejected');
      fetchStats();
    } catch { toast.error('Failed to reject'); }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Permanently delete this property?')) return;
    try {
      await API.delete(`/properties/${id}`);
      setProperties(properties.filter(p => p._id !== id));
      toast.success('Property deleted');
      fetchStats();
    } catch { toast.error('Delete failed'); }
  };

  const getImg = (src) => src?.startsWith('/uploads') ? `http://localhost:5000${src}` : src || FALLBACK;
  const StatusPill = ({ status }) => <span className={`status-pill status-${status}`}>{status}</span>;

  const METRICS = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: 'bi-people-fill', color: '#6c63ff', bg: '#6c63ff18' },
    { label: 'Total Properties', value: stats.totalProperties, icon: 'bi-house-fill', color: '#10b981', bg: '#10b98118' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: 'bi-calendar-check', color: '#f59e0b', bg: '#f59e0b18' },
    { label: 'Approved', value: stats.approvedProperties, icon: 'bi-check-circle-fill', color: '#10b981', bg: '#10b98118' },
    { label: 'Pending Review', value: stats.pendingProperties, icon: 'bi-hourglass-split', color: '#f59e0b', bg: '#f59e0b18' },
    { label: 'Rejected', value: stats.rejectedProperties, icon: 'bi-x-circle-fill', color: '#ef4444', bg: '#ef444418' },
  ] : [];

  const TABS = [
    { id: 'dashboard', icon: 'bi-speedometer2', label: 'Overview' },
    { id: 'properties', icon: 'bi-house', label: 'Properties' },
    { id: 'users', icon: 'bi-people', label: 'Users' },
    { id: 'bookings', icon: 'bi-calendar', label: 'Bookings' },
  ];

  return (
    <div className="page-wrapper section-padding">
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <div style={{
            width: 52, height: 52, borderRadius: '14px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem',
          }}>🛡️</div>
          <div>
            <h3 style={{ fontWeight: 800, margin: 0 }}>Admin Dashboard</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Manage the HouseHunt platform</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="dash-tab-nav">
          {TABS.map(t => (
            <button key={t.id} className={`dash-tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <i className={`bi ${t.icon} me-1`}></i>{t.label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {tab === 'dashboard' && (
          <>
            <div className="row g-3 mb-4">
              {METRICS.map(m => (
                <div key={m.label} className="col-6 col-md-4 col-lg-2">
                  <div className="admin-metric-card flex-column text-center py-3">
                    <div className="metric-icon mx-auto mb-2" style={{ background: m.bg, color: m.color }}><i className={`bi ${m.icon}`}></i></div>
                    <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
                    <div className="metric-label">{m.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pending Properties Quick View */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 style={{ fontWeight: 700, margin: 0 }}>⏳ Pending Approval</h6>
                <button className="btn btn-sm" style={{ background: 'var(--surface-2)', color: 'var(--text-primary)', borderRadius: 8 }}
                  onClick={() => setTab('properties')}>View All</button>
              </div>
              {properties.filter(p => p.approvalStatus === 'pending').length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No pending listings. Click "Properties" tab to manage all listings.</p>
              ) : (
                properties.filter(p => p.approvalStatus === 'pending').slice(0, 3).map(p => (
                  <div key={p._id} className="d-flex align-items-center gap-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                    <img src={getImg(p.images?.[0])} alt="p" style={{ width: 60, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                    <div className="flex-fill">
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.title}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{p.location} · ${p.price}/mo</div>
                    </div>
                    <div className="d-flex gap-2">
                      <button onClick={() => handleApprove(p._id)} className="btn btn-sm btn-success" style={{ borderRadius: 8 }}>✓</button>
                      <button onClick={() => handleReject(p._id)} className="btn btn-sm btn-danger" style={{ borderRadius: 8 }}>✗</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* ── Properties Tab ── */}
        {tab === 'properties' && (
          loading ? <div className="loading-overlay"><div className="spinner-border text-primary"></div></div> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="hh-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Owner</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(p => (
                    <tr key={p._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={getImg(p.images?.[0])} alt="p" style={{ width: 48, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                          <span style={{ fontWeight: 600, fontSize: '0.88rem', maxWidth: 160 }}>{p.title}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{p.ownerId?.name}</td>
                      <td style={{ fontSize: '0.85rem' }}>{p.location}</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>${p.price}/mo</td>
                      <td><StatusPill status={p.approvalStatus} /></td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          {p.approvalStatus !== 'approved' && (
                            <button onClick={() => handleApprove(p._id)} className="btn btn-sm btn-success" style={{ borderRadius: 6, fontSize: '0.75rem' }}>Approve</button>
                          )}
                          {p.approvalStatus !== 'rejected' && (
                            <button onClick={() => handleReject(p._id)} className="btn btn-sm btn-warning" style={{ borderRadius: 6, fontSize: '0.75rem' }}>Reject</button>
                          )}
                          <button onClick={() => handleDeleteProperty(p._id)} className="btn btn-sm btn-danger" style={{ borderRadius: 6, fontSize: '0.75rem' }}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* ── Users Tab ── */}
        {tab === 'users' && (
          loading ? <div className="loading-overlay"><div className="spinner-border text-primary"></div></div> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="hh-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: u.role === 'admin' ? '#f59e0b' : 'var(--primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                          }}>{u.name?.charAt(0).toUpperCase()}</div>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                      <td style={{ fontSize: '0.85rem' }}>{u.phone}</td>
                      <td>
                        <span className={`status-pill ${u.role === 'admin' ? '' : 'status-approved'}`}
                          style={u.role === 'admin' ? { background: '#fef3c7', color: '#92400e' } : {}}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* ── Bookings Tab ── */}
        {tab === 'bookings' && (
          loading ? <div className="loading-overlay"><div className="spinner-border text-primary"></div></div> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="hh-table">
                <thead>
                  <tr><th>Tenant</th><th>Property</th><th>Move-in Date</th><th>Status</th><th>Requested</th></tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id}>
                      <td style={{ fontSize: '0.88rem' }}>
                        <div style={{ fontWeight: 600 }}>{b.userId?.name}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{b.userId?.email}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{b.propertyId?.title}</td>
                      <td style={{ fontSize: '0.85rem' }}>{new Date(b.bookingDate).toLocaleDateString()}</td>
                      <td><StatusPill status={b.status} /></td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
