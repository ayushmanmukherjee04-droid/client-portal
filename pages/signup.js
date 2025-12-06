// pages/signup.js
import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import API_CONFIG from "../config/api";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    app: "",
    description: "",
    password: "",
    confirmPassword: "",
  });
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setSuccessMsg("");

    if (form.password !== form.confirmPassword) {
      setErr("Password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      console.log(API_CONFIG.getUrl('signup'))
      const r = await fetch(API_CONFIG.getUrl('signup'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: 'include', // Important: enables cookies from backend
      });

      const contentType = r.headers.get("content-type");
      let data;
      console.log(r)
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await r.json();
        console.log("Signup response data:", data);
      } else {
        const text = await r.text();
        console.error("Received non-JSON response:", text);
        throw new Error("Server returned non-JSON response (likely HTML error page)");
      }

      setLoading(false);

      if (data.status === 'success') {
        setSuccessMsg(data.message || "Signup successful. Redirecting...");
        setTimeout(() => router.push("/login"), 1200);
      } else {
        console.log("Signup failed data:", data);
        setErr(data.message || JSON.stringify(data) || "Signup failed");
      }
    } catch (error) {
      setLoading(false);
      setErr(error.message || "Network error");
    }
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ width: '100%', maxWidth: '700px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>

          {err && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {err}
            </div>
          )}
          {successMsg && (
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: '#86efac', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={submit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label className="small" style={{ display: 'block', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>First Name</label>
                <input
                  name="firstName"
                  placeholder="John"
                  className="input"
                  value={form.firstName}
                  onChange={onChange}
                  required
                />
              </div>
              <div>
                <label className="small" style={{ display: 'block', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>Last Name</label>
                <input
                  name="lastName"
                  placeholder="Doe"
                  className="input"
                  value={form.lastName}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label className="small" style={{ display: 'block', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>Email Address</label>
              <input
                name="email"
                placeholder="john@example.com"
                className="input"
                value={form.email}
                onChange={onChange}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label className="small" style={{ display: 'block', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>Mobile Number</label>
                <input
                  name="mobileNumber"
                  placeholder="+1 234 567 890"
                  className="input"
                  value={form.mobileNumber}
                  onChange={onChange}
                />
              </div>
              <div>
                <label className="small" style={{ display: 'block', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>App Name</label>
                <input
                  name="app"
                  placeholder="My Awesome App"
                  className="input"
                  value={form.app}
                  onChange={onChange}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label className="small" style={{ display: 'block', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>Description</label>
              <input
                name="description"
                placeholder="Brief description of your app..."
                className="input"
                value={form.description}
                onChange={onChange}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
              <div>
                <label className="small" style={{ display: 'block', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="input"
                  value={form.password}
                  onChange={onChange}
                  required
                />
              </div>
              <div>
                <label className="small" style={{ display: 'block', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="input"
                  value={form.confirmPassword}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="button" type="submit" disabled={loading} style={{ flex: 1 }}>
                {loading ? "Signing up..." : "Sign up"}
              </button>

              <button
                type="button"
                className="btn-ghost"
                onClick={() => router.push("/login")}
                style={{ flex: 1 }}
              >
                Already have an account? Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
