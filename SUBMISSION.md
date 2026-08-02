# Assignment 5 — GearUp Frontend Submission

## Student Information

```
Student Name    : Shan Shuvo
Student ID      : [YOUR STUDENT ID]
Assignment      : Assignment 5 — GearUp Frontend 🏋️
```

---

## Submission Links

```
Frontend GitHub Repo  : https://github.com/mrshanshuvo/L2L5
Live Frontend URL     : [ADD VERCEL URL AFTER DEPLOYMENT]
Backend API URL       : http://localhost:5000/api  ← replace with deployed backend URL
Demo Video            : [ADD GOOGLE DRIVE / LOOM LINK]
```

---

## Admin Credentials

```
Admin Email    : [YOUR ADMIN EMAIL]
Admin Password : [YOUR ADMIN PASSWORD]
```

> ⚠️ Fill in the credentials above before submitting. The admin account must be able to log in to the live deployed frontend.

---

## Tech Stack Summary

| Technology                            | Purpose                                                    |
| ------------------------------------- | ---------------------------------------------------------- |
| **Next.js 16** (App Router)           | React framework, routing, server + client components       |
| **TypeScript**                        | Full type safety                                           |
| **Tailwind CSS + Shadcn UI**          | Styling and component library                              |
| **TanStack Query (React Query)**      | Server state management and data fetching                  |
| **Zustand**                           | Global client state (auth store with hydration)            |
| **proxy.ts** (Next.js v16 Middleware) | JWT-based edge route protection with role enforcement      |
| **Stripe** (Card checkout modal)      | Payment integration — card inputs, payment intent, confirm |
| **Cloudinary**                        | Image uploads for gear listings and profile avatars        |
| **Sonner**                            | Toast notifications                                        |

---

## Architecture Notes

The project follows Next.js App Router conventions with a modular structure:

- `src/app/(public)/` — Public-facing pages (home, gear browse, gear detail)
- `src/app/auth/` — Login and register pages
- `src/app/dashboard/customer/` — Customer-only protected dashboard
- `src/app/dashboard/provider/` — Provider-only protected dashboard
- `src/app/dashboard/admin/` — Admin-only protected dashboard
- `src/app/payment/` — Stripe payment outcome pages (success / cancel)
- `src/hooks/` — All TanStack Query custom hooks
- `src/services/` — Axios-based API service layer
- `src/stores/` — Zustand auth store
- `src/proxy.ts` — Next.js v16 edge proxy (replaces deprecated middleware.ts)

---

## Key Features Implemented

### ✅ All 3 Roles Fully Functional

- **Customer**: Browse gear → Rent Now → Stripe payment → Track orders → Leave review
- **Provider**: Add/edit/delete gear inventory → Manage incoming orders → Update status (Confirm / Mark Picked Up / Mark Returned)
- **Admin**: Platform stats → User management (Suspend/Activate) → Rental oversight → Category CRUD

### ✅ Payment Flow

1. Customer selects gear and rental dates → clicks **Rent Now**
2. Order created with `PLACED` status
3. Customer goes to order detail → clicks **Pay Now**
4. Stripe Card Checkout modal opens (card number, expiry, CVC)
5. Payment confirmed → redirected to `/payment/success?orderId=...`
6. On cancel → redirected to `/payment/cancel?orderId=...`

### ✅ Status Flow (per spec)

| Status      | Customer Sees          | Provider Sees         |
| ----------- | ---------------------- | --------------------- |
| `PLACED`    | Pay Now + Cancel Order | Confirm button        |
| `CONFIRMED` | Pay Now                | Mark Picked Up button |
| `PAID`      | —                      | Mark Picked Up button |
| `PICKED_UP` | —                      | Mark Returned button  |
| `RETURNED`  | Leave Review button    | —                     |
| `CANCELLED` | —                      | —                     |

---

## Commit History Summary

Total commits: **111** (requirement: 20)

Sample commits:

- `feat(customer): add interactive ReviewModal for submitting reviews on returned rentals`
- `feat(payment): add payment success and cancel redirect pages and loading skeletons`
- `feat(provider): integrate Cloudinary image upload dropzone and action confirmation dialogs`
- `feat(ui): add reusable Pagination component and integrate across all list pages`
- `feat(dashboard): replace native confirm popups with reusable Shadcn ConfirmModal`
- `feat: implement interactive Stripe Card Checkout Modal`
- `feat: make DashboardShell fully responsive with mobile hamburger drawer`
- `feat: implement Cloudinary image upload for all dashboard role profile pages`
- `feat: implement custom 404 not found page with navigation links`

---

## API Integration

See [`API_INTEGRATION.md`](./API_INTEGRATION.md) for the full mapping of frontend components to backend endpoints.

---

## Video Walkthrough Checklist

Record a 7–10 minute video covering:

- [ ] Project overview and Next.js App Router folder structure
- [ ] Customer role: register → browse gear → rent → Stripe payment → payment success page → track order → leave review
- [ ] Provider role: add gear with image → view incoming orders → confirm → mark picked up → mark returned
- [ ] Admin role: user management (suspend/activate) → rental oversight → category CRUD → platform stats
- [ ] Error handling demo (validation errors, toast notifications)
- [ ] Explain one technical challenge (e.g., Next.js v16 proxy.ts JWT route protection, or Stripe payment flow)
