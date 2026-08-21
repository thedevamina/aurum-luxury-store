<p align="center">
  <img src="./.github/hero.svg" alt="AURUM — Luxury E-Commerce Platform built with Laravel, React and TypeScript" width="100%" />
</p>

<p align="center">
  A full-stack, security-first e-commerce store built from scratch — real authentication, real transactions, real admin operations.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-0f1b30?style=for-the-badge&logo=laravel&logoColor=38bdf8" />
  <img src="https://img.shields.io/badge/React-0f1b30?style=for-the-badge&logo=react&logoColor=38bdf8" />
  <img src="https://img.shields.io/badge/TypeScript-0f1b30?style=for-the-badge&logo=typescript&logoColor=38bdf8" />
  <img src="https://img.shields.io/badge/MySQL-0f1b30?style=for-the-badge&logo=mysql&logoColor=38bdf8" />
  <img src="https://img.shields.io/badge/Vite-0f1b30?style=for-the-badge&logo=vite&logoColor=38bdf8" />
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Repo-view_source-0f1b30?style=flat-square&logoColor=38bdf8" /></a>
  <a href="https://github.com/thedevamina"><img src="https://img.shields.io/badge/@thedevamina-0f1b30?style=flat-square&logo=github&logoColor=38bdf8" /></a>
</p>

<br/>

## 🛍️ About

AURUM is a complete luxury e-commerce platform — a customer storefront and a separate admin dashboard, both backed by a custom Laravel API. Built with a strict **Repository → Service → Controller** architecture and hardened against real-world vulnerabilities: IDOR, privilege escalation, race conditions, mass assignment, and insecure file uploads.

> This isn't a template with a database bolted on — every endpoint, every permission check, and every transaction was designed and tested deliberately, including simulated attacks against the app's own security boundaries.

<br/>

## What I Built

<table>
  <tr>
    <td width="25%" valign="top">
      <h3>🛒 Storefront</h3>
      <p>Secure auth, real-time cart & wishlist, full checkout with server-side price and stock verification.</p>
    </td>
    <td width="25%" valign="top">
      <h3>📊 Admin Dashboard</h3>
      <p>Sales reports, product/category/coupon management, and an append-only audit log of every admin action.</p>
    </td>
    <td width="25%" valign="top">
      <h3>🛡️ Security</h3>
      <p>IDOR-proof endpoints, transaction-locked checkout, randomized upload filenames, strict mass-assignment allow-lists.</p>
    </td>
    <td width="25%" valign="top">
      <h3>🧱 Architecture</h3>
      <p>Route → Middleware → Form Request → Controller → Service → Repository → Model → Resource, on every feature.</p>
    </td>
  </tr>
</table>

<br/>

## Modules

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🔐 Auth & Access Control</h3>
      <p>Laravel Sanctum for SPA authentication, bcrypt hashing, rate limiting, session-fixation protection, and role-based access (Admin / Staff) enforced at every layer via Spatie Laravel-Permission.</p>
      <p>
        <img src="https://img.shields.io/badge/Laravel_Sanctum-0f1b30?style=flat-square&logoColor=38bdf8" />
        <img src="https://img.shields.io/badge/Spatie_Permission-0f1b30?style=flat-square&logoColor=38bdf8" />
      </p>
    </td>
    <td width="50%" valign="top">
      <h3>💳 Checkout & Inventory</h3>
      <p>Server-side price calculation, stock verification, and <code>DB::transaction()</code> + <code>lockForUpdate()</code> to guarantee no overselling under concurrent checkout.</p>
      <p>
        <img src="https://img.shields.io/badge/DB_Transactions-0f1b30?style=flat-square&logoColor=38bdf8" />
        <img src="https://img.shields.io/badge/Row_Locking-0f1b30?style=flat-square&logoColor=38bdf8" />
      </p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🔍 Storefront Experience</h3>
      <p>Full-text product search, category filtering and sorting, verified-purchase-only reviews, and live order history.</p>
      <p>
        <img src="https://img.shields.io/badge/React-0f1b30?style=flat-square&logo=react&logoColor=38bdf8" />
        <img src="https://img.shields.io/badge/Framer_Motion-0f1b30?style=flat-square&logoColor=38bdf8" />
      </p>
    </td>
    <td width="50%" valign="top">
      <h3>📬 Admin Operations</h3>
      <p>Secure image uploads with randomized filenames, spam-honeypot-protected contact inbox, and a full audit trail of admin actions.</p>
      <p>
        <img src="https://img.shields.io/badge/Secure_Uploads-0f1b30?style=flat-square&logoColor=38bdf8" />
        <img src="https://img.shields.io/badge/Audit_Log-0f1b30?style=flat-square&logoColor=38bdf8" />
      </p>
    </td>
  </tr>
