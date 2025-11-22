// pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");

    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await r.json();

      console.log("Login response:", r.status, data);

      if (!r.ok || (data.statusCode && data.statusCode >= 400)) {
        console.log("Login failed condition met");
        setErr(data.message || "Login failed");
        return;
      }

      console.log("Redirecting to dashboard...");
      router.push("/client/dashboard");
    } catch (error) {
      setErr(error.message || "Network error");
    }
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>

          {err && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {err}
            </div>
          )}

          <form onSubmit={submit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="small" style={{ display: 'block', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>Email Address</label>
              <input
                type="email"
                className="input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label className="small" style={{ display: 'block', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="button" type="submit" style={{ width: "100%", marginBottom: '1rem' }}>
              Sign In
            </button>

            <button
              type="button"
              className="btn-ghost"
              onClick={() => router.push("/signup")}
              style={{ width: "100%", textAlign: 'center' }}
            >
              Don’t have an account? Sign up
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
