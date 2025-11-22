// Reusable Table Component
import { useState } from 'react';

export default function Table({ columns, data, onRowClick, actions }) {
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const handleSort = (columnKey) => {
        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(columnKey);
            setSortDirection('asc');
        }
    };

    const sortedData = sortColumn
        ? [...data].sort((a, b) => {
            const aVal = a[sortColumn];
            const bVal = b[sortColumn];
            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        })
        : data;

    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                onClick={() => col.sortable !== false && handleSort(col.key)}
                                style={{
                                    padding: '1rem',
                                    textAlign: 'left',
                                    cursor: col.sortable !== false ? 'pointer' : 'default',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                }}
                            >
                                {col.label}
                                {sortColumn === col.key && (
                                    <span style={{ marginLeft: '0.5rem' }}>
                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </th>
                        ))}
                        {actions && <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + (actions ? 1 : 0)}
                                style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}
                            >
                                No data available
                            </td>
                        </tr>
                    ) : (
                        sortedData.map((row, idx) => (
                            <tr
                                key={row.id || idx}
                                onClick={() => onRowClick && onRowClick(row)}
                                style={{
                                    borderBottom: '1px solid var(--glass-border)',
                                    cursor: onRowClick ? 'pointer' : 'default',
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(135, 206, 250, 0.05)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                                {columns.map((col) => (
                                    <td key={col.key} style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                                        {col.render ? col.render(row[col.key], row) : row[col.key] || '-'}
                                    </td>
                                ))}
                                {actions && (
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            {actions(row)}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
