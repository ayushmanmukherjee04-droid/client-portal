// Reusable SearchBar Component
export default function SearchBar({ placeholder = "Search...", value, onChange, onClear }) {
    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <input
                type="text"
                className="input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{ paddingRight: value ? '3rem' : '1rem' }}
            />
            {value && (
                <button
                    onClick={onClear}
                    style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '1.25rem',
                        padding: '0.25rem 0.5rem',
                    }}
                >
                    ×
                </button>
            )}
        </div>
    );
}
