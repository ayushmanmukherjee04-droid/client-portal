// Edit App Page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../../components/Modal';
import { apiGet, apiPut } from '../../../../utils/apiClient';

export default function EditApp() {
    const router = useRouter();
    const { id } = router.query;
    const [formData, setFormData] = useState({
        app_name: '',
        description: '',
        secret: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingApp, setFetchingApp] = useState(true);

    useEffect(() => {
        if (id) {
            fetchApp();
        }
    }, [id]);

    const fetchApp = async () => {
        setFetchingApp(true);
        const result = await apiGet(`getAppById?app_id=${id}`);

        if (result.success && result.data) {
            setFormData({
                app_name: result.data.app_name || '',
                description: result.data.description || '',
                secret: result.data.secret || '',
            });
        } else {
            setError(result.error || 'Failed to fetch app details');
        }
        setFetchingApp(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await apiPut('putUpdateApps', { ...formData, app_id: id });
        setLoading(false);

        if (result.success) {
            router.push('/client/apps');
        } else {
            setError(result.error || 'Failed to update app');
        }
    };

    if (fetchingApp) {
        return (
            <>
                <Navbar />
                <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Loading app details...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1>Edit App</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Update your application details
                    </p>
                </div>

                <div className="card" style={{ maxWidth: '600px' }}>
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

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="small" style={{ display: 'block', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>
                                App Name *
                            </label>
                            <input
                                name="app_name"
                                className="input"
                                placeholder="My Awesome App"
                                value={formData.app_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="small" style={{ display: 'block', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>
                                Description
                            </label>
                            <textarea
                                name="description"
                                className="input"
                                placeholder="Brief description of your app..."
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label className="small" style={{ display: 'block', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>
                                Secret Key *
                            </label>
                            <input
                                name="secret"
                                type="password"
                                className="input"
                                placeholder="Enter a secure secret key"
                                value={formData.secret}
                                onChange={handleChange}
                                required
                            />
                            <small style={{ color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>
                                Leave blank to keep current secret
                            </small>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                className="btn-ghost"
                                onClick={() => router.push('/client/apps')}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="button"
                                disabled={loading}
                                style={{ flex: 1 }}
                            >
                                {loading ? 'Updating...' : 'Update App'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
