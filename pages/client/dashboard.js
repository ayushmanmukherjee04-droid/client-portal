// pages/client/dashboard.js
import cookie from "cookie";
import Navbar from "../../components/Navbar";

export async function getServerSideProps(ctx) {
  const cookies = cookie.parse(ctx.req.headers.cookie || "");
  if (!cookies.access_token) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }
  return { props: {} };
}

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h1 style={{ marginBottom: 8 }}>Client Dashboard</h1>
          <p className="small" style={{ marginBottom: 20 }}>
            Welcome to your client area. Manage your apps, view profile,
            generate access tokens and more.
          </p>

          <div style={{ display: "flex", gap: 16 }}>
            <a href="/client/apps" className="button" style={{ textDecoration: "none" }}>
              View Apps
            </a>

            <a href="/client/profile" className="btn-ghost" style={{ textDecoration: "none" }}>
              Profile
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
