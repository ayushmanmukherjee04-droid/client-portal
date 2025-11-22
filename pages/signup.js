// pages/signup.js
import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

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
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

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
      const r = await fetch("/api/proxy/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await r.json();
      setLoading(false);

      if (!r.ok || data.statusCode >= 400) {
        setErr(data.message || "Signup failed");
        return;
      }

      setSuccessMsg(data.message || "Signup successful. Redirecting...");
      setTimeout(() => router.push("/login"), 1200);
    } catch (error) {
      setLoading(false);
      setErr(error.message || "Network error");
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card" style={{ maxWidth: 700, margin: "24px auto" }}>
          <h2 style={{ marginBottom: 12 }}>Sign Up</h2>

          {err && <p style={{ color: "red" }}>{err}</p>}
          {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

          <form onSubmit={submit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <input
                name="firstName"
                placeholder="First name"
                className="input"
                value={form.firstName}
                onChange={onChange}
                required
              />
              <input
                name="lastName"
                placeholder="Last name"
                className="input"
                value={form.lastName}
                onChange={onChange}
                required
              />
            </div>

            <div style={{ marginTop: 12 }}>
              <input
                name="email"
                placeholder="Email"
                className="input"
                value={form.email}
                onChange={onChange}
                required
              />
            </div>

            <div
              style={{
                marginTop: 12,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <input
                name="mobileNumber"
                placeholder="Mobile number"
                className="input"
                value={form.mobileNumber}
                onChange={onChange}
              />
              <input
                name="app"
                placeholder="App name (optional)"
                className="input"
                value={form.app}
                onChange={onChange}
              />
            </div>

            <div style={{ marginTop: 12 }}>
              <input
                name="description"
                placeholder="Description (optional)"
                className="input"
                value={form.description}
                onChange={onChange}
              />
            </div>

            <div
              style={{
                marginTop: 12,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="input"
                value={form.password}
                onChange={onChange}
                required
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                className="input"
                value={form.confirmPassword}
                onChange={onChange}
                required
              />
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button className="button" type="submit" disabled={loading}>
                {loading ? "Signing up..." : "Sign up"}
              </button>

              {/* Already have account → Login */}
              <button
                type="button"
                className="btn-ghost"
                onClick={() => router.push("/login")}
                style={{ width: "100%" }}
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
