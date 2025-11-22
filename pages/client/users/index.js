// Users Management Page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';
import SearchBar from '../../components/SearchBar';
import Modal from '../../components/Modal';
import { apiGet, apiPost } from '../../utils/apiClient';

export default function Users() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, active, inactive, banned
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionType, setActionType] = useState(''); // ban, unban

    useEffect(() => {
        fetchUsers();
    }, [filterType]);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm]);

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

        const result = await apiGet(endpoint);

        if (result.success) {
            setUsers(Array.isArray(result.data) ? result.data : []);
        } else {
            setError(result.error || 'Failed to fetch users');
            setUsers([]);
        }
        setLoading(false);
    };

    const filterUsers = () => {
        if (!searchTerm) {
            setFilteredUsers(users);
            return;
        }

        const filtered = users.filter(user =>
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleBanUnban = async () => {
        if (!selectedUser) return;

        const endpoint = actionType === 'ban' ? 'banUser' : 'unbanUser';
        const result = await apiPost(endpoint, {
            user_id: selectedUser.id,
            app_id: selectedUser.app_id || 1, // Assuming app_id from user data
        });

        if (result.success) {
            setShowConfirmModal(false);
            setSelectedUser(null);
            fetchUsers();
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
        { key: 'email', label: 'Email' },
        { key: 'mobile_no', label: 'Mobile' },
        { key: 'app_name', label: 'App' },
        {
            key: 'active',
            label: 'Status',
            render: (value) => (
                <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    background: value ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: value ? '#22c55e' : '#ef4444',
                }}>
                    {value ? 'Active' : 'Inactive'}
                </span>
            ),
        },
    ];

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1>User Management</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        View and manage all users in your system
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

                <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <SearchBar
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onClear={() => setSearchTerm('')}
                    />

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
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

                <div className="card">
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Loading users...
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
