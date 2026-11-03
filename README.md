# StudioSpace

**Live site:** https://YOUR-STUDIOSPACE.vercel.app  *(replace with your Vercel URL after deploying)*
**API:** https://YOUR-STUDIOSPACE-API.onrender.com

StudioSpace is a peer-to-peer marketplace where creators book photo studios, sound stages, podcast lounges, music suites and art workshops by the hour, and hosts list their spaces and manage requests.

## Features
- Hero slider (Swiper), 6 dynamic featured studios from MongoDB, category browsing that pre-selects filters on `/studios`
- Explore page with debounced search, category, price range, sorting, pagination and friendly empty states
- Studio details with gallery carousel, amenities, host card, reviews and a booking modal with live price summary
- Full CRUD for studios (add, update, delete with confirmation modal) with imgbb image upload, all stored in MongoDB
- Booking workflow: `Pending` -> `Confirmed` -> `Completed` / `Cancelled`, host dashboard to confirm requests
- **Double-booking prevention:** overlapping time on a Confirmed slot is rejected with a clear message
- **JWT in HTTPOnly cookies:** protected mutations return `401 Unauthorized` without a valid cookie
- **Light / dark theme toggle** for the whole app, saved between visits
- **PDF invoice** for confirmed bookings and **Saved Studios wishlist** (heart icon)
- Toasts (react-hot-toast) and custom modals everywhere: no `alert()`, no lorem ipsum, custom 404, skeleton loaders

## Tech stack
Next.js 14 (App Router), Tailwind CSS + DaisyUI, Swiper, react-hot-toast, jsPDF, react-icons - Express.js, MongoDB (native driver), JSON Web Tokens, bcrypt - deployed on Vercel (client) and Render (server).

## Examiner test credentials
| Role | Email | Password |
| --- | --- | --- |
| Host (owns all seeded studios) | host@studiospace.com | Host123 |
| Guest (has Pending, Confirmed and Completed bookings) | guest@studiospace.com | Guest123 |

Suggested check: log in as **guest**, book a studio and see it as Pending; log in as **host**, open Dashboard and confirm it; then try booking an overlapping time as guest to see the collision error.

## Run locally
1. Start the API from `studiospace-server` (see its README): `npm install`, copy `.env.example` to `.env`, `npm run seed`, `npm run dev`.
2. In this folder:
```bash
npm install
cp .env.example .env.local   # BACKEND_URL=http://localhost:5000
npm run dev                  # http://localhost:3000
```

## Environment variables
| Name | Purpose |
| --- | --- |
| `BACKEND_URL` | Deployed Express API URL, used by the `/api/*` rewrite |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Optional, enables Google sign-in |
| `NEXT_PUBLIC_IMGBB_KEY` | Optional, enables image upload in the studio form |