</table>

<br/>

## Architecture

<p align="center">
  <img src="https://img.shields.io/badge/Route-0f1b30?style=flat-square&logoColor=38bdf8" /> →
  <img src="https://img.shields.io/badge/Middleware-132542?style=flat-square&logoColor=38bdf8" /> →
  <img src="https://img.shields.io/badge/Form_Request-0f1b30?style=flat-square&logoColor=38bdf8" /> →
  <img src="https://img.shields.io/badge/Controller-132542?style=flat-square&logoColor=38bdf8" /> →
  <img src="https://img.shields.io/badge/Service-0f1b30?style=flat-square&logoColor=38bdf8" /> →
  <img src="https://img.shields.io/badge/Repository-132542?style=flat-square&logoColor=38bdf8" /> →
  <img src="https://img.shields.io/badge/Resource-0f1b30?style=flat-square&logoColor=38bdf8" />
</p>

Every backend feature follows this same disciplined flow — business logic stays out of controllers, database access is isolated to one layer, and every API response shape is explicit. That makes the codebase predictable and auditable, feature after feature.

```
backend/                  → Laravel API
├── app/Http/Controllers/Api/   → Public + Admin controllers
├── app/Http/Requests/            → Form Request validation
├── app/Http/Resources/           → API response shaping
├── app/Services/                 → Business logic
├── app/Repositories/             → Data access layer
└── app/Models/

project/                  → React frontend
├── src/pages/               → Customer-facing pages
├── src/admin/                → Separate admin app
├── src/context/              → Auth, Cart, Wishlist
└── src/lib/                  → API client & data mapping
```

<br/>

## Security Highlights

- ✅ **IDOR protection** — proven via real cross-account attack simulations
- ✅ **Privilege escalation impossible via the public API** — roles assignable only server-side
- ✅ **No overselling** — `DB::transaction()` + `lockForUpdate()` on every checkout
- ✅ **No path traversal / overwrite attacks** — randomized filenames on every upload
- ✅ **Mass-assignment locked down** — explicit `$fillable` allow-lists everywhere

<br/>

## Tech Stack

<p>
  <img src="https://img.shields.io/badge/PHP-0f1b30?style=flat-square&logo=php&logoColor=38bdf8" />
  <img src="https://img.shields.io/badge/Laravel-0f1b30?style=flat-square&logo=laravel&logoColor=38bdf8" />
  <img src="https://img.shields.io/badge/MySQL-0f1b30?style=flat-square&logo=mysql&logoColor=38bdf8" />
  <br/>
  <img src="https://img.shields.io/badge/React-0f1b30?style=flat-square&logo=react&logoColor=38bdf8" />
  <img src="https://img.shields.io/badge/TypeScript-0f1b30?style=flat-square&logo=typescript&logoColor=38bdf8" />
  <img src="https://img.shields.io/badge/Vite-0f1b30?style=flat-square&logo=vite&logoColor=38bdf8" />
  <img src="https://img.shields.io/badge/TailwindCSS-0f1b30?style=flat-square&logo=tailwindcss&logoColor=38bdf8" />
  <br/>
  <img src="https://img.shields.io/badge/Laravel_Sanctum-0f1b30?style=flat-square&logoColor=38bdf8" />
  <img src="https://img.shields.io/badge/Spatie_Permission-0f1b30?style=flat-square&logoColor=38bdf8" />
  <img src="https://img.shields.io/badge/Framer_Motion-0f1b30?style=flat-square&logoColor=38bdf8" />
</p>

<br/>

## Getting Started

**Prerequisites:** PHP ≥ 8.2 · Composer · Node.js ≥ 18 · npm · MySQL

**Backend:**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# configure DB credentials in .env
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

**Frontend:**
```bash
cd project
npm install
cp .env.example .env
# set VITE_API_URL=http://localhost:8000
npm run dev
```

Storefront: `http://localhost:5173` · Admin panel: `http://localhost:5173/admin.html`

<br/>

## Roadmap

- [ ] Stripe payment integration
- [ ] Staff & role management UI
- [ ] Real-time order notifications
- [ ] Shipping zone configuration

<br/>

---

<p align="center">
  <em>Built with care, one secure endpoint at a time.</em>
</p>

<p align="center">
  <a href="https://github.com/thedevamina"><img src="https://img.shields.io/badge/@thedevamina-0f1b30?style=for-the-badge&logo=github&logoColor=38bdf8" /></a>
</p>
