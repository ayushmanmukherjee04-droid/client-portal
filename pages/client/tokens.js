// Token Management Page
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';
import { apiGet, apiPost } from '../../utils/apiClient';

export default function Tokens() {
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [apps, setApps] = useState([]);
    const [selectedAppId, setSelectedAppId] = useState('');

    useEffect(() => {
        fetchApps();
        fetchTokens(); // Initial fetch for user tokens
    }, []);

    const fetchApps = async () => {
        const result = await apiGet('getApp');
        if (result.success) {
            setApps(Array.isArray(result.data) ? result.data : []);
        }
    };

    const fetchTokens = async (appId = null) => {
        setLoading(true);
        setError('');
        setTokens([]);

        let result;
        if (appId) {
            result = await apiPost('getUserWithTokenByApp', { app_id: appId });
        } else {
            result = await apiGet('getUserWithToken');
        }

        if (result.success) {
            setTokens(Array.isArray(result.data) ? result.data : []);
        } else {
            setError(result.error || 'Failed to fetch tokens');
        }
        setLoading(false);
    };

    const handleAppChange = (e) => {
        const appId = e.target.value;
        setSelectedAppId(appId);
        fetchTokens(appId);
    };

    const columns = [
        { key: 'id', label: 'User ID' },
        { key: 'first_name', label: 'First Name' },
        { key: 'email', label: 'Email' },
        { key: 'app_name', label: 'App' },
        {
            key: 'access_token',
            label: 'Access Token',
            render: (val) => (
                <div style={{
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    background: 'rgba(0,0,0,0.2)',
                    padding: '4px',
                    borderRadius: '4px'
                }} title={val}>
                    {val}
                </div>
            )
        },
    ];

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1>Token Management</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        View user access tokens
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#fca5a5',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ marginBottom: '2rem' }}>
                    <label className="small" style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Filter by App
                    </label>
                    <select
                        className="input"
                        style={{ maxWidth: '300px' }}
                        value={selectedAppId}
                        onChange={handleAppChange}
                    >
                        <option value="">All Apps (User Tokens)</option>
                        {apps.map(app => (
                            <option key={app.id} value={app.id}>
                                {app.app_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="card">
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Loading tokens...
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            data={tokens}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
