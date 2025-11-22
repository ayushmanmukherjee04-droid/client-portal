// pages/client/profile.js
import cookie from "cookie";

export async function getServerSideProps(ctx) {
  const protocol = ctx.req.headers["x-forwarded-proto"] || "http";
  const host = ctx.req.headers.host;
  const url = `${protocol}://${host}/api/proxy/getProfile`;
  const resp = await fetch(url, { headers: { cookie: ctx.req.headers.cookie || "" } });
  const json = await resp.json();
  return { props: { profile: json.data || null } };
}

export default function Profile({ profile }) {
  return (
    <div style={{ padding: 24 }}>
      <h2>Profile</h2>
      {profile ? (
        <div>
          <p><b>Name:</b> {profile.first_name} {profile.last_name}</p>
          <p><b>Email:</b> {profile.email}</p>
          <p><b>App:</b> {profile.app_name || profile.app}</p>
        </div>
      ) : (
        <p>No profile data</p>
      )}
    </div>
  );
}
