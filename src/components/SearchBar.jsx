import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch, inline = false }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '', location: '', propertyType: '', bedrooms: '', minPrice: '', maxPrice: '',
  });

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(filters);
    } else {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      navigate(`/properties?${params.toString()}`);
    }
  };

  const handleReset = () => {
    const empty = { search: '', location: '', propertyType: '', bedrooms: '', minPrice: '', maxPrice: '' };
    setFilters(empty);
    if (onSearch) onSearch(empty);
  };

  return (
    <div className={inline ? '' : 'search-card'}>
      {!inline && (
        <h5 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>
          <i className="bi bi-search me-2" style={{ color: 'var(--primary)' }}></i>
          Search Properties
        </h5>
      )}
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* Keyword */}
          <div className={inline ? 'col-lg-3 col-md-6' : 'col-12'}>
            <input
              type="text"
              className="form-control"
              name="search"
              placeholder="🔍  Search by title, description..."
              value={filters.search}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div className={inline ? 'col-lg-2 col-md-6' : 'col-12'}>
            <input
              type="text"
              className="form-control"
              name="location"
              placeholder="📍  Location (city, state)"
              value={filters.location}
              onChange={handleChange}
            />
          </div>

          {/* Property Type */}
          <div className={inline ? 'col-lg-2 col-md-6' : 'col-12'}>
            <select className="form-select" name="propertyType" value={filters.propertyType} onChange={handleChange}>
              <option value="">🏠  All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Studio">Studio</option>
              <option value="Shared Room">Shared Room</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div className={inline ? 'col-lg-1 col-md-6' : 'col-6'}>
            <select className="form-select" name="bedrooms" value={filters.bedrooms} onChange={handleChange}>
              <option value="">Beds</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>

          {/* Min Price */}
          <div className={inline ? 'col-lg-1 col-md-6' : 'col-6'}>
            <input
              type="number"
              className="form-control"
              name="minPrice"
              placeholder="Min $"
              value={filters.minPrice}
              onChange={handleChange}
              min="0"
            />
          </div>

          {/* Max Price */}
          <div className={inline ? 'col-lg-1 col-md-6' : 'col-6'}>
            <input
              type="number"
              className="form-control"
              name="maxPrice"
              placeholder="Max $"
              value={filters.maxPrice}
              onChange={handleChange}
              min="0"
            />
          </div>

          {/* Buttons */}
          <div className={inline ? 'col-lg-2 col-md-6' : 'col-12'}>
            <div className="d-flex gap-2">
              <button type="submit" className="btn-primary-hh btn flex-fill">
                <i className="bi bi-search me-1"></i> Search
              </button>
              {!inline && (
                <button type="button" className="btn-outline-hh btn" onClick={handleReset} title="Reset filters">
                  <i className="bi bi-arrow-counterclockwise"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
