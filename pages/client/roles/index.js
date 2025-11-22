// Roles Management Page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import Table from '../../../components/Table';
import Modal from '../../../components/Modal';
import SearchBar from '../../../components/SearchBar';
import { apiGet, apiPost, apiPut, apiDelete } from '../../../utils/apiClient';

export default function Roles() {
    const router = useRouter();
    const [roles, setRoles] = useState([]);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [roleFormData, setRoleFormData] = useState({
        name: '',
        description: '',
        app_id: '',
    });
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        filterRoles();
    }, [roles, searchTerm]);

    const fetchRoles = async () => {
        setLoading(true);
        setError('');

        const result = await apiGet('getRoles');

        if (result.success) {
            setRoles(Array.isArray(result.data) ? result.data : []);
        } else {
            setError(result.error || 'Failed to fetch roles');
            setRoles([]);
        }
        setLoading(false);
    };

    const filterRoles = () => {
        if (!searchTerm) {
            setFilteredRoles(roles);
            return;
        }

        const filtered = roles.filter(role =>
            role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            role.app_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRoles(filtered);
    };

    const openCreateModal = () => {
        setRoleFormData({ name: '', description: '', app_id: '' });
        setIsEdit(false);
        setShowRoleModal(true);
    };

    const openEditModal = (role) => {
        setRoleFormData({
            name: role.name || '',
            description: role.description || '',
            app_id: role.app_id || '',
        });
        setSelectedRole(role);
        setIsEdit(true);
        setShowRoleModal(true);
    };

    const handleRoleSubmit = async () => {
        setError('');

        const endpoint = isEdit ? 'putUpdateRole' : 'postCreateRole';
        const payload = isEdit
            ? { ...roleFormData, role_id: selectedRole.id }
            : roleFormData;

        const result = isEdit
            ? await apiPut(endpoint, payload)
            : await apiPost(endpoint, payload);

        if (result.success) {
            setShowRoleModal(false);
            fetchRoles();
        } else {
            setError(result.error || `Failed to ${isEdit ? 'update' : 'create'} role`);
        }
    };

    const handleDeleteRole = async () => {
        if (!selectedRole) return;

        const result = await apiDelete('deleteRole', { role_id: selectedRole.id });

        if (result.success) {
            setShowDeleteModal(false);
            setSelectedRole(null);
            fetchRoles();
        } else {
            setError(result.error || 'Failed to delete role');
        }
    };

    const openAssignRoleModal = (role) => {
        setSelectedRole(role);
        setShowAssignModal(true);
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Role Name' },
        { key: 'description', label: 'Description' },
        { key: 'app_name', label: 'App' },
        {
            key: 'createdAt',
            label: 'Created',
            render: (value) => value ? new Date(value).toLocaleDateString() : '-'
        },
    ];

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: '2rem' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Roles Management</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            Create and manage user roles and permissions
                        </p>
                    </div>
                    <button className="button" onClick={openCreateModal}>
                        + Create Role
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

                <div style={{ marginBottom: '2rem' }}>
                    <SearchBar
                        placeholder="Search by role name or app..."
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onClear={() => setSearchTerm('')}
                    />
                </div>

                <div className="card">
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Loading roles...
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            data={filteredRoles}
                            actions={(role) => (
                                <>
                                    <button
                                        className="btn-ghost"
                                        onClick={() => openAssignRoleModal(role)}
                                        style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                                    >
                                        Assign
                                    </button>
                                    <button
                                        className="btn-ghost"
                                        onClick={() => openEditModal(role)}
                                        style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-ghost"
                                        onClick={() => {
                                            setSelectedRole(role);
                                            setShowDeleteModal(true);
                                        }}
                                        style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', borderColor: '#ef4444', color: '#ef4444' }}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        />
                    )}
                </div>
            </div>

            {/* Create/Edit Role Modal */}
            <Modal
                isOpen={showRoleModal}
                onClose={() => setShowRoleModal(false)}
                title={isEdit ? 'Edit Role' : 'Create New Role'}
            >
                <form onSubmit={(e) => { e.preventDefault(); handleRoleSubmit(); }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="small" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Role Name *
                        </label>
                        <input
                            className="input"
                            value={roleFormData.name}
                            onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="small" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Description
                        </label>
                        <textarea
                            className="input"
                            value={roleFormData.description}
                            onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                            rows="3"
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label className="small" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            App ID *
                        </label>
                        <input
                            className="input"
                            type="number"
                            value={roleFormData.app_id}
                            onChange={(e) => setRoleFormData({ ...roleFormData, app_id: e.target.value })}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" className="btn-ghost" onClick={() => setShowRoleModal(false)} style={{ flex: 1 }}>
                            Cancel
                        </button>
                        <button type="submit" className="button" style={{ flex: 1 }}>
                            {isEdit ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Role"
                size="sm"
            >
                <p>
                    Are you sure you want to delete <strong>{selectedRole?.name}</strong>?
                </p>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <button className="btn-ghost" onClick={() => setShowDeleteModal(false)} style={{ flex: 1 }}>
                        Cancel
                    </button>
                    <button
                        className="button"
                        onClick={handleDeleteRole}
                        style={{ flex: 1, background: '#ef4444' }}
                    >
                        Delete
                    </button>
                </div>
            </Modal>

            {/* Assign Role Modal */}
            <Modal
                isOpen={showAssignModal}
                onClose={() => setShowAssignModal(false)}
                title={`Assign Role: ${selectedRole?.name}`}
            >
                <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                    Role assignment functionality would connect to user selection and assignment API
                </p>
                <button className="button" onClick={() => setShowAssignModal(false)} style={{ width: '100%' }}>
                    Close
                </button>
            </Modal>
        </>
    );
}
