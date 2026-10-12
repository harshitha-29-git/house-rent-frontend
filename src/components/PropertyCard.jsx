import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

const PropertyCard = ({ property }) => {
  const { user, toggleFavorite } = useContext(AuthContext);

  const {
    _id, title, location, price, bedrooms, bathrooms,
    propertyType, images, amenities, approvalStatus,
  } = property;

  const imgSrc = images && images.length > 0
    ? (images[0].startsWith('/uploads') ? `http://localhost:5000${images[0]}` : images[0])
    : FALLBACK_IMG;

  const isFav = user?.favorites?.includes(_id);

  const handleFav = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.warn('Please log in to save favorites');
      return;
    }
    const result = await toggleFavorite(_id);
    if (result?.success) {
      toast.success(result.message);
    } else {
      toast.error(result?.message || 'Failed to update favorites');
    }
  };

  return (
    <div className="property-card">
      {/* Image */}
      <div className="card-img-wrap">
        <img src={imgSrc} alt={title} loading="lazy" />
        <span className="badge-type">{propertyType}</span>
        <button className="fav-btn" onClick={handleFav} title={isFav ? 'Remove from favorites' : 'Add to favorites'}>
          <i className={`bi ${isFav ? 'bi-heart-fill text-danger' : 'bi-heart'}`} style={{ fontSize: '1rem' }}></i>
        </button>
        {approvalStatus === 'pending' && (
          <span style={{
            position: 'absolute', bottom: 12, left: 12,
            background: '#f59e0b', color: '#fff',
            fontSize: '0.7rem', fontWeight: 700,
            padding: '3px 8px', borderRadius: '99px',
          }}>
            Pending Approval
          </span>
        )}
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <div className="price-tag">₹{price.toLocaleString()}<span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/mo</span></div>
        </div>

        <h6 style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.97rem', color: 'var(--text-primary)' }}>
          {title}
        </h6>

        <div className="location-tag mb-2">
          <i className="bi bi-geo-alt-fill me-1" style={{ color: 'var(--primary)' }}></i>
          {location}
        </div>

        {/* Meta row */}
        <div className="d-flex gap-3 mb-3">
          <div className="meta-item">
            <i className="bi bi-door-open" style={{ color: 'var(--primary)' }}></i>
            {bedrooms} Bed{bedrooms !== 1 ? 's' : ''}
          </div>
          <div className="meta-item">
            <i className="bi bi-droplet" style={{ color: 'var(--primary)' }}></i>
            {bathrooms} Bath{bathrooms !== 1 ? 's' : ''}
          </div>
          {amenities?.length > 0 && (
            <div className="meta-item">
              <i className="bi bi-stars" style={{ color: 'var(--secondary)' }}></i>
              {amenities.length} Amenities
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          to={`/properties/${_id}`}
          className="btn-primary-hh btn w-100"
          style={{ fontSize: '0.88rem', padding: '9px 0' }}
        >
          View Details <i className="bi bi-arrow-right ms-1"></i>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
