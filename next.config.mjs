/** @type {import("next").NextConfig} */
// All /api/* calls are proxied to the Express server. Because the browser only ever talks to this
// site, the HTTPOnly JWT cookie is first-party and works on Vercel + Render without CORS/cookie issues.
const BACKEND_URL = (process.env.BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

const nextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` }];
  },
};
export default nextConfig;
