This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.



# Client Portal — Frontend

**Project:** Client Portal (React / Next.js — Pages Router)  
**Purpose:** Frontend for client users to register, login, view available apps, request connection URL & token, and view profile.

---

## Quick repo contents

- `pages/` — Next.js pages (login, signup, client dashboard, apps, connect page, profile)
- `pages/api/proxy/` — Server-side proxy routes that forward to the backend (login, signup, getApp, getUrlAndToken, getProfile, logout)
- `pages/api/mock/` — Local mock endpoints used for frontend testing (enabled by `USE_MOCK=true`)
- `components/` — Reusable UI components (Navbar, Loader, ... )
- `utils/backendClient.js` — Axios wrapper used by proxy routes
- `styles/globals.css` — Global styling
- `docs/api-reference.md` — API spec (copied from the file provided by the backend team)

> **Local API spec file (same file you uploaded):**  
> `/mnt/data/frontend-backend data connection (3).md`

---

## What we have completed (done)

- Project scaffolded with Next.js (pages router).
- Folder structure, pages, components and global styles implemented.
- Server-side proxy routes implemented for all client flows.
- Mock server routes (`pages/api/mock/*`) implemented and integrated via `USE_MOCK` env flag so frontend works without backend.
- Login and signup flows (with redirects).
- Protected SSR pages (dashboard, apps, profile) that check `access_token` cookie.
- Apps listing and Connect page to request URL & token (masking & copy behavior).
- README + docs folder (API spec copied to `docs/api-reference.md`).
- Basic UI polish (card layout, inputs, buttons, token copy/hide).

---

## What remains / recommended next steps

These are optional but recommended before production or handing over:

1. **Switch to real backend**
   - Set `USE_MOCK=false` and set `BACKEND_BASE_URL` to the provided backend URL (see Environment section).
   - Test end-to-end and fix any field-name mismatches.

2. **Add logout & token refresh flows**
   - Ensure refresh token / token expiry flows are handled (proxy + client logic).

3. **Improve UX**
   - Add toast notifications, nicer loader, responsive layout, more CSS polish or Tailwind integration.

4. **Security checks**
   - Confirm cookie attributes in production (`secure: true`) and use HTTPS.
   - Remove any secrets from commits.

5. **Testing**
   - Add unit/e2e tests (Jest / React Testing Library / Cypress) as needed.

6. **Deployment**
   - Deploy to Vercel or similar; set env vars there and test.

---

## Local setup (for your teammate)

1. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/client-portal.git
   cd client-portal
