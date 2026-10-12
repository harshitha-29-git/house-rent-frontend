import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';

const SORT_OPTIONS = [
  { value: 'newest', label: '⏱ Newest First' },
  { value: 'oldest', label: '📅 Oldest First' },
  { value: 'priceAsc', label: '💰 Price: Low → High' },
  { value: 'priceDesc', label: '💎 Price: High → Low' },
];

const PropertyListing = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalResults: 0 });
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  const buildQuery = (f = filters, p = currentPage, s = sort) => {
    const params = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => { if (v) params.set(k, v); });
    // Also pick URL params from initial load
    ['search','location','propertyType','bedrooms','minPrice','maxPrice'].forEach(k => {
      if (searchParams.get(k) && !f[k]) params.set(k, searchParams.get(k));
    });
    params.set('page', p);
    params.set('sort', s);
    params.set('limit', 6);
    return params.toString();
  };

  const fetchProperties = async (f = filters, p = currentPage, s = sort) => {
    setLoading(true);
    try {
      const res = await API.get(`/properties?${buildQuery(f, p, s)}`);
      if (res.data.success) {
        setProperties(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch properties', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = {};
    ['search','location','propertyType','bedrooms','minPrice','maxPrice'].forEach(k => {
      if (searchParams.get(k)) init[k] = searchParams.get(k);
    });
    setFilters(init);
    fetchProperties(init, 1, sort);
  }, []);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchProperties(newFilters, 1, sort);
  };

  const handleSort = (e) => {
    const s = e.target.value;
    setSort(s);
    setCurrentPage(1);
    fetchProperties(filters, 1, s);
  };

  const handlePage = (p) => {
    setCurrentPage(p);
    fetchProperties(filters, p, sort);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-wrapper section-padding">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <div>
            <h2 className="section-title mb-1">Browse Properties</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
              {loading ? '...' : `${pagination.totalResults} properties found`}
            </p>
          </div>
          <select className="form-select" style={{ width: 'auto', minWidth: 200, background: 'var(--surface)', color: 'var(--text-primary)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
            value={sort} onChange={handleSort}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="row g-4">
          {/* Sidebar Filters */}
          <div className="col-lg-3">
            <div style={{ position: 'sticky', top: 90 }}>
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {/* Results Grid */}
          <div className="col-lg-9">
            {loading ? (
              <div className="loading-overlay">
                <div className="spinner-border text-primary" style={{ width: 48, height: 48 }}></div>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-house-slash" style={{ fontSize: '4rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 16 }}></i>
                <h5 style={{ color: 'var(--text-primary)' }}>No properties found</h5>
                <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="row g-4">
                  {properties.map(p => (
                    <div key={p._id} className="col-md-6 col-xl-4">
                      <PropertyCard property={p} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="hh-pagination">
                    <button className="hh-page-btn" onClick={() => handlePage(currentPage - 1)} disabled={currentPage === 1}>
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} className={`hh-page-btn ${currentPage === p ? 'active' : ''}`} onClick={() => handlePage(p)}>{p}</button>
                    ))}
                    <button className="hh-page-btn" onClick={() => handlePage(currentPage + 1)} disabled={currentPage === pagination.totalPages}>
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListing;
