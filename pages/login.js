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
      const r = await fetch("/api/proxy/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await r.json();

      if (!r.ok || data.statusCode >= 400) {
        setErr(data.message || "Login failed");
        return;
      }

      router.push("/client/dashboard");
    } catch (error) {
      setErr(error.message || "Network error");
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card" style={{ maxWidth: 400, margin: "40px auto" }}>
          <h2 style={{ marginBottom: 20 }}>Login</h2>

          {err && <p style={{ color: "red" }}>{err}</p>}

          <form onSubmit={submit}>
            <div style={{ marginBottom: 12 }}>
              <input
                type="email"
                className="input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <input
                type="password"
                className="input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="button" type="submit" style={{ width: "100%" }}>
              Login
            </button>

            {/* Redirect to Signup */}
            <button
              type="button"
              className="btn-ghost"
              onClick={() => router.push("/signup")}
              style={{ marginTop: 12, width: "100%" }}
            >
              Don’t have an account? Sign up
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
