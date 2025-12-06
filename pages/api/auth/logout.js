import cookie from "cookie";
import API_CONFIG from "../../../config/api";
import { createBackendClient } from "../../../utils/backendClient";

export default async function handler(req, res) {
    // 1. Call backend logout (optional but good practice)
    try {
        const cookies = cookie.parse(req.headers.cookie || "");
        const token = cookies.access_token;

        if (token) {
            // We can't use apiClient here easily because it's client-side, 
            // but we can use fetch or axios.
            // Or just skip backend logout if it's stateless JWT.
            // But let's try to be thorough.
            await fetch(API_CONFIG.getUrl('logout'), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'token': token,
                    'Content-Type': 'application/json'
                }
            }).catch(err => console.error("Backend logout failed:", err.message));
        }
    } catch (e) {
        console.error("Logout error:", e);
    }

    // 2. Clear cookie
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("access_token", "", {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(0),
            sameSite: "lax",
            path: "/",
        })
    );

    res.status(200).json({ statusCode: 200, data: null, message: 'Logged out successfully', status: 'success' });
}
