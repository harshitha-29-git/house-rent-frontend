import React, { useState } from 'react';
import { toast } from 'react-toastify';

const About = () => {
  const TEAM = [
    { name: 'Sarah Johnson', role: 'CEO & Co-Founder', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Michael Chen', role: 'CTO & Co-Founder', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Priya Patel', role: 'Head of Design', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { name: 'David Kim', role: 'Lead Engineer', img: 'https://randomuser.me/api/portraits/men/52.jpg' },
  ];

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#1e1b4b,#4f46e5,#7c3aed)', padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '3rem', marginBottom: 12 }}>About HouseHunt</h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.1rem', maxWidth: 580, margin: '0 auto' }}>
            We're on a mission to make renting simple, transparent, and stress-free for everyone
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>OUR MISSION</div>
              <h2 className="section-title">Connecting Tenants & Landlords Since 2020</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
                HouseHunt was founded with the belief that finding a home to rent should be as easy as a few clicks. We've built a platform where landlords can list verified properties and tenants can discover, tour, and book homes seamlessly.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                Our admin-verified listings ensure quality and safety. With real-time booking status, direct landlord communication, and a beautiful browsing experience, HouseHunt is your trusted home-finding partner.
              </p>
            </div>
            <div className="col-lg-6">
              <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=700&q=80"
                alt="about" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', width: '100%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="row g-4">
            {[
              { icon: '🤝', title: 'Trust', desc: 'Every listing is verified by our admin team before going live.' },
              { icon: '⚡', title: 'Speed', desc: 'Get responses from landlords and book properties in minutes.' },
              { icon: '🌍', title: 'Accessibility', desc: 'We believe everyone deserves a safe, comfortable home.' },
              { icon: '🔒', title: 'Privacy', desc: 'Your personal data is protected and never sold to third parties.' },
            ].map(v => (
              <div key={v.title} className="col-md-6 col-lg-3">
                <div className="stat-card text-center">
                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{v.icon}</div>
                  <h5 style={{ fontWeight: 700, marginBottom: 8 }}>{v.title}</h5>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Meet the Team</h2>
            <p className="section-subtitle">The people building HouseHunt every day</p>
          </div>
          <div className="row g-4 justify-content-center">
            {TEAM.map(m => (
              <div key={m.name} className="col-6 col-md-3">
                <div className="stat-card text-center">
                  <img src={m.img} alt={m.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 12, border: '3px solid var(--primary)' }} />
                  <h6 style={{ fontWeight: 700, marginBottom: 2 }}>{m.name}</h6>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
