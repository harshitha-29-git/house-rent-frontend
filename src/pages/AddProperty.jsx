import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AMENITIES_LIST = ['Wifi','Air Conditioning','Parking','Gym','Swimming Pool','Furnished',
  'Pet Friendly','Backyard','Laundry Room','Heating','Elevator','Beach Access'];

const AddProperty = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', propertyType: '', location: '',
    price: '', bedrooms: '', bathrooms: '',
    contactPhone: '', contactEmail: '',
    amenities: [], images: [],
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAmenity = (a) => {
    const updated = form.amenities.includes(a)
      ? form.amenities.filter(x => x !== a)
      : [...form.amenities, a];
    setForm({ ...form, amenities: updated });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) { toast.warn('Maximum 5 images allowed'); return; }
    setForm({ ...form, images: files });
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.propertyType || !form.location || !form.price || !form.bedrooms || !form.bathrooms) {
      toast.warn('Please fill in all required fields'); return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'images') { v.forEach(f => formData.append('images', f)); }
        else if (k === 'amenities') { formData.append('amenities', JSON.stringify(v)); }
        else formData.append(k, v);
      });
      const res = await API.post('/properties', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.success) {
        toast.success('Property listed! It will appear after admin approval.');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to list property');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-wrapper section-padding">
      <div className="container" style={{ maxWidth: 860 }}>
        <div className="mb-4">
          <h2 className="section-title mb-1">List a Property</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Fill in the details below to list your rental property</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, marginBottom: 20 }}>
            <h6 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--primary)' }}>
              <i className="bi bi-info-circle me-2"></i>Basic Information
            </h6>
            <div className="row g-3">
              <div className="col-12">
                <label className="hh-label">Property Title *</label>
                <input name="title" id="prop-title" className="hh-form-control" placeholder="e.g. Modern 2BHK Apartment near City Center"
                  value={form.title} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="hh-label">Property Type *</label>
                <select name="propertyType" id="prop-type" className="hh-form-control" value={form.propertyType} onChange={handleChange} required>
                  <option value="">Select type...</option>
                  {['Apartment','House','Villa','Studio','Shared Room'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="hh-label">Location *</label>
                <input name="location" id="prop-location" className="hh-form-control" placeholder="City, State"
                  value={form.location} onChange={handleChange} required />
              </div>
              <div className="col-12">
                <label className="hh-label">Description *</label>
                <textarea name="description" id="prop-desc" className="hh-form-control" rows={4}
                  placeholder="Describe the property — features, surroundings, nearby facilities..."
                  value={form.description} onChange={handleChange} style={{ resize: 'vertical' }} required />
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, marginBottom: 20 }}>
            <h6 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--primary)' }}>
              <i className="bi bi-rulers me-2"></i>Property Details
            </h6>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="hh-label">Monthly Rent ($) *</label>
                <input type="number" name="price" id="prop-price" className="hh-form-control" placeholder="e.g. 1500"
                  value={form.price} onChange={handleChange} min="0" required />
              </div>
              <div className="col-md-4">
                <label className="hh-label">Bedrooms *</label>
                <input type="number" name="bedrooms" id="prop-beds" className="hh-form-control" placeholder="e.g. 2"
                  value={form.bedrooms} onChange={handleChange} min="0" required />
              </div>
              <div className="col-md-4">
                <label className="hh-label">Bathrooms *</label>
                <input type="number" name="bathrooms" id="prop-baths" className="hh-form-control" placeholder="e.g. 1"
                  value={form.bathrooms} onChange={handleChange} min="0" required />
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, marginBottom: 20 }}>
            <h6 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--primary)' }}>
              <i className="bi bi-stars me-2"></i>Amenities
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {AMENITIES_LIST.map(a => (
                <button key={a} type="button"
                  onClick={() => handleAmenity(a)}
                  style={{
                    padding: '7px 16px', borderRadius: '99px', cursor: 'pointer',
                    border: form.amenities.includes(a) ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                    background: form.amenities.includes(a) ? 'var(--primary)' : 'var(--surface-2)',
                    color: form.amenities.includes(a) ? '#fff' : 'var(--text-primary)',
                    fontWeight: 600, fontSize: '0.83rem', transition: 'all 0.2s',
                  }}>
                  {form.amenities.includes(a) && <i className="bi bi-check me-1"></i>}{a}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, marginBottom: 20 }}>
            <h6 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--primary)' }}>
              <i className="bi bi-images me-2"></i>Property Images (Max 5)
            </h6>
            <label htmlFor="prop-images" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: 32,
              border: '2px dashed var(--border)', borderRadius: 'var(--radius)',
              cursor: 'pointer', background: 'var(--surface-2)', transition: 'border-color 0.2s',
            }}>
              <i className="bi bi-cloud-upload" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: 8 }}></i>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Click to upload images</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>JPEG, JPG, PNG — Max 5MB each</div>
              <input type="file" id="prop-images" multiple accept="image/*" onChange={handleImages} style={{ display: 'none' }} />
            </label>
            {previews.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mt-3">
                {previews.map((p, i) => (
                  <div key={i} style={{ width: 90, height: 70, borderRadius: 8, overflow: 'hidden', border: '2px solid var(--primary)' }}>
                    <img src={p} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, marginBottom: 28 }}>
            <h6 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--primary)' }}>
              <i className="bi bi-telephone me-2"></i>Contact Information
            </h6>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="hh-label">Contact Phone *</label>
                <input name="contactPhone" id="prop-phone" className="hh-form-control" placeholder="+1 (555) 000-0000"
                  value={form.contactPhone || user?.phone} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="hh-label">Contact Email *</label>
                <input name="contactEmail" id="prop-email" type="email" className="hh-form-control" placeholder="landlord@email.com"
                  value={form.contactEmail || user?.email} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="d-flex gap-3 justify-content-end">
            <button type="button" className="btn-outline-hh btn px-4" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" id="add-prop-submit" className="btn-primary-hh btn px-5" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</> : <><i className="bi bi-send me-2"></i>Submit for Approval</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
