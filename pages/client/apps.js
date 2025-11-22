// pages/client/apps.js
import Navbar from "../../components/Navbar";
import cookie from "cookie";

export async function getServerSideProps(ctx) {
  const protocol = ctx.req.headers["x-forwarded-proto"] || "http";
  const host = ctx.req.headers.host;

  // call our proxy → which uses MOCK if USE_MOCK=true
  const url = `${protocol}://${host}/api/proxy/getApp`;

  const resp = await fetch(url, {
    headers: { cookie: ctx.req.headers.cookie || "" },
  });

  const json = await resp.json();

  return {
    props: {
      apps: json.data || [],
    },
  };
}

export default function Apps({ apps }) {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h2>Your Apps</h2>

          {apps.length === 0 && (
            <p className="small" style={{ marginTop: 12 }}>
              No apps found.
            </p>
          )}

          <ul style={{ marginTop: 16, paddingLeft: 0, listStyle: "none" }}>
            {apps.map((app) => (
              <li
                key={app.id}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {app.app_name || app.name}
                </div>

                <div className="small" style={{ marginBottom: 8 }}>
                  {app.descripition || app.description || "No description"}
                </div>

                <a
                  href={`/client/apps/${app.id}/connect`}
                  className="button"
                  style={{ textDecoration: "none", padding: "6px 12px" }}
                >
                  Connect
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
