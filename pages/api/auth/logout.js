import cookie from "cookie";

export default function handler(req, res) {
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
