import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="hh-footer">
      <div className="container">
        <div className="row g-4">
          {/* Brand */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-brand mb-12">
              <i className="bi bi-house-heart-fill me-2"></i>HouseHunt
            </div>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '0.9rem', marginTop: '12px', lineHeight: 1.7 }}>
              Find your dream rental property with ease. HouseHunt connects landlords and tenants seamlessly.
            </p>
            <div className="mt-3">
              <a href="#!" className="social-icon"><i className="bi bi-facebook"></i></a>
              <a href="#!" className="social-icon"><i className="bi bi-twitter-x"></i></a>
              <a href="#!" className="social-icon"><i className="bi bi-instagram"></i></a>
              <a href="#!" className="social-icon"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <div className="footer-heading">Quick Links</div>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/properties" className="footer-link">Browse Properties</Link>
            <Link to="/about" className="footer-link">About Us</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
          </div>

          {/* Property Types */}
          <div className="col-lg-3 col-md-6">
            <div className="footer-heading">Property Types</div>
            <Link to="/properties?propertyType=Apartment" className="footer-link">Apartments</Link>
            <Link to="/properties?propertyType=House" className="footer-link">Houses</Link>
            <Link to="/properties?propertyType=Villa" className="footer-link">Villas</Link>
            <Link to="/properties?propertyType=Studio" className="footer-link">Studios</Link>
            <Link to="/properties?propertyType=Shared Room" className="footer-link">Shared Rooms</Link>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6">
            <div className="footer-heading">Contact</div>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '0.9rem' }}>
              <i className="bi bi-geo-alt me-2"></i>123 Rental Street, NY 10001
            </p>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '0.9rem', marginTop: '8px' }}>
              <i className="bi bi-telephone me-2"></i>+1 (555) 123-4567
            </p>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '0.9rem', marginTop: '8px' }}>
              <i className="bi bi-envelope me-2"></i>info@househunt.com
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <span>© {new Date().getFullYear()} HouseHunt. All rights reserved.</span>
          <div className="d-flex gap-3">
            <a href="#!" className="footer-link mb-0">Privacy Policy</a>
            <a href="#!" className="footer-link mb-0">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
