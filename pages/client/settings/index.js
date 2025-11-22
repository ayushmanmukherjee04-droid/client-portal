// Settings Page - Secrets Management
import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import { apiGet, apiPost } from '../../../utils/apiClient';

export default function Settings() {
    const [apps, setApps] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [secret, setSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchApps();
    }, []);

    const fetchApps = async () => {
        const result = await apiGet('getApp');
        if (result.success) {
            setApps(Array.isArray(result.data) ? result.data : []);
        }
    };

    const fetchSecret = async (appId) => {
        setLoading(true);
        setError('');
        setSuccess('');

        const result = await apiGet(`getSecret?app_id=${appId}`);

        if (result.success && result.data) {
            setSecret(result.data.secret || '');
        } else {
            setError(result.error || 'Failed to fetch secret');
        }
        setLoading(false);
    };

    const handleAppSelect = (app) => {
        setSelectedApp(app);
        fetchSecret(app.id);
    };

    const handleUpdateSecret = async () => {
        if (!selectedApp) return;

        setLoading(true);
        setError('');
        setSuccess('');

        const result = await apiPost('postAddAndUpdateSecret', {
            app_id: selectedApp.id,
            secret,
        });

        if (result.success) {
            setSuccess('Secret updated successfully');
        } else {
            setError(result.error || 'Failed to update secret');
        }
        setLoading(false);
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1>Settings</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Manage app secrets and security settings
                    </p>
                </div>

                <div className="card" style={{ maxWidth: '800px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>App Secrets Management</h3>

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

                    {success && (
                        <div style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            color: '#86efac',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                        }}>
                            {success}
                        </div>
                    )}

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="small" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Select App
                        </label>
                        <select
                            className="input"
                            value={selectedApp?.id || ''}
                            onChange={(e) => {
                                const app = apps.find(a => a.id === parseInt(e.target.value));
                                if (app) handleAppSelect(app);
                            }}
                        >
                            <option value="">-- Select an app --</option>
                            {apps.map(app => (
                                <option key={app.id} value={app.id}>
                                    {app.app_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedApp && (
                        <>
                            <div style={{ marginBottom: '2rem' }}>
                                <label className="small" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                    Secret Key
                                </label>
                                <input
                                    type="password"
                                    className="input"
                                    value={secret}
                                    onChange={(e) => setSecret(e.target.value)}
                                    placeholder="Enter secret key"
                                />
                                <small style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>
                                    This secret is used for API authentication
                                </small>
                            </div>

                            <button
                                className="button"
                                onClick={handleUpdateSecret}
                                disabled={loading}
                                style={{ width: '100%' }}
                            >
                                {loading ? 'Updating...' : 'Update Secret'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
