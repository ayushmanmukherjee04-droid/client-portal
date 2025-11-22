import { createBackendClient } from "../../../utils/backendClient";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ statusCode:405, message:'Method not allowed' });

  try {
    // if mock enabled -> import mock and use its result object
    let result;
    if (process.env.USE_MOCK === 'true') {
      const mock = (await import('../mock/login')).default;
      // mock returns JSON directly, call it to get the same shape
      // Note: mock returns result, not sets cookies; proxy will set cookies below.
      const mockRes = await mock(req, res);
      // If mock already wrote to res we should not continue — but our mock returns JSON, so capture it:
      // To ensure we have result object, call the mock function and capture its response via invoking its code:
      // Since mock returns via res, we replicate its payload by calling it and reading body is tricky.
      // Simpler: call the mock module function directly to compute the same result object:
      // But because our mock module returns via res, instead call create a result manually:
      result = {
        statusCode: 200,
        data: {
          tokens: { access: 'mock_access_token_abc123', refresh: 'mock_refresh_token_def456' },
          client: { id: 'user_mock_1', first_name: 'Mock', last_name: 'User', email: req.body.email || 'mock', app_name:'MockApp' }
        },
        message: 'Mock login success'
      };
    } else {
      const client = createBackendClient();
      const backendResp = await client.post("/login", req.body);
      result = backendResp.data || {};
    }

    if (result.statusCode && result.statusCode >= 400) {
      return res.status(result.statusCode).json(result);
    }

    const tokens = result.data?.tokens || {};
    const access = tokens.access || tokens.access_token;
    const refresh = tokens.refresh || tokens.refresh_token;

    if (access) {
      res.setHeader("Set-Cookie", [
        cookie.serialize("access_token", access, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: parseInt(process.env.COOKIE_MAX_AGE || "604800")
        }),
        cookie.serialize("refresh_token", refresh || "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: parseInt(process.env.COOKIE_MAX_AGE || "604800")
        })
      ]);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Login proxy error:", err?.response?.data || err.message);
    const status = err.response?.status || 500;
    return res.status(status).json({ statusCode: status, message: err.response?.data?.message || 'Server error' });
  }
}
