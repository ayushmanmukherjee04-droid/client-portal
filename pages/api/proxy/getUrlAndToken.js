import { createBackendClient } from "../../../utils/backendClient";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ statusCode:405, message:'Method not allowed' });

  try {
    if (process.env.USE_MOCK === 'true') {
      const mock = (await import('../mock/getUrlAndToken')).default;
      return mock(req, res);
    }
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.access_token;
    const client = createBackendClient(token);
    const backendResp = await client.post("/getUrlAndToken", req.body);
    return res.status(backendResp.data.statusCode || 200).json(backendResp.data);
  } catch (err) {
    console.error("getUrlAndToken proxy error:", err?.response?.data || err.message);
    const status = err.response?.status || 500;
    return res.status(status).json({ statusCode: status, data:null, message: err?.response?.data?.message || 'Server error' });
  }
}
