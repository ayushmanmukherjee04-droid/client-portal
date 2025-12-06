// pages/client/dashboard.js
import cookie from "cookie";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import API_CONFIG from "../../config/api";

export async function getServerSideProps(ctx) {
  const cookies = cookie.parse(ctx.req.headers.cookie || "");
  console.log("Dashboard getServerSideProps cookies:", Object.keys(cookies));

  if (!cookies.access_token) {
    console.log("No access_token found, redirecting to login");
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }
  return { props: {} };
}

export default function Dashboard() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      // Force reload to clear cookies/state if needed, or just push to login
      router.push('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      router.push('/login'); // Redirect anyway
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h1 style={{ marginBottom: 8 }}>Client Dashboard</h1>
          <p className="small" style={{ marginBottom: 20 }}>
            Welcome User! Manage your apps, view profile,
            generate access tokens and more.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: 'wrap' }}>
            <a href="/client/apps" className="button" style={{ textDecoration: "none" }}>
              View Apps
            </a>

            <a href="/client/profile" className="btn-ghost" style={{ textDecoration: "none" }}>
              Profile
            </a>

            <a href="/client/tokens" className="btn-ghost" style={{ textDecoration: "none" }}>
              Tokens
            </a>

            <button
              onClick={handleLogout}
              className="btn-ghost"
              style={{ color: '#ef4444', borderColor: '#ef4444' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
