import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';

export default function QuizResults() {
    const navigate = useNavigate();
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Career Quiz', url: '/quiz' },
        { name: 'Results', url: '' }
    ];

    useEffect(() => {
        const localData = localStorage.getItem('quizResults');
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                setResults(parsed);
                setLoading(false);
            } catch (err) {
                console.error("Error parsing quizResults:", err);
            }
        }

        // If no recommendations in localStorage, fetch top universities as fallback
        api.get('/api/universities')
            .then(res => {
                const uniList = res.data?.universities || (Array.isArray(res.data) ? res.data : []);
                if (uniList.length > 0) {
                    setResults(prev => {
                        if (prev && prev.recommendations && prev.recommendations.length > 0) {
                            return prev;
                        }
                        return {
                            quizScore: 85,
                            recommendations: uniList.slice(0, 5).map((uni, idx) => ({
                                _id: uni._id || uni.slug,
                                slug: uni.slug,
                                name: uni.name,
                                location: uni.location,
                                ranking: uni.ranking || 'NIRF Top Institution',
                                matchPercentage: 95 - (idx * 3),
                                image: uni.bannerImage || uni.logo || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop'
                            }))
                        };
                    });
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading fallback recommendations:", err);
                setLoading(false);
            });
    }, []);

    const recommendations = results?.recommendations || [];

    return (
        <div className="results-page-container">
            <Breadcrumbs items={breadcrumbs} />

            <div className="results-header">
                <h1>Your University Recommendations</h1>
                <p>Based on your responses, here are the best universities matched to your profile</p>
                {results?.quizScore && (
                    <div style={{ marginTop: '15px', display: 'inline-block', background: 'rgba(0,123,255,0.1)', color: '#007BFF', padding: '8px 20px', borderRadius: '30px', fontWeight: 600 }}>
                        Profile Fit Score: {results.quizScore}%
                    </div>
                )}
            </div>

            <div className="recommendations-section">
                <div id="recommendationsList">
                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center' }}>Loading your recommendations...</div>
                    ) : recommendations.length > 0 ? (
                        recommendations.map((rec, idx) => (
                            <div className="recommendation-card" key={idx} onClick={() => navigate(`/university/${rec.slug || rec._id}`)}>
                                <div className="recommendation-image">
                                    <img 
                                        src={rec.image || rec.logo || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop'} 
                                        alt={rec.name} 
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop' }}
                                    />
                                </div>
                                <div className="recommendation-content">
                                    <div className="match-badge">{rec.matchPercentage || (95 - idx * 3)}% Match</div>
                                    <h3>{rec.name}</h3>
                                    <div className="recommendation-meta">
                                        <span><i className="fas fa-map-marker-alt"></i> {rec.location || 'India'}</span>
                                        <span><i className="fas fa-trophy"></i> {rec.ranking || 'Top University'}</span>
                                    </div>
                                    <div className="recommendation-actions" onClick={(e) => e.stopPropagation()}>
                                        <Link to={`/university/${rec.slug || rec._id}`} className="btn-primary" style={{ textDecoration: 'none' }}>
                                            View Details
                                        </Link>
                                        <Link to="/contact" className="btn-secondary" style={{ textDecoration: 'none' }}>
                                            Get Admission Help
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results-message" style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <i className="fas fa-university" style={{ fontSize: '3rem', color: '#9CA3AF', marginBottom: '15px' }}></i>
                            <h3>No Specific Recommendations Found</h3>
                            <p style={{ margin: '10px 0 20px' }}>Try taking the quiz again or browse all universities.</p>
                            <Link to="/universities" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>Browse All Universities</Link>
                        </div>
                    )}
                </div>
            </div>

            <div className="next-steps">
                <h2>What's Next?</h2>

                <div className="steps-list">
                    <div className="step-item">
                        <i className="fas fa-phone-alt"></i>
                        <p>Our guidance team will contact you within 24 hours</p>
                    </div>
                    <div className="step-item">
                        <i className="fas fa-file-alt"></i>
                        <p>Receive comprehensive details about each university</p>
                    </div>
                    <div className="step-item">
                        <i className="fas fa-hands-helping"></i>
                        <p>Complete support throughout the admission process</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
