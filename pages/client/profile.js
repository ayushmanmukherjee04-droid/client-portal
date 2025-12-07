// pages/client/profile.js
import cookie from "cookie";
import Navbar from "../../components/Navbar";


export async function getServerSideProps(ctx) {
  try {
    const cookies = cookie.parse(ctx.req.headers.cookie || "");
    const token = cookies.access_token;

    if (!token) {
      return {
        redirect: { destination: "/login", permanent: false },
      };
    }

    // Decode JWT to get client info
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());

      // Use null instead of undefined for Next.js serialization
      const profile = {
        id: decoded.id || decoded.client_id || null,
        email: decoded.email || null,
        firstName: decoded.firstName || decoded.first_name || null,
        lastName: decoded.lastName || decoded.last_name || null,
        mobileNumber: decoded.mobileNumber || decoded.mobile_number || null,
        app: decoded.app || null,
        createdAt: decoded.createdAt || decoded.created_at || null
      };

      return { props: { profile } };
    } catch (decodeError) {
      console.error("Failed to decode token:", decodeError);
      return {
        redirect: { destination: "/login", permanent: false },
      };
    }

  } catch (error) {
    console.error("Profile SSP error:", error);
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }
}

export default function Profile({ profile }) {
  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              margin: '0 auto 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 10px 25px rgba(56, 189, 248, 0.3)'
            }}>
              {(profile.firstName && profile.firstName[0]) ? profile.firstName[0] : 'U'}
              {(profile.lastName && profile.lastName[0]) ? profile.lastName[0] : ''}
            </div>
            <h1 style={{ marginBottom: '0.5rem' }}>
              {profile.firstName || 'User'} {profile.lastName || ''}
            </h1>
            <p className="small" style={{ fontSize: '1rem' }}>{profile.email || 'No email'}</p>
            {profile.app_name && (
              <div style={{ marginTop: '1rem', background: 'var(--card-bg)', padding: '0.5rem 1rem', borderRadius: '20px', display: 'inline-block', border: '1px solid var(--glass-border)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginRight: '0.5rem' }}>App:</span>
                <span style={{ fontWeight: '500' }}>{profile.app_name}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gap: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Member Since</span>
              <span style={{ fontWeight: '500' }}>
                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Account Status</span>
              <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: '500' }}>Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>User ID</span>
              <span className="small">{profile.id || 'N/A'}</span>
            </div>
          </div>

          <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
            <button className="button" style={{ flex: 1 }}>Edit Profile</button>
            <button
              className="btn-ghost"
              style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444' }}
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
