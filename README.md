# KIXORA — Sneaker E-Commerce Platform

A full-stack scaffold for a thrifted/branded sneaker store: React (Vite + Tailwind + Redux Toolkit)
on the frontend, Node.js/Express + MongoDB on the backend.

## Structure

```
kixora/
├── backend/     Express API, MongoDB models, JWT auth, admin routes
└── frontend/    React app — storefront, auth, dashboard, and admin panel
```

## Quick start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, etc.
npm run seed               # creates an admin user + sample products
npm run dev                 # starts API on http://localhost:5000
```

Seeded admin login: `admin@kixora.com` / `admin12345`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm run dev                 # starts app on http://localhost:5173
```

## What's implemented

**Backend**
- JWT auth (register, login, protected routes, admin-only routes)
- Product, Category, Brand, Order, Review, Coupon, Wishlist, Cart, Address models
- Admin dashboard stats endpoint (revenue, orders, low stock, 30-day sales)
- Order status lifecycle (pending → processing → shipped → delivered / cancelled / returned)

**Frontend**
- Storefront: Home, Shop (search/filter/sort), Product Details, Cart, Wishlist, Checkout
- Live search with debounced suggestions + recent searches (navbar)
- Breadcrumbs on Shop and Product Details
- Product reviews: read + submit (star rating, title, comment) wired to the real API
- Buy Now (adds to cart + jumps to checkout) and Share (native share sheet / clipboard fallback)
- Auth: Login, Register, Forgot/Reset Password, OTP verification
- User Dashboard (profile, orders, saved addresses)
- Admin Panel: dashboard stats, product CRUD, order status updates, customer list
- Extra UI components: Avatar, Tooltip, Dropdown, Breadcrumb, ReviewCard
- SEO basics: meta description, Open Graph/Twitter cards, robots.txt, sitemap.xml
- Branded cheesy-but-standard components: sticky navbar, slide-out sidebar drawer with
  free-shipping banner + cart preview + newsletter signup, toasts, modals, badges,
  accordion (FAQ), tabs, skeleton loader, pagination

## What's not built yet (by design — flagged in the original roadmap)

These need real infrastructure/credentials beyond a scaffold, so they're stubbed with
clear extension points rather than faked:
- Payment gateway integration (Stripe/PayPal/Easypaisa/JazzCash) — `paymentMethod` field
  exists on Order, but no live gateway is wired in
- Cloudinary image upload — config file is there, upload routes are not
- Email/SMS/WhatsApp sending — Nodemailer is installed, templates aren't written
- Shipping carrier tracking webhooks (TCS/Leopards/M&P/Trax)

## SEO note

`index.html`, `robots.txt`, and `sitemap.xml` use `kixora.com` as a placeholder domain —
swap it for your real one before deploying. Product page URLs aren't in the static
sitemap since they're dynamic; generate them from the database at deploy time, e.g.:

```js
// scripts/generate-sitemap.js (run after seeding/updating products)
const products = await Product.find().select("slug updatedAt");
const urls = products.map(p => `<url><loc>https://www.kixora.com/product/${p.slug}</loc></url>`);
// append to sitemap.xml
```

## Newly added: PWA, push, 360° view, i18n, multi-currency

- **PWA** — `manifest.json` + `sw.js` (offline app-shell caching). Icons are
  generated placeholders (`public/icons/`) — swap for real branded icons before
  shipping. Install prompt shows automatically in supported browsers (desktop
  Chrome/Edge, Android Chrome); iOS Safari requires "Add to Home Screen" manually.
- **Push notifications** — fully wired, no third-party account needed. Run
  `npm run generate-vapid-keys` in `backend/` once, paste the output into
  `.env`, restart the server, then click "Enable Notifications" in the navbar.
  Admins can broadcast via `POST /api/push/broadcast` (protected, admin-only).
- **360° product view** — drag-to-rotate tab on Product Details. Falls back to
  spinning the illustrated shoe in 3D until real turntable photography exists —
  pass `images360: [...]` on a product to use real photo frames instead.
- **Multi-language (EN/Urdu)** — `src/context/LocaleContext.jsx` + `src/i18n/translations.js`.
  Wired into Navbar, Sidebar, Footer, and the Home hero. Add more keys to
  `translations.js` and swap hardcoded strings for `t("your_key")` to extend
  it to the rest of the app. Urdu switches the page to RTL automatically.
- **Multi-currency** — `src/context/CurrencyContext.jsx`, static conversion
  rates (USD/PKR/EUR/GBP/AED). Wired into ProductCard, Product Details, and
  Cart. Swap the static `rate` values for a live FX API call when you're ready.

## Product Quick View

A "Quick View" button appears on product cards (Shop grid / Home sections) on
hover — clicking it opens an animated modal (`src/components/QuickView.jsx`)
styled after a Pinterest UI reference: soft pink background, floating white
card, auto-cycling between a "Details" tab (colorway swatches + feature
bullets) and a "Select Size" tab, real Add to Cart / Wishlist wired to the
same Redux actions as the full Product Details page. State lives in
`uiSlice.quickViewProduct` — open it from anywhere with
`dispatch(openQuickView(product))`.

## Next steps

1. `npm install` in both folders and get a local or Atlas MongoDB URI
2. Run the seed script, log in as admin, poke around `/admin`
3. Wire up the payment/shipping integrations you actually plan to use
4. Swap placeholder product images for real ones (Cloudinary config is ready)
