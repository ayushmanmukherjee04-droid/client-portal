// components/Navbar.js
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
      setIsLoggedIn(!!match);
    };

    checkLogin();
    const interval = setInterval(checkLogin, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="nav" style={{ position: 'relative' }}>
      <Link href="/" className="nav-brand">
        ClientPortal
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: 'auto' }}>
        {/* Auth Section - Always Visible */}
        {isLoggedIn ? (
          <Link href="/client/profile" className="nav-link" style={{ marginLeft: 0 }}>
            Profile
          </Link>
        ) : (
          <Link href="/login">
            <button className="button" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
              Login
            </button>
          </Link>
        )}

        {/* Toggle Menu Button */}
        <button
          className="btn-ghost"
          style={{ padding: "0.5rem", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '2rem',
          background: 'var(--card-bg)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: 'var(--glass-shadow)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          minWidth: '200px',
          zIndex: 1000
        }}>
          <Link href="/client/dashboard" className="nav-link" style={{ marginLeft: 0 }} onClick={() => setIsMenuOpen(false)}>
            Dashboard
          </Link>
          <Link href="/client/apps" className="nav-link" style={{ marginLeft: 0 }} onClick={() => setIsMenuOpen(false)}>
            Apps
          </Link>
          <Link href="/client/users" className="nav-link" style={{ marginLeft: 0 }} onClick={() => setIsMenuOpen(false)}>
            Users
          </Link>
          <Link href="/client/roles" className="nav-link" style={{ marginLeft: 0 }} onClick={() => setIsMenuOpen(false)}>
            Roles
          </Link>
          <Link href="/client/settings" className="nav-link" style={{ marginLeft: 0 }} onClick={() => setIsMenuOpen(false)}>
            Settings
          </Link>
        </div>
      )}
    </nav>
  );
}
