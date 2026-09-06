# GearUp Frontend - L2B7A5
A modern frontend for a sports and outdoor equipment rental platform. GearUp allows customers to discover and rent equipment, providers to manage their inventory, and admins to manage the platform.

## Overview

GearUp provides a simple and responsive interface for managing sports and outdoor equipment rentals.

The frontend includes dedicated experiences for:

* **Customers** — Browse gear, place rental orders, make payments, and manage rentals.
* **Providers** — Manage gear inventory and rental orders.
* **Admins** — Manage users, gear, categories, and rental activities.

## Features

### Public

* Browse available sports and outdoor gear
* Search and filter equipment
* Filter by category, price, brand, and availability
* View detailed gear information
* Responsive design for mobile, tablet, and desktop

### Customer

* Register and login
* Browse and search gear
* View gear details
* Select rental dates
* Add equipment to rental orders
* Checkout and make payments
* View rental history
* Track rental status
* View payment status
* Leave reviews after returning gear
* Manage profile

### Provider

* Provider authentication
* Manage gear inventory
* Add new gear
* Edit gear information
* Remove gear
* Manage stock and availability
* View incoming rental orders
* Update rental order status

### Admin

* Admin dashboard
* Manage users
* Activate or suspend users
* Manage gear listings
* Manage categories
* View rental orders
* Monitor platform activities

## Payment

The frontend supports online payment integration with:

* Stripe
* SSLCommerz

Users can view payment status and payment history from their account.

## Rental Flow

```text
Browse Gear
     ↓
View Gear Details
     ↓
Select Rental Dates
     ↓
Place Order
     ↓
Checkout
     ↓
Make Payment
     ↓
Track Rental
     ↓
Return Gear
     ↓
Leave Review
```

## Dashboard Structure

```text
                    GearUp
                      │
        ┌─────────────┼─────────────┐
        │             │             │
    Customer       Provider       Admin
        │             │             │
        ▼             ▼             ▼
   Browse Gear    Manage Gear    Manage Users
   My Rentals     Manage Stock   Manage Gear
   Payments       View Orders    Categories
   Reviews        Update Status  Rentals
   Profile
```

## Tech Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* Redux Toolkit
* RTK Query
* REST API
* JWT Authentication
* Stripe
* SSLCommerz

## Project Structure

```text
gearup-frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── utils/
├── .env.local
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mrshanshuvo/gearup-frontend.git
cd gearup-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file and add the required configuration.

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Add any additional environment variables required by your implementation.

### 4. Run the development server

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

## Backend Integration

The frontend communicates with the GearUp backend through REST APIs.

Main API areas include:

* Authentication
* Users
* Gear
* Categories
* Rental Orders
* Payments
* Reviews
* Provider Management
* Admin Management

## Responsive Design

GearUp is designed to work across:

* Mobile devices
* Tablets
* Laptops
* Desktop screens

## License

This project is licensed under the [MIT License](./LICENSE).
