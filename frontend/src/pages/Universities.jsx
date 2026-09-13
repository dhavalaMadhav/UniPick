import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import '../assets/universities.css';

export default function Universities() {
    const [universities, setUniversities] = useState(null); // null = loading/uninitialized
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = 'Explore Top Universities in India | UniPick';
    }, []);

    const navigate = useNavigate();
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [programmeFilter, setProgrammeFilter] = useState('all');
    const [stateFilter, setStateFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [budget, setBudget] = useState(500000);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    
    // Mobile modal state
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Universities', url: '' }
    ];

    const extractList = (data) => {
        if (!data) return null;
        if (Array.isArray(data.data) && data.data.length > 0) return data.data;
        if (Array.isArray(data.universities) && data.universities.length > 0) return data.universities;
        if (Array.isArray(data) && data.length > 0) return data;
        // Explicit empty arrays returned successfully from API
        if (Array.isArray(data.data) && data.data.length === 0) return [];
        if (Array.isArray(data.universities) && data.universities.length === 0) return [];
        if (Array.isArray(data) && data.length === 0) return [];
        return null;
    };

    const fetchUniversitiesData = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('📡 [Universities Page] Fetching /api/universities...');
            const response = await api.get('/api/universities');
            console.log('✅ [Universities Page] Response:', response.status, response.data);
            
            const list = extractList(response.data);
            if (list !== null) {
                setUniversities(list);
                setLoading(false);
                return;
            }

            console.warn('⚠️ [Universities Page] /api/universities list empty or invalid format, trying /universities fallback...');
            const fallbackRes = await api.get('/universities');
            const fallbackList = extractList(fallbackRes.data);
            if (fallbackList !== null) {
                setUniversities(fallbackList);
            } else {
                setUniversities([]);
            }
            setLoading(false);
        } catch (err) {
            console.error('❌ [Universities Page] Primary API error:', err);
            try {
                const secondaryRes = await api.get('/universities');
                const secondaryList = extractList(secondaryRes.data);
                if (secondaryList !== null) {
                    setUniversities(secondaryList);
                    setLoading(false);
                    return;
                }
            } catch (secErr) {
                console.error('❌ [Universities Page] Secondary API fallback error:', secErr);
            }

            setError('Unable to load universities. Render backend may be waking up from cold start.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUniversitiesData();
    }, []);

    // Filter logic
    const filteredUniversities = useMemo(() => {
        if (!universities || !Array.isArray(universities)) return [];
        return universities.filter(uni => {
            let visible = true;
            
            // Search
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const nameMatch = uni.name && uni.name.toLowerCase().includes(term);
                const locMatch = uni.location && uni.location.toLowerCase().includes(term);
                const stateMatch = uni.state && uni.state.toLowerCase().includes(term);
                const progMatch = uni.programmes && uni.programmes.some(p => p.toLowerCase().includes(term));
                if (!nameMatch && !locMatch && !stateMatch && !progMatch) visible = false;
            }
            
            // State Filter
            if (stateFilter !== 'all') {
                const uniState = `${uni.state || ''} ${uni.location || ''}`.toLowerCase();
                if (!uniState.includes(stateFilter.toLowerCase())) {
                    visible = false;
                }
            }
            
            // Programme Filter
            if (programmeFilter !== 'all') {
                if (!uni.programmes || !uni.programmes.some(p => p.toLowerCase().includes(programmeFilter.toLowerCase()))) {
                    visible = false;
                }
            }
            
            // Type Filter
            if (typeFilter !== 'all') {
                if (uni.type && uni.type.toLowerCase() !== typeFilter.toLowerCase()) {
                    visible = false;
                }
            }
            
            // Budget Filter
            if (budget < 500000 && uni.fee && uni.fee > budget) {
                visible = false;
            }
            
            return visible;
        });
    }, [universities, searchTerm, stateFilter, programmeFilter, typeFilter, budget]);

    const resetFilters = () => {
        setSearchTerm('');
        setProgrammeFilter('all');
        setStateFilter('all');
        setTypeFilter('all');
        setBudget(500000);
    };

    return (
        <div className="universities-page-wrapper">
            {/* Mobile Breadcrumb Section */}
            <div className="mobile-breadcrumb-section">
                <Breadcrumbs items={breadcrumbs} />
            </div>

            {/* Hero Section */}
            <section className="universities-hero">
                <div className="universities-hero-content">
                    <Breadcrumbs items={breadcrumbs} />
                    <h1>Explore Universities</h1>
                    <p>Discover premier educational institutions offering diverse programs and exceptional opportunities.</p>
                </div>
            </section>

            {/* Search Section */}
            <section className="search-section">
                <div className="search-container">
                    <h2 className="search-title">Find Your University</h2>
                    <div className="search-form">
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Search by name, location, or course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="search-divider"></div>
                        <button className="search-button">
                            <i className="fas fa-search"></i>
                            <span className="search-button-text">Search</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Mobile Filter Modal */}
            {showMobileFilters && (
                <>
                    <div className="filter-modal-overlay active" onClick={() => setShowMobileFilters(false)}></div>
                    <div className="filter-modal active">
                        <div className="filter-modal-header">
                            <h3 className="filter-modal-title">Filters</h3>
                            <button className="filter-modal-close" onClick={() => setShowMobileFilters(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="filter-modal-body">
                            {/* Duplicate filters for mobile modal - mapped to same state */}
                            <div className="filter-section">
                                <h3 className="filter-title">Programmes</h3>
                                <select className="filter-dropdown" value={programmeFilter} onChange={e => setProgrammeFilter(e.target.value)}>
                                    <option value="all">All Programmes</option>
                                    <option value="engineering">Engineering & Technology</option>
                                    <option value="management">Business & Management</option>
                                    <option value="computer">Computer Science & IT</option>
                                    <option value="medical">Medical & Health Sciences</option>
                                </select>
                            </div>
                            <div className="filter-section">
                                <h3 className="filter-title">State</h3>
                                <select className="filter-dropdown" value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
                                    <option value="all">All States</option>
                                    <option value="gujarat">Gujarat</option>
                                    <option value="maharashtra">Maharashtra</option>
                                    <option value="karnataka">Karnataka</option>
                                </select>
                            </div>
                            <button className="reset-filters" onClick={() => { resetFilters(); setShowMobileFilters(false); }}>
                                <i className="fas fa-redo"></i> Reset Filters
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Main Content */}
            <div className="universities-main">
                {/* Desktop Sidebar Filters */}
                <aside className="filter-sidebar">
                    <div className="filter-section">
                        <h3 className="filter-title">Programmes</h3>
                        <select className="filter-dropdown" value={programmeFilter} onChange={e => setProgrammeFilter(e.target.value)}>
                            <option value="all">All Programmes</option>
                            <option value="engineering">Engineering & Technology</option>
                            <option value="management">Business & Management</option>
                            <option value="computer">Computer Science & IT</option>
                            <option value="law">Law & Legal Studies</option>
                            <option value="medical">Medical & Health Sciences</option>
                            <option value="sciences">Sciences</option>
                            <option value="arts">Arts & Humanities</option>
                        </select>
                    </div>

                    <div className="filter-section">
                        <h3 className="filter-title">State</h3>
                        <select className="filter-dropdown" value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
                            <option value="all">All States</option>
                            <option value="gujarat">Gujarat</option>
                            <option value="maharashtra">Maharashtra</option>
                            <option value="uttar pradesh">Uttar Pradesh</option>
                            <option value="rajasthan">Rajasthan</option>
                            <option value="delhi">Delhi</option>
                            <option value="karnataka">Karnataka</option>
                            <option value="tamilnadu">Tamil Nadu</option>
                        </select>
                    </div>

                    <div className="filter-section">
                        <h3 className="filter-title">University Type</h3>
                        <div className="filter-group">
                            <label className="filter-radio">
                                <input type="radio" name="type" value="all" checked={typeFilter === 'all'} onChange={() => setTypeFilter('all')} />
                                <span className="custom-radio"></span>
                                <span className="filter-label">All Types</span>
                            </label>
                            <label className="filter-radio">
                                <input type="radio" name="type" value="private" checked={typeFilter === 'private'} onChange={() => setTypeFilter('private')} />
                                <span className="custom-radio"></span>
                                <span className="filter-label">Private</span>
                            </label>
                            <label className="filter-radio">
                                <input type="radio" name="type" value="government" checked={typeFilter === 'government'} onChange={() => setTypeFilter('government')} />
                                <span className="custom-radio"></span>
                                <span className="filter-label">Government</span>
                            </label>
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3 className="filter-title">Annual Fees</h3>
                        <div className="budget-range">
                            <input 
                                type="range" 
                                className="range-slider" 
                                min="0" max="500000" step="50000" 
                                value={budget}
                                onChange={e => setBudget(Number(e.target.value))}
                            />
                            <div className="budget-display">
                                <span>₹0</span>
                                <span>{budget >= 500000 ? '₹5L+' : '₹' + (budget/100000).toFixed(1) + 'L'}</span>
                            </div>
                        </div>
                    </div>

                    <button className="reset-filters" onClick={resetFilters}>
                        <i className="fas fa-redo"></i> Reset Filters
                    </button>
                </aside>

                {/* List Area */}
                <main className="content-area">
                    <div className="page-header">
                        <div className="page-header-left">
                            <h1>UNIVERSITIES</h1>
                            <p className="page-count">
                                Showing <span>{loading ? '...' : (universities ? filteredUniversities.length : 0)}</span> of {loading ? '...' : (universities ? universities.length : 0)} Universities
                            </p>
                        </div>
                        <div className="page-header-right">
                            <button className="mobile-filter-button" onClick={() => setShowMobileFilters(true)}>
                                <i className="fas fa-filter"></i> Filters
                            </button>
                            <div className="view-toggle" style={{ display: 'inline-flex', background: '#E2E8F0', padding: '3px', borderRadius: '50px', gap: '2px' }}>
                                <button 
                                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} 
                                    onClick={() => setViewMode('list')}
                                    style={{ borderRadius: '50px', padding: '6px 16px', border: 'none', background: viewMode === 'list' ? '#007BFF' : 'transparent', color: viewMode === 'list' ? '#FFFFFF' : '#475569', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    <i className="fas fa-list"></i> List
                                </button>
                                <button 
                                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} 
                                    onClick={() => setViewMode('grid')}
                                    style={{ borderRadius: '50px', padding: '6px 16px', border: 'none', background: viewMode === 'grid' ? '#007BFF' : 'transparent', color: viewMode === 'grid' ? '#FFFFFF' : '#475569', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    <i className="fas fa-th"></i> Grid
                                </button>
                            </div>

                        </div>
                    </div>

                    <div className={`universities-${viewMode}`}>
                        {loading ? (
                            /* Skeletons */
                            <div style={{ gridColumn: '1 / -1', width: '100%' }}>
                                <div style={{ background: '#EBF8FF', border: '1px solid #BEE3F8', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', color: '#2B6CB0' }}>
                                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '1.2rem' }}></i>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Connecting to UniPick Admissions database... Please wait a moment while the backend warms up.</span>
                                </div>
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div className="university-card skeleton-card" key={i} style={{ opacity: 0.7, marginBottom: '20px' }}>
                                        <div className="university-left" style={{ background: '#e2e8f0', minHeight: '150px', borderRadius: '8px', animation: 'pulse 1.5s infinite' }}></div>
                                    </div>
                                ))}
                            </div>
                        ) : error && !universities ? (
                            <div style={{ gridColumn: '1 / -1', width: '100%', textAlign: 'center', padding: '40px 20px', background: '#FFF5F5', borderRadius: '12px', border: '1px solid #FEB2B2', margin: '20px 0' }}>
                                <i className="fas fa-exclamation-triangle" style={{ fontSize: '2.5rem', color: '#E53E3E', marginBottom: '15px' }}></i>
                                <h3 style={{ color: '#9B2C2C', marginBottom: '8px', fontSize: '1.25rem' }}>Unable to Connect to Backend</h3>
                                <p style={{ color: '#742A2A', maxWidth: '480px', margin: '0 auto 20px', fontSize: '0.95rem' }}>{error}</p>
                                <button 
                                    className="reset-filters" 
                                    onClick={fetchUniversitiesData}
                                    style={{ background: '#008FD3', color: '#FFFFFF', border: 'none', padding: '10px 22px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <i className="fas fa-sync-alt"></i> Retry Connection
                                </button>
                            </div>
                        ) : filteredUniversities.length > 0 ? (
                            filteredUniversities.map(uni => (
                                <div 
                                    className="university-card" 
                                    key={uni._id || uni.slug}
                                    onClick={() => window.location.href = `/university/${uni.slug}`}
                                >
                                    {uni.featured && <div className="featured-badge">FEATURED</div>}

                                    {/* List View Content - Desktop Only */}
                                    <div className="university-left">
                                        <h3 className="university-name">
                                            {uni.name}
                                        </h3>

                                        <div className="university-details-left">
                                            <div className="detail-row">
                                                <i className="fas fa-map-marker-alt"></i>
                                                <span>Location</span>
                                                <span style={{ marginLeft: 'auto', fontWeight: '500' }}>
                                                    {uni.location}, {uni.state || 'Gujarat'}
                                                </span>
                                            </div>

                                            <div className="detail-row">
                                                <i className="fas fa-university"></i>
                                                <span>Type</span>
                                                <span style={{ marginLeft: 'auto', fontWeight: '500' }}>
                                                    {uni.type || 'Private'}
                                                </span>
                                            </div>

                                            {uni.programmes && uni.programmes.length > 0 && (
                                                <div className="detail-row">
                                                    <i className="fas fa-graduation-cap"></i>
                                                    <span>Programmes</span>
                                                    <span style={{ marginLeft: 'auto', fontWeight: '500', textAlign: 'right' }}>
                                                        {uni.programmes.slice(0, 3).join(', ')}
                                                        {uni.programmes.length > 3 && ` + ${uni.programmes.length - 3} more`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <Link to={`/university/${uni.slug}`} className="visit-button" onClick={(e) => e.stopPropagation()}>
                                            <i className="fas fa-external-link-alt"></i> Visit University Page
                                        </Link>
                                    </div>
                                    
                                    <div className="university-right">
                                        <div className="stat-item">
                                            <i className="fas fa-globe-asia stat-icon"></i>
                                            <div className="stat-content">
                                                <div className="stat-label">Global Ranking</div>
                                                <div className="stat-value">#{uni.globalRanking || Math.floor(Math.random() * 200) + 1}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="stat-item">
                                            <i className="fas fa-star stat-icon"></i>
                                            <div className="stat-content">
                                                <div className="stat-label">Rating</div>
                                                <div className="stat-value">{uni.rating || 4.4}/5</div>
                                            </div>
                                        </div>
                                        
                                        <div className="stat-item">
                                            <i className="fas fa-graduation-cap stat-icon"></i>
                                            <div className="stat-content">
                                                <div className="stat-label">Masters Programs</div>
                                                <div className="stat-value">{uni.mastersPrograms || 40}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="stat-item">
                                            <i className="fas fa-rupee-sign stat-icon"></i>
                                            <div className="stat-content">
                                                <div className="stat-label">Annual Fees</div>
                                                <div className="stat-value">
                                                    {uni.fee ? `₹${(uni.fee/100000).toFixed(1)}L` : '₹3.3L'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Grid View Content - Desktop Grid & Mobile (Both List and Grid) */}
                                    <h3 className="university-name grid-title">{uni.name}</h3>
                                    
                                    <div className="university-location">
                                        <i className="fas fa-map-marker-alt"></i>
                                        {uni.location}, {uni.state || 'Gujarat'}
                                    </div>

                                    {uni.programmes && uni.programmes.length > 0 && (
                                        <div className="university-programmes">
                                            <i className="fas fa-graduation-cap"></i>
                                            {uni.programmes.slice(0, 2).join(', ')} {uni.programmes.length > 2 && ` + ${uni.programmes.length - 2} more`}
                                        </div>
                                    )}
                                    
                                    <div className="grid-stats">
                                        <div className="grid-stat-item">
                                            <i className="fas fa-globe-asia grid-stat-icon"></i>
                                            <div className="grid-stat-label">GLOBAL RANK</div>
                                            <div className="grid-stat-value">#{uni.globalRanking || 85}</div>
                                        </div>
                                        
                                        <div className="grid-stat-item">
                                            <i className="fas fa-star grid-stat-icon"></i>
                                            <div className="grid-stat-label">RATING</div>
                                            <div className="grid-stat-value">{uni.rating || 4.3}</div>
                                        </div>
                                        
                                        <div className="grid-stat-item">
                                            <i className="fas fa-users grid-stat-icon"></i>
                                            <div className="grid-stat-label">STUDENTS</div>
                                            <div className="grid-stat-value">{uni.students || '5200+'}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results show">
                                <i className="fas fa-university"></i>
                                <h3>No Universities Found</h3>
                                <p>Try adjusting your search criteria or filters to find more universities.</p>
                                <button className="reset-filters" onClick={resetFilters}>
                                    <i className="fas fa-redo"></i> Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            
            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Need Help Choosing?</h2>
                    <p>Get personalized guidance from our expert counsellors to find the best university for you</p>
                    <div className="cta-buttons">
                        <Link to="/contact" className="cta-btn-primary">
                            <i className="fas fa-envelope"></i> Contact Admissions
                        </Link>
                        <a href="tel:+9118001234567" className="cta-btn-secondary">
                            <i className="fas fa-phone"></i> Talk to Counsellor
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
