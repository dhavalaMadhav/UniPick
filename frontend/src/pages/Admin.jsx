import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Admin() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [streamFilter, setStreamFilter] = useState('all');
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [noteInput, setNoteInput] = useState('');

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Admin Portal', url: '' }
    ];

    // Check if token exists on mount
    useEffect(() => {
        document.title = 'Admin Management Portal | UniPick';
        const token = localStorage.getItem('adminToken');
        if (token) {
            verifyAndFetchLeads();
        }
    }, []);

    const verifyAndFetchLeads = async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            const res = await api.get('/api/admin/leads');
            if (res.data && res.data.success) {
                setLeads(res.data.leads || []);
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        } catch (err) {
            console.error('Failed to verify token or fetch leads:', err);
            localStorage.removeItem('adminToken');
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);
        try {
            const res = await api.post('/api/admin/login', credentials);
            if (res.data && res.data.success) {
                if (res.data.token) {
                    localStorage.setItem('adminToken', res.data.token);
                }
                setIsLoggedIn(true);
                await verifyAndFetchLeads();
            } else {
                setErrorMsg(res.data?.message || 'Invalid username or password.');
            }
        } catch (err) {
            console.error('Login request failed:', err);
            setErrorMsg('Login failed. Please check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsLoggedIn(false);
        setLeads([]);
    };

    const handleStatusChange = async (leadId, newStatus, currentNotes) => {
        try {
            const res = await api.post(`/api/admin/leads/${leadId}/status`, {
                status: newStatus,
                notes: currentNotes
            });
            if (res.data && res.data.success) {
                setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
            }
        } catch (err) {
            console.error('Status update failed:', err);
            alert('Failed to update status.');
        }
    };

    const handleSaveNote = async (leadId, currentStatus) => {
        try {
            const res = await api.post(`/api/admin/leads/${leadId}/status`, {
                status: currentStatus,
                notes: noteInput
            });
            if (res.data && res.data.success) {
                setLeads(prev => prev.map(l => l._id === leadId ? { ...l, notes: noteInput } : l));
                setEditingNoteId(null);
            }
        } catch (err) {
            console.error('Save note failed:', err);
            alert('Failed to save note.');
        }
    };

    const handleDeleteLead = async (leadId) => {
        if (!window.confirm('Are you sure you want to delete this lead record?')) return;
        try {
            const res = await api.delete(`/api/admin/leads/${leadId}`);
            if (res.data && res.data.success) {
                setLeads(prev => prev.filter(l => l._id !== leadId));
            }
        } catch (err) {
            console.error('Delete lead failed:', err);
            alert('Failed to delete lead.');
        }
    };

    // Filter leads by search term & stream
    const filteredLeads = leads.filter(lead => {
        const matchesSearch = 
            (lead.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.phone || '').includes(searchTerm) ||
            (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.city || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStream = streamFilter === 'all' || (lead.stream || '').toLowerCase() === streamFilter.toLowerCase();
        return matchesSearch && matchesStream;
    });

    // Counts
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => (l.status || 'New') === 'New').length;
    const contactedLeads = leads.filter(l => (l.status || '') === 'Contacted').length;
    const admittedLeads = leads.filter(l => (l.status || '') === 'Admitted').length;

    return (
        <div style={{ padding: '16px 5% 50px', maxWidth: '1400px', margin: '0 auto', fontFamily: "'Inter', system-ui, sans-serif", color: '#0F172A', boxSizing: 'border-box' }}>
            <Breadcrumbs items={breadcrumbs} />

            {!isLoggedIn ? (
                /* Login View */
                <div style={{ maxWidth: '420px', margin: '40px auto', background: '#FFFFFF', padding: '35px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: 0 }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <i className="fas fa-user-shield" style={{ fontSize: '2.5rem', color: '#007BFF', marginBottom: '12px' }}></i>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>Admin Portal Login</h2>
                        <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '6px' }}>Sign in to manage student leads & applications</p>
                    </div>

                    {errorMsg && (
                        <div style={{ background: '#FEF2F2', borderLeft: '4px solid #EF4444', padding: '12px 16px', color: '#991B1B', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 600 }}>
                            <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i> {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                                Username
                            </label>
                            <input 
                                type="text"
                                required
                                value={credentials.username}
                                onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                                placeholder="Enter admin username"
                                style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', border: '1px solid #CBD5E1', borderRadius: 0, boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                                Password
                            </label>
                            <input 
                                type="password"
                                required
                                value={credentials.password}
                                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                placeholder="Enter admin password"
                                style={{ width: '100%', padding: '10px 14px', fontSize: '0.9rem', border: '1px solid #CBD5E1', borderRadius: 0, boxSizing: 'border-box' }}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{
                                padding: '10px 20px',
                                background: '#007BFF',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: 0,
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                marginTop: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-sign-in-alt"></i>}
                            {loading ? 'Authenticating...' : 'Login to Dashboard'}
                        </button>
                    </form>
                </div>
            ) : (
                /* Dashboard View */
                <div>
                    {/* Header bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '30px', background: '#FFFFFF', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                        <div>
                            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>
                                <i className="fas fa-user-shield" style={{ color: '#007BFF', marginRight: '10px' }}></i> Admin Lead Management
                            </h1>
                            <p style={{ fontSize: '0.9rem', color: '#64748B', margin: '4px 0 0' }}>Real-time student counseling applications & quiz responses</p>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                onClick={verifyAndFetchLeads}
                                style={{ padding: '8px 16px', background: '#F1F5F9', color: '#0F172A', border: 'none', borderRadius: 0, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                                <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i> Refresh
                            </button>
                            <button 
                                onClick={handleLogout}
                                style={{ padding: '8px 16px', background: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: 0, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </div>
                    </div>

                    {/* Metric Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '30px' }}>
                        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Inquiries</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>{totalLeads}</div>
                        </div>

                        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #007BFF' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>New Leads</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#007BFF', marginTop: '6px' }}>{newLeads}</div>
                        </div>

                        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #F59E0B' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Contacted</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F59E0B', marginTop: '6px' }}>{contactedLeads}</div>
                        </div>

                        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #10B981' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Admitted</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981', marginTop: '6px' }}>{admittedLeads}</div>
                        </div>
                    </div>

                    {/* Controls Bar */}
                    <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ flex: 1, minWidth: '240px' }}>
                            <input 
                                type="text"
                                placeholder="Search by name, phone, email, city..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '9px 14px', borderRadius: 0, border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <select 
                                value={streamFilter}
                                onChange={e => setStreamFilter(e.target.value)}
                                style={{ padding: '9px 14px', borderRadius: 0, border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 600 }}
                            >
                                <option value="all">All Streams</option>
                                <option value="science">Science</option>
                                <option value="commerce">Commerce</option>
                                <option value="arts">Arts</option>
                                <option value="engineering">Engineering</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ background: '#FFFFFF', borderRadius: 0, overflowX: 'auto', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                    <th style={{ padding: '14px 16px' }}>Date</th>
                                    <th style={{ padding: '14px 16px' }}>Student Info</th>
                                    <th style={{ padding: '14px 16px' }}>Stream / Score</th>
                                    <th style={{ padding: '14px 16px' }}>Recommended Unis</th>
                                    <th style={{ padding: '14px 16px' }}>Status</th>
                                    <th style={{ padding: '14px 16px' }}>Notes</th>
                                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeads.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                                            No student lead records found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLeads.map(lead => (
                                        <tr key={lead._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '14px 16px', color: '#64748B', whiteSpace: 'nowrap' }}>
                                                {new Date(lead.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>

                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ fontWeight: 700, color: '#0F172A' }}>{lead.studentName || 'Anonymous'}</div>
                                                <div style={{ color: '#007BFF', fontWeight: 600 }}><i className="fas fa-phone" style={{ fontSize: '0.75rem', marginRight: '4px' }}></i>{lead.phone}</div>
                                                <div style={{ color: '#64748B' }}>{lead.email}</div>
                                                {lead.city && <div style={{ color: '#475569', fontSize: '0.8rem' }}><i className="fas fa-map-marker-alt" style={{ marginRight: '4px' }}></i>{lead.city}</div>}
                                            </td>

                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ textTransform: 'capitalize', fontWeight: 700, color: '#0F172A' }}>
                                                    {lead.stream || 'N/A'}
                                                </div>
                                                {lead.quizScore && (
                                                    <div style={{ color: '#10B981', fontWeight: 700, fontSize: '0.8rem', marginTop: '4px' }}>
                                                        Score: {lead.quizScore}%
                                                    </div>
                                                )}
                                            </td>

                                            <td style={{ padding: '14px 16px', maxWidth: '220px' }}>
                                                {lead.recommendedUniversities && lead.recommendedUniversities.length > 0 ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        {lead.recommendedUniversities.slice(0, 3).map((rec, rIdx) => {
                                                            const uName = rec.universityId?.name || rec.name || 'University Match';
                                                            return (
                                                                <span key={rIdx} style={{ fontSize: '0.78rem', background: '#F1F5F9', padding: '3px 6px', color: '#334155', fontWeight: 600 }}>
                                                                    {uName} ({rec.matchPercentage || 95}%)
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#94A3B8' }}>General Counseling</span>
                                                )}
                                            </td>

                                            <td style={{ padding: '14px 16px' }}>
                                                <select 
                                                    value={lead.status || 'New'}
                                                    onChange={e => handleStatusChange(lead._id, e.target.value, lead.notes)}
                                                    style={{
                                                        padding: '6px 10px',
                                                        borderRadius: 0,
                                                        border: '1px solid #CBD5E1',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 700,
                                                        background: lead.status === 'Admitted' ? '#DEF7EC' : lead.status === 'Contacted' ? '#FEF3C7' : '#EFF6FF',
                                                        color: lead.status === 'Admitted' ? '#03543F' : lead.status === 'Contacted' ? '#92400E' : '#1E40AF'
                                                    }}
                                                >
                                                    <option value="New">New</option>
                                                    <option value="Contacted">Contacted</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Admitted">Admitted</option>
                                                    <option value="Closed">Closed</option>
                                                </select>
                                            </td>

                                            <td style={{ padding: '14px 16px', maxWidth: '180px' }}>
                                                {editingNoteId === lead._id ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                        <textarea 
                                                            rows="2"
                                                            value={noteInput}
                                                            onChange={e => setNoteInput(e.target.value)}
                                                            style={{ width: '100%', fontSize: '0.75rem', padding: '4px', borderRadius: 0, border: '1px solid #CBD5E1' }}
                                                        />
                                                        <div style={{ display: 'flex', gap: '4px' }}>
                                                            <button 
                                                                onClick={() => handleSaveNote(lead._id, lead.status)}
                                                                style={{ padding: '3px 8px', background: '#10B981', color: '#FFF', border: 'none', fontSize: '0.75rem', cursor: 'pointer' }}
                                                            >
                                                                Save
                                                            </button>
                                                            <button 
                                                                onClick={() => setEditingNoteId(null)}
                                                                style={{ padding: '3px 8px', background: '#64748B', color: '#FFF', border: 'none', fontSize: '0.75rem', cursor: 'pointer' }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div 
                                                        onClick={() => { setEditingNoteId(lead._id); setNoteInput(lead.notes || ''); }}
                                                        style={{ cursor: 'pointer', color: lead.notes ? '#334155' : '#94A3B8', fontSize: '0.8rem', fontStyle: lead.notes ? 'normal' : 'italic' }}
                                                    >
                                                        {lead.notes || 'Add note...'}
                                                    </div>
                                                )}
                                            </td>

                                            <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                <button 
                                                    onClick={() => handleDeleteLead(lead._id)}
                                                    style={{ padding: '6px 12px', background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: 0, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
