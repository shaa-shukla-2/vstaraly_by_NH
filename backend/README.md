# Vastralay API

Express 5 and PostgreSQL API for the Vastralay storefront. The API runs on port `4000` by default and exposes JSON endpoints under `/api`.

## Local setup

1. From this directory, copy `.env.example` to `.env`. Set your own `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB`; update `DATABASE_URL` to match. Also set two distinct random JWT secrets (at least 16 characters).
2. Install dependencies with `npm install`.
3. Start PostgreSQL with `npm run db:up`.
4. Generate Prisma Client and create/apply the development migration with `npm run prisma:generate` and `npm run prisma:migrate`.
5. Seed the catalog and optional local accounts with `npm run db:seed`.
6. Start the API with `npm run dev`.

For a deployed database, run `npm run prisma:deploy` before starting the service. Keep `.env` and seeded credentials out of source control. Set `FRONTEND_ORIGIN` to the comma-separated list of trusted storefront origins.

## API

Successful responses use `{ "success": true, "data": ... }`; errors use `{ "success": false, "error": { "message": ..., "code": ... } }`.

| Area | Routes |
| --- | --- |
| Health | `GET /api/health` (checks PostgreSQL connectivity) |
| Authentication | `POST /api/auth/register`, `/login`, `/refresh`, `/logout`, `/forgot-password`, `/reset-password`; `GET /api/auth/me` |
| Catalog | `GET /api/categories`, `/api/collections`, `/api/designers`, `/api/products` |
| Products | `GET /api/products/:slug`, `/:id/reviews`, `/:id/rental-availability`; authenticated `POST /:id/reviews` |
| Account | `GET/PATCH /api/users/me`; `GET/POST /api/users/me/addresses`; `PATCH/DELETE /api/users/me/addresses/:id` |
| Cart and wishlist | Authenticated `GET/POST/PATCH/DELETE /api/cart`; `GET/POST/DELETE /api/wishlist` |
| Orders | Authenticated `GET/POST /api/orders`, `GET /api/orders/:id`, `GET /api/orders/:id/track` |
| Coupons and rentals | `POST /api/coupons/validate`; `GET /api/rentals/availability/:productId`, `POST /api/rentals/check`, `GET /api/rentals/calendar/:productId` |
| Administration | Admin-only `GET /api/admin/overview`, `/users`, `/orders`, `/coupons`; `PATCH /api/admin/orders/:id`, `/products/:id`, `/coupons/:code`; `POST /api/admin/products`, `/coupons`; `DELETE /api/admin/products/:id`, `/coupons/:code` |

Protected routes accept an access token as `Authorization: Bearer <token>`. Login and registration also set an HTTP-only refresh cookie. For local development, password reset returns a reset token in its response; production intentionally does not expose it and needs an email delivery integration.

Checkout currently creates an order with `paymentStatus: placeholder_unpaid`; it does not charge a card or confirm payment. Configure a payment provider and webhook before accepting live payments.
