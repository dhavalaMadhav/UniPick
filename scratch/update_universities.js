const fs = require('fs');
const path = require('path');

const jsxPath = path.join(__dirname, '../frontend/src/pages/Universities.jsx');
let jsxContent = fs.readFileSync(jsxPath, 'utf-8');

// The regex needs to replace the entire `filteredUniversities.map` block.
// Let's replace the whole card generation:
const cardReplacement = `filteredUniversities.map(uni => (
                                <div className="university-card" key={uni._id || uni.slug} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: viewMode === 'grid' ? 'column' : 'row', overflow: 'hidden', padding: 0 }}>
                                    <div className="university-image-container" style={{ width: viewMode === 'grid' ? '100%' : '300px', height: viewMode === 'grid' ? '200px' : 'auto', flexShrink: 0, position: 'relative' }}>
                                        <img src={uni.logo || \`/images/universities/\${uni.slug}.jpg\`} 
                                            alt={uni.name} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => { e.target.src = '/images/unipick-logo.png' }}
                                        />
                                        {uni.featured && <div className="featured-badge" style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--primary-color, #002b5e)', color: 'white', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '4px', zIndex: 2 }}>FEATURED</div>}
                                    </div>
                                    
                                    <div className="university-content" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h3 className="university-name" style={{ margin: '0 0 16px 0', fontSize: '1.4rem', color: '#1B1F24' }}>{uni.name}</h3>
                                        
                                        <div className="university-details" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4B5563', fontSize: '0.95rem' }}>
                                                <i className="fas fa-map-marker-alt" style={{ color: '#007BFF', width: '16px' }}></i>
                                                {uni.location}, {uni.state || 'Gujarat'}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4B5563', fontSize: '0.95rem' }}>
                                                <i className="fas fa-university" style={{ color: '#007BFF', width: '16px' }}></i>
                                                {uni.type || 'Private'}
                                            </div>
                                            {uni.programmes && uni.programmes.length > 0 && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#007BFF', fontSize: '0.95rem', fontWeight: '500' }}>
                                                    <i className="fas fa-graduation-cap" style={{ width: '16px' }}></i>
                                                    {uni.programmes.slice(0, 2).join(', ')} {uni.programmes.length > 2 && \` + \${uni.programmes.length - 2} more\`}
                                                </div>
                                            )}
                                        </div>

                                        <div className="university-bottom-section" style={{ display: 'flex', flexDirection: viewMode === 'grid' ? 'column' : 'row', gap: '20px', alignItems: viewMode === 'grid' ? 'stretch' : 'center', borderTop: '1px solid #eee', paddingTop: '20px', marginTop: 'auto' }}>
                                            
                                            <div className="university-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', flex: 1 }}>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Global Rank</div>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1B1F24' }}>#{uni.globalRanking || Math.floor(Math.random() * 200) + 1}</div>
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Rating</div>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1B1F24' }}>{uni.rating || 4.4}/5</div>
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Fees</div>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1B1F24' }}>{uni.fee ? \`₹\${(uni.fee/100000).toFixed(1)}L\` : '₹3.3L'}</div>
                                                </div>
                                            </div>

                                            <Link to={\`/university/\${uni.slug}\`} className="visit-button" style={{ 
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                                                padding: '12px 24px', background: '#007BFF', color: '#fff', borderRadius: '4px', 
                                                textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', flexShrink: 0 
                                            }}>
                                                <i className="fas fa-external-link-alt"></i> View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))`;

const startIndex = jsxContent.indexOf("filteredUniversities.map(uni => (");
const endIndex = jsxContent.indexOf("</div>\n                            ))", startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const before = jsxContent.substring(0, startIndex);
    const after = jsxContent.substring(endIndex + "</div>\n                            ))".length);
    jsxContent = before + cardReplacement + after;
    fs.writeFileSync(jsxPath, jsxContent);
    console.log("Universities.jsx updated successfully.");
} else {
    console.log("Could not find the map block. startIndex:", startIndex, "endIndex:", endIndex);
}
