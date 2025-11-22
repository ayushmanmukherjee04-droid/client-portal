// pages/api/proxy/signup.js
import { createBackendClient } from "../../../utils/backendClient";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ statusCode: 405, message: "Method not allowed" });

  try {
    const client = createBackendClient();
    // update path if your backend uses /auth/signup etc.
    const backendResp = await client.post("/signup", req.body);
    const result = backendResp.data || {};
    return res.status(result.statusCode || 200).json(result);
  } catch (err) {
    console.error("Signup proxy error:", err?.response?.data || err.message);
    const status = err.response?.status || 500;
    const msg = err.response?.data?.message || err.message || "Server error";
    return res.status(status).json({ statusCode: status, data: null, message: msg });
  }
}
