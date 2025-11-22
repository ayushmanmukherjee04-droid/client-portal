// Reusable Modal Component
import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeMap = {
        sm: '400px',
        md: '600px',
        lg: '800px',
        xl: '1000px',
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '2rem',
            }}
            onClick={onClose}
        >
            <div
                className="card"
                style={{
                    width: '100%',
                    maxWidth: sizeMap[size],
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0 }}>{title}</h2>
                    <button
                        className="btn-ghost"
                        onClick={onClose}
                        style={{
                            padding: '0.5rem',
                            fontSize: '1.5rem',
                            lineHeight: 1,
                            minWidth: 'auto',
                        }}
                    >
                        ×
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
