import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.warn('Please fill in all required fields'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  const INFO = [
    { icon: 'bi-geo-alt-fill', label: 'Address', val: '123 Rental Street, New York, NY 10001', color: '#6c63ff' },
    { icon: 'bi-telephone-fill', label: 'Phone', val: '+1 (555) 123-4567', color: '#10b981' },
    { icon: 'bi-envelope-fill', label: 'Email', val: 'support@househunt.com', color: '#f59e0b' },
    { icon: 'bi-clock-fill', label: 'Working Hours', val: 'Mon–Fri, 9 AM – 6 PM EST', color: '#ef4444' },
  ];

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#1e1b4b,#4f46e5)', padding: '70px 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2.8rem', marginBottom: 10 }}>Get In Touch</h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.05rem' }}>
            Have a question or need help? We're here for you.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row g-5">
            {/* Contact Form */}
            <div className="col-lg-7">
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 36 }}>
                <h4 style={{ fontWeight: 700, marginBottom: 24 }}>Send us a Message</h4>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="hh-label">Your Name *</label>
                      <input name="name" id="contact-name" className="hh-form-control" placeholder="John Doe"
                        value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="hh-label">Email Address *</label>
                      <input type="email" name="email" id="contact-email" className="hh-form-control" placeholder="you@example.com"
                        value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                      <label className="hh-label">Subject</label>
                      <input name="subject" id="contact-subject" className="hh-form-control" placeholder="How can we help you?"
                        value={form.subject} onChange={handleChange} />
                    </div>
                    <div className="col-12">
                      <label className="hh-label">Message *</label>
                      <textarea name="message" id="contact-message" className="hh-form-control" rows={5}
                        placeholder="Tell us more about your inquiry..."
                        value={form.message} onChange={handleChange} style={{ resize: 'vertical' }} required />
                    </div>
                    <div className="col-12">
                      <button type="submit" id="contact-submit" className="btn-primary-hh btn px-5 py-2" disabled={loading}>
                        {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</> : <><i className="bi bi-send me-2"></i>Send Message</>}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-lg-5">
              <h4 style={{ fontWeight: 700, marginBottom: 24 }}>Contact Information</h4>
              <div className="d-flex flex-column gap-3 mb-4">
                {INFO.map(i => (
                  <div key={i.label} className="d-flex align-items-start gap-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${i.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`bi ${i.icon}`} style={{ color: i.color, fontSize: '1rem' }}></i>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.5px' }}>{i.label}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: 2 }}>{i.val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div style={{
                background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)',
                borderRadius: 'var(--radius)',
                height: 160,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', color: '#fff',
              }}>
                <i className="bi bi-map" style={{ fontSize: '2.5rem', marginBottom: 8 }}></i>
                <div style={{ fontWeight: 600 }}>Interactive Map</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>New York, NY 10001</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
