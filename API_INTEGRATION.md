# API Integration Documentation — GearUp Frontend

This document maps all frontend components, custom hooks, and page routes to their corresponding backend Express API endpoints.

---

## 🔐 Authentication & Profile

| Frontend Route                | Custom Hook / Action | Backend Endpoint     | Method | Role Guard                |
| ----------------------------- | -------------------- | -------------------- | ------ | ------------------------- |
| `/auth/login`                 | `useLogin()`         | `/api/auth/login`    | `POST` | Public                    |
| `/auth/register`              | `useRegister()`      | `/api/auth/register` | `POST` | Public                    |
| Global Session                | `useMyProfile()`     | `/api/auth/me`       | `GET`  | Admin, Provider, Customer |
| `/dashboard/customer/profile` | `useUpdateProfile()` | `/api/auth/me`       | `PUT`  | Customer                  |
| `/dashboard/provider/profile` | `useUpdateProfile()` | `/api/auth/me`       | `PUT`  | Provider                  |
| `/dashboard/admin/profile`    | `useUpdateProfile()` | `/api/auth/me`       | `PUT`  | Admin                     |

---

## 🏋️ Equipment Catalog & Categories

| Frontend Route   | Custom Hook / Action               | Backend Endpoint               | Method | Role Guard |
| ---------------- | ---------------------------------- | ------------------------------ | ------ | ---------- |
| `/` (Home)       | `useGearList()`                    | `/api/gear`                    | `GET`  | Public     |
| `/gear` (Browse) | `useGearList()`, `useCategories()` | `/api/gear`, `/api/categories` | `GET`  | Public     |
| `/gear/[id]`     | `useGearDetail()`                  | `/api/gear/:id`                | `GET`  | Public     |

---

## 💳 Rentals & Stripe Payments

| Frontend Route                    | Custom Hook / Action       | Backend Endpoint           | Method  | Role Guard                |
| --------------------------------- | -------------------------- | -------------------------- | ------- | ------------------------- |
| `/gear/[id]`                      | `axiosInstance.post()`     | `/api/rentals`             | `POST`  | Customer                  |
| `/dashboard/customer/orders`      | `useCustomerRentals()`     | `/api/rentals`             | `GET`   | Customer                  |
| `/dashboard/customer/orders/[id]` | `useRentalDetail()`        | `/api/rentals/:id`         | `GET`   | Customer, Provider, Admin |
| `/dashboard/customer/orders/[id]` | `useCreatePaymentIntent()` | `/api/payments/create`     | `POST`  | Customer                  |
| `/dashboard/customer/orders/[id]` | `useConfirmPayment()`      | `/api/payments/confirm`    | `POST`  | Customer                  |
| `/dashboard/customer/orders/[id]` | `useCancelRental()`        | `/api/provider/orders/:id` | `PATCH` | Customer, Provider        |
| `/dashboard/customer/orders`      | `useCreateReview()`        | `/api/reviews`             | `POST`  | Customer                  |
| `/dashboard/customer/orders/[id]` | `useCreateReview()`        | `/api/reviews`             | `POST`  | Customer                  |
| `/payment/success`                | (redirect — no API call)   | —                          | —       | Public (post-payment)     |
| `/payment/cancel`                 | (redirect — no API call)   | —                          | —       | Public (post-cancel)      |

---

## 🏪 Provider Inventory & Orders

| Frontend Route                       | Custom Hook / Action     | Backend Endpoint           | Method   | Role Guard |
| ------------------------------------ | ------------------------ | -------------------------- | -------- | ---------- |
| `/dashboard/provider/gear`           | `useProviderGearList()`  | `/api/gear?providerId=:id` | `GET`    | Provider   |
| `/dashboard/provider/gear/new`       | `useCreateGear()`        | `/api/provider/gear`       | `POST`   | Provider   |
| `/dashboard/provider/gear/[id]/edit` | `useUpdateGear()`        | `/api/provider/gear/:id`   | `PUT`    | Provider   |
| `/dashboard/provider/gear`           | `useDeleteGear()`        | `/api/provider/gear/:id`   | `DELETE` | Provider   |
| `/dashboard/provider/orders`         | `useProviderOrders()`    | `/api/provider/orders`     | `GET`    | Provider   |
| `/dashboard/provider/orders`         | `useUpdateOrderStatus()` | `/api/provider/orders/:id` | `PATCH`  | Provider   |

---

## 🛡️ Admin Moderation & User Management

| Frontend Route                | Custom Hook / Action    | Backend Endpoint       | Method   | Role Guard |
| ----------------------------- | ----------------------- | ---------------------- | -------- | ---------- |
| `/dashboard/admin/users`      | `useAllUsers()`         | `/api/admin/users`     | `GET`    | Admin      |
| `/dashboard/admin/users`      | `useUpdateUserStatus()` | `/api/admin/users/:id` | `PATCH`  | Admin      |
| `/dashboard/admin/categories` | `useCreateCategory()`   | `/api/categories`      | `POST`   | Admin      |
| `/dashboard/admin/categories` | `useUpdateCategory()`   | `/api/categories/:id`  | `PUT`    | Admin      |
| `/dashboard/admin/categories` | `useDeleteCategory()`   | `/api/categories/:id`  | `DELETE` | Admin      |
| `/dashboard/admin/rentals`    | `useAllRentalsAdmin()`  | `/api/admin/rentals`   | `GET`    | Admin      |
| `/dashboard/admin/gear`       | `useAdminGearList()`    | `/api/admin/gear`      | `GET`    | Admin      |

---

## 🔒 Route Protection (proxy.ts — Next.js v16 Edge Middleware)

| Protected Path          | Guard Logic                                         |
| ----------------------- | --------------------------------------------------- |
| `/dashboard/customer/*` | JWT required + `role === "Customer"`                |
| `/dashboard/provider/*` | JWT required + `role === "Provider"`                |
| `/dashboard/admin/*`    | JWT required + `role === "Admin"`                   |
| `/auth/login`           | Redirect to role dashboard if already authenticated |
| `/auth/register`        | Redirect to role dashboard if already authenticated |
| Token expiry            | Cookie auto-cleared, redirected to `/auth/login`    |
