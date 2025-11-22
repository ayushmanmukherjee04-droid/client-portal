// pages/client/apps/[id]/connect.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";

export default function ConnectApp() {
  const router = useRouter();
  const { id } = router.query;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);

  // if user navigates here without id, nothing to do
  useEffect(() => {
    setErr("");
    setResult(null);
    setShow(false);
  }, [id]);

  async function handleGet() {
    if (!id) return setErr("App id missing.");
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/proxy/getUrlAndToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app_id: id }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || data.statusCode >= 400) {
        setErr(data.message || "Failed to get URL & token");
        return;
      }

      // some backends wrap in data.data, some in data — handle both
      const payload = data.data || data;
      setResult(payload);
      setShow(false);
    } catch (e) {
      setLoading(false);
      setErr(e.message || "Network error");
    }
  }

  function copyToken() {
    if (!result?.token) return;
    navigator.clipboard.writeText(result.token).then(
      () => alert("Token copied to clipboard"),
      () => alert("Copy failed — try manually")
    );
  }

  function revealForAWhile() {
    setShow(true);
    // auto-hide after 12 seconds
    setTimeout(() => setShow(false), 12000);
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card" style={{ maxWidth: 900, margin: "20px auto" }}>
          <h3 style={{ marginBottom: 8 }}>Connect to App</h3>
          <p className="small">App ID: <code>{id || "—"}</code></p>

          <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
            <button className="button" onClick={handleGet} disabled={loading}>
              {loading ? "Generating..." : "Get URL & Token"}
            </button>
            <button
              className="btn-ghost"
              onClick={() => router.push("/client/apps")}
            >
              Back to apps
            </button>
          </div>

          {err && <p style={{ color: "red", marginTop: 12 }}>{err}</p>}

          {result && (
            <div style={{ marginTop: 18 }}>
              <div className="card">
                <p style={{ margin: 0, fontWeight: 700 }}>Connection URL</p>
                <div className="small" style={{ marginTop: 8, wordBreak: "break-all" }}>
                  {result.url || result.connection_url || "No URL returned"}
                </div>

                <hr style={{ margin: "12px 0" }} />

                <p style={{ margin: 0, fontWeight: 700 }}>Token</p>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                  <div style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #eef2f6",
                    background: "#fafafa",
                    overflowX: "auto",
                    fontFamily: "monospace"
                  }}>
                    {result.token
                      ? (show ? result.token : (result.token.slice(0, 12) + (result.token.length > 12 ? "••••••••" : "")))
                      : "No token returned"}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-ghost" onClick={() => (show ? setShow(false) : revealForAWhile())}>
                      {show ? "Hide" : "Show"}
                    </button>
                    <button className="button" onClick={copyToken}>Copy</button>
                  </div>
                </div>

                <p className="small" style={{ marginTop: 10 }}>
                  Keep this token secure. Only share it with trusted services.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
