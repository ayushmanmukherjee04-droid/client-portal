// Apps Management Page - Redesigned
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';
import { apiGet, apiPost, apiDelete } from '../../utils/apiClient';

export default function Apps() {
  const router = useRouter();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appUrlData, setAppUrlData] = useState(null);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    setLoading(true);
    setError('');

    const result = await apiGet('getApp');

    if (result.success) {
      setApps(Array.isArray(result.data) ? result.data : []);
    } else {
      setError(result.error || 'Failed to fetch apps');
      setApps([]);
    }
    setLoading(false);
  };

  const handleGetUrlAndToken = async (app) => {
    const result = await apiPost('getUrlAndToken', { app_id: app.id });

    if (result.success) {
      setAppUrlData(result.data);
      setSelectedApp(app);
      setShowUrlModal(true);
    } else {
      setError(result.error || 'Failed to get URL and token');
    }
  };

  const handleDeleteApp = async () => {
    if (!selectedApp) return;

    const result = await apiDelete('deleteApp', null, { appId: selectedApp.id });

    if (result.success) {
      setShowDeleteModal(false);
      // Mark app as deleted locally instead of refetching
      setApps(apps.map(app =>
        app.id === selectedApp.id ? { ...app, _deleted: true } : app
      ));
      setSelectedApp(null);
    } else {
      setError(result.error || 'Failed to delete app');
    }
  };

  const openDeleteModal = (app) => {
    setSelectedApp(app);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Apps Management</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Manage your applications and integrations
            </p>
          </div>
          <button className="button" onClick={() => router.push('/client/apps/create')}>
            + Create App
          </button>
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

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading apps...
          </div>
        ) : apps.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No apps found</p>
            <button className="button" onClick={() => router.push('/client/apps/create')}>
              Create Your First App
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {apps.map((app) => (
              <div key={app.id} className="card" style={{ position: 'relative', opacity: app._deleted ? 0.7 : 1 }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{app.app_name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  {app.description || 'No description'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {app._deleted ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '0.75rem',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}>
                      App Removed
                    </div>
                  ) : (
                    <>
                      <button
                        className="button"
                        onClick={() => handleGetUrlAndToken(app)}
                        style={{ width: '100%' }}
                      >
                        Get URL & Token
                      </button>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <button
                          className="btn-ghost"
                          onClick={() => router.push(`/client/apps/${app.id}/edit`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-ghost"
                          onClick={() => openDeleteModal(app)}
                          style={{ borderColor: '#ef4444', color: '#ef4444' }}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* URL & Token Modal */}
      <Modal
        isOpen={showUrlModal}
        onClose={() => {
          setShowUrlModal(false);
          setAppUrlData(null);
        }}
        title={`${selectedApp?.app_name} - Access Details`}
      >
        {appUrlData && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="small" style={{ display: 'block', marginBottom: '0.5rem' }}>URL</label>
              <div style={{
                background: 'var(--card-bg)',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                wordBreak: 'break-all',
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}>
                {appUrlData.url || 'N/A'}
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="small" style={{ display: 'block', marginBottom: '0.5rem' }}>Access Token</label>
              <div style={{
                background: 'var(--card-bg)',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                wordBreak: 'break-all',
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}>
                {appUrlData.token || 'N/A'}
              </div>
            </div>
            <button className="button" onClick={() => setShowUrlModal(false)} style={{ width: '100%' }}>
              Close
            </button>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete App"
        size="sm"
      >
        <p>
          Are you sure you want to delete <strong>{selectedApp?.app_name}</strong>? This action cannot be undone.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button className="btn-ghost" onClick={() => setShowDeleteModal(false)} style={{ flex: 1 }}>
            Cancel
          </button>
          <button
            className="button"
            onClick={handleDeleteApp}
            style={{ flex: 1, background: '#ef4444' }}
          >
            Delete App
          </button>
        </div>
      </Modal>
    </>
  );
}
