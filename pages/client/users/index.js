// Users Management Page - Pure AaaS Model (Read-only + Management)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import Table from '../../../components/Table';
import SearchBar from '../../../components/SearchBar';
import Modal from '../../../components/Modal';
import { apiGet, apiPost } from '../../../utils/apiClient';

export default function Users() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [apps, setApps] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, active, inactive, banned
    const [selectedApp, setSelectedApp] = useState('all'); // Filter by app
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionType, setActionType] = useState(''); // ban, unban

    // Statistics
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        banned: 0
    });

    useEffect(() => {
        fetchUsers();
        fetchApps();
    }, [filterType]);

    useEffect(() => {
        filterUsers();
        calculateStats();
    }, [users, searchTerm, selectedApp]);

    const fetchApps = async () => {
        const result = await apiGet('getApp');
        if (result.success) {
            setApps(Array.isArray(result.data) ? result.data : []);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        setError('');

        let endpoint;
        switch (filterType) {
            case 'active':
                endpoint = 'getActiveUser';
                break;
            case 'inactive':
                endpoint = 'getInactiveUser';
                break;
            case 'banned':
                endpoint = 'getBannedUser';
                break;
            default:
                endpoint = 'getAllUser';
        }

        console.log('Fetching users from endpoint:', endpoint);
        const result = await apiGet(endpoint);
        console.log('Fetch result:', result);

        if (result.success) {
            setUsers(Array.isArray(result.data) ? result.data : []);
        } else {
            console.error('Fetch error:', result.error);
            setError(result.error || 'Failed to fetch users');
            setUsers([]);
        }
        setLoading(false);
    };

    const calculateStats = () => {
        const allUsers = users;
        setStats({
            total: allUsers.length,
            active: allUsers.filter(u => u.active && !u.status?.includes('banned')).length,
            inactive: allUsers.filter(u => !u.active && !u.status?.includes('banned')).length,
            banned: allUsers.filter(u => u.status?.includes('banned')).length
        });
    };

    const filterUsers = () => {
        let filtered = users;

        // Filter by app
        if (selectedApp !== 'all') {
            filtered = filtered.filter(user => user.app_name === selectedApp);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredUsers(filtered);
    };


    const handleBanUnban = async () => {
        if (!selectedUser) return;

        const endpoint = actionType === 'ban' ? 'banUser' : 'unbanUser';
        const result = await apiPost(endpoint, {
            user_id: selectedUser.id,
            app_id: selectedUser.app_id || 1,
        });

        if (result.success) {
            setSuccessMsg(`User ${actionType === 'ban' ? 'banned' : 'unbanned'} successfully`);
            setShowConfirmModal(false);
            setSelectedUser(null);
            fetchUsers();
            setTimeout(() => setSuccessMsg(''), 3000);
        } else {
            setError(result.error || `Failed to ${actionType} user`);
        }
    };

    const openBanModal = (user) => {
        setSelectedUser(user);
        setActionType('ban');
        setShowConfirmModal(true);
    };

    const openUnbanModal = (user) => {
        setSelectedUser(user);
        setActionType('unban');
        setShowConfirmModal(true);
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'first_name', label: 'First Name' },
        { key: 'last_name', label: 'Last Name' },
        {
            key: 'email',
            label: 'Email',
            render: (value) => (
                <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{value}</span>
            )
        },
        { key: 'mobile_no', label: 'Mobile' },
        { key: 'app_name', label: 'App' },
        {
            key: 'active',
            label: 'Status',
            render: (value, row) => {
                const isBanned = row.status?.includes('banned');
                const isActive = value && !isBanned;
                const status = isBanned ? 'Banned' : (isActive ? 'Active' : 'Inactive');
                const color = isBanned ? '#ef4444' : (isActive ? '#22c55e' : '#f59e0b');
                const bg = isBanned ? 'rgba(239, 68, 68, 0.1)' : (isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)');

                return (
                    <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        background: bg,
                        color: color,
                    }}>
                        {status}
                    </span>
                );
            },
        },
    ];

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: '2rem' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1>User Management</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Users who signup via your apps' API integration
                    </p>
                    <button
                        className="button"
                        onClick={() => setShowCreateModal(true)}
                        style={{ minWidth: '150px' }}
                    >
                        + Add User
                    </button>
                </div>

                {/* Success Message */}
                {successMsg && (
                    <div style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        color: '#86efac',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                    }}>
                        {successMsg}
                    </div>
                )}

                {/* Error Message */}
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

                {/* Statistics Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Users</div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6366f1' }}>{stats.total}</div>
                    </div>
                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', borderColor: 'rgba(34, 197, 94, 0.2)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Active</div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#22c55e' }}>{stats.active}</div>
                    </div>
                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 146, 60, 0.05) 100%)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Inactive</div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>{stats.inactive}</div>
                    </div>
                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Banned</div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444' }}>{stats.banned}</div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label className="small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Search</label>
                        <SearchBar
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={setSearchTerm}
                            onClear={() => setSearchTerm('')}
                        />
                    </div>

                    {/* App Filter */}
                    <select
                        className="input"
                        value={selectedApp}
                        onChange={(e) => setSelectedApp(e.target.value)}
                        style={{ minWidth: '150px', maxWidth: '200px' }}
                    >
                        <option value="all">All Apps</option>
                        {apps.map(app => (
                            <option key={app.id} value={app.app_name}>{app.app_name}</option>
                        ))}
                    </select>

                    {/* Status Filter Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                        <button
                            className={filterType === 'all' ? 'button' : 'btn-ghost'}
                            onClick={() => setFilterType('all')}
                        >
                            All
                        </button>
                        <button
                            className={filterType === 'active' ? 'button' : 'btn-ghost'}
                            onClick={() => setFilterType('active')}
                        >
                            Active
                        </button>
                        <button
                            className={filterType === 'inactive' ? 'button' : 'btn-ghost'}
                            onClick={() => setFilterType('inactive')}
                        >
                            Inactive
                        </button>
                        <button
                            className={filterType === 'banned' ? 'button' : 'btn-ghost'}
                            onClick={() => setFilterType('banned')}
                        >
                            Banned
                        </button>
                    </div>
                </div>

                {/* Users Table */}
                <div className="card">
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Loading users...
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                            <h3 style={{ marginBottom: '0.5rem' }}>No users found</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                {searchTerm || selectedApp !== 'all'
                                    ? 'Try adjusting your filters or search term'
                                    : 'Users will appear here when they signup via your app\'s API'
                                }
                            </p>
                            {!searchTerm && selectedApp === 'all' && (
                                <button className="button" onClick={() => setShowCreateModal(true)}>
                                    Create First User
                                </button>
                            )}
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            data={filteredUsers}
                            actions={(user) => (
                                <>
                                    {filterType !== 'banned' && (
                                        <button
                                            className="btn-ghost"
                                            onClick={() => openBanModal(user)}
                                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', borderColor: '#ef4444', color: '#ef4444' }}
                                        >
                                            Ban
                                        </button>
                                    )}
                                    {filterType === 'banned' && (
                                        <button
                                            className="btn-ghost"
                                            onClick={() => openUnbanModal(user)}
                                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', borderColor: '#22c55e', color: '#22c55e' }}
                                        >
                                            Unban
                                        </button>
                                    )}
                                </>
                            )}
                        />
                    )}
                </div>
            </div>

            {/* Ban/Unban Confirmation Modal */}
            <Modal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title={`${actionType === 'ban' ? 'Ban' : 'Unban'} User`}
                size="sm"
            >
                <p>
                    Are you sure you want to {actionType} <strong>{selectedUser?.email}</strong>?
                </p>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <button className="btn-ghost" onClick={() => setShowConfirmModal(false)} style={{ flex: 1 }}>
                        Cancel
                    </button>
                    <button
                        className="button"
                        onClick={handleBanUnban}
                        style={{ flex: 1, background: actionType === 'ban' ? '#ef4444' : '#22c55e' }}
                    >
                        {actionType === 'ban' ? 'Ban User' : 'Unban User'}
                    </button>
                </div>
            </Modal>
        </>
    );
}
