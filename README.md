# 🌙 Gumnam Momina — Luxury Islamic Fashion Store

> A full-stack e-commerce platform for **Gumnam Momina**, a luxury abaya, hijab, prayer chadar and Islamic accessories brand.

---

## ✨ Features

- **Frontend**: Next.js 14, Tailwind CSS, dark gold Islamic luxury aesthetic
- **Backend**: Node.js, Express, MongoDB, JWT Authentication
- **Full E-commerce**: Products, Cart, Orders, Admin Panel
- **User Roles**: Customer + Admin
- **Mobile-responsive** luxury design

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, Tailwind CSS, React Context |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (JSON Web Tokens) |
| Styling | Tailwind CSS + Google Fonts (Cormorant, Josefin Sans, Amiri) |

---

## 🚀 Local Setup (Step by Step)

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) (Community Edition) — OR use [MongoDB Atlas](https://www.mongodb.com/atlas) (free cloud)
- npm or yarn

---

### Step 1 — Clone / Setup the project

Unzip the project folder. You should see:
```
gumnam-momina/
  backend/
  frontend/
```

---

### Step 2 — Setup Backend

```bash
cd gumnam-momina/backend
npm install
```

Edit the `.env` file (already created):
```env
MONGO_URI=mongodb://localhost:27017/gumnam-momina
JWT_SECRET=gumnam_momina_super_secret_key_2024
PORT=5000
```

> **Using MongoDB Atlas?** Replace MONGO_URI with your Atlas connection string.

**Create Admin User:**
```bash
node seedAdmin.js
```
This creates:
- Email: `admin@gumnammomina.pk`
- Password: `admin123456`

**Start Backend:**
```bash
npm run dev
```
Backend runs at `http://localhost:5000`

---

### Step 3 — Setup Frontend

```bash
cd gumnam-momina/frontend
npm install
```

The `.env.local` file is already created with:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Start Frontend:**
```bash
npm run dev
```
Frontend runs at `http://localhost:3000`

---

### Step 4 — Seed Sample Products

1. Open your browser: `http://localhost:3000`
2. Login with admin: `admin@gumnammomina.pk` / `admin123456`
3. Go to Admin Panel → Click **"Seed Products"** button
4. 8 beautiful sample products will be created!

---

## 🌐 Pages

| Page | URL |
|------|-----|
| Homepage | `/` |
| All Products | `/products` |
| Product Detail | `/products/:id` |
| Login | `/login` |
| Register | `/register` |
| Checkout | `/checkout` |
| My Orders | `/orders` |
| Admin Panel | `/admin/products` |

---

## 👑 Admin Features

Login as admin and go to `/admin/products`:
- ✅ Add new products
- ✅ Edit existing products
- ✅ Delete products
- ✅ Seed 8 sample products
- ✅ View order stats dashboard

---

## 🌍 Production deployment (backend + frontend)

Use **one Git repo** for both apps. Do **not** add `vercel.json` at the repo root. The only Vercel config lives in **`frontend/vercel.json`**.

**Order:** Deploy the **backend** first so you get a public API URL. Then deploy the **frontend** and point it at that URL.

---

### A — Backend (Railway example)

1. Push this repo to GitHub (if it is not already).
2. Open [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub** → select this repo.
3. When Railway asks for a **root directory**, set it to **`backend`**.
4. Add a **public HTTP** service if prompted (Railway should detect `npm start` from `backend/package.json`).
5. In **Variables**, add:

   | Name | Example / notes |
   |------|------------------|
   | `MONGO_URI` | Your [MongoDB Atlas](https://www.mongodb.com/atlas) connection string |
   | `JWT_SECRET` | A long random string (same idea as local `.env`) |
   | `NODE_ENV` | `production` |
   | `ALLOWED_ORIGINS` | Your Vercel site URL(s), comma-separated, e.g. `https://your-app.vercel.app` (add preview URLs if you need them) |

   Railway sets `PORT` automatically; you usually do **not** need to set it.

6. **Deploy**, then open **Settings → Networking → Generate Domain** (or use the default Railway URL).
7. Confirm the API responds, e.g. open `https://YOUR-RAILWAY-URL.up.railway.app/api/health` in a browser.

Your frontend will use this base (with `/api` on the path):

`NEXT_PUBLIC_API_URL` = `https://YOUR-RAILWAY-URL.up.railway.app/api`

---

### B — Frontend (Vercel)

1. Open [vercel.com](https://vercel.com) → **Add New…** → **Project** → import **the same GitHub repo**.
2. Under **Root Directory**, choose **`frontend`** (required).
3. **Environment variables** (Production — add Preview too if you use preview deployments):

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_API_URL` | `https://YOUR-RAILWAY-URL.up.railway.app/api` (must match your live API, including `/api`) |

   Optional (only if you use AI features):

   | Name | Notes |
   |------|--------|
   | `GROQ_API_KEY` | For Groq-powered routes under `app/api/ai/` |
   | `ANTHROPIC_API_KEY` | For Claude-related routes |

4. **Deploy**. Your site will be something like `https://your-project.vercel.app`.

5. Go back to Railway and **update `ALLOWED_ORIGINS`** to include your real Vercel URL (and redeploy the backend if needed).

---

### Render (backend alternative)

Same idea: create a **Web Service**, root directory **`backend`**, build command `npm install`, start command `npm start`, set the same env vars as in section A (including `ALLOWED_ORIGINS`).

---

## 🎨 Brand Design System

| Element | Value |
|---------|-------|
| Primary Gold | `#C9A84C` |
| Background | `#080808` (Midnight) |
| Surface | `#1A1A1A` (Obsidian) |
| Cream Text | `#F7F3EE` |
| Accent Green | `#1A3D2B` (Emerald) |
| Display Font | Cormorant Garamond (serif) |
| UI Font | Josefin Sans |
| Arabic Font | Amiri |

---

## 📁 Project Structure

```
backend/
  models/       User, Product, Order schemas
  routes/       auth, products, cart, orders
  middleware/   JWT auth middleware
  server.js     Express app entry point
  seedAdmin.js  Admin user seeder

frontend/src/
  app/
    page.js               Homepage
    products/page.js      Product listing
    products/[id]/page.js Product detail
    login/page.js         Login
    register/page.js      Register
    checkout/page.js      Checkout
    orders/page.js        My orders
    admin/products/page.js Admin panel
  components/
    Navbar.js     Navigation
    CartDrawer.js Slide-out cart
    ProductCard.js Product card
    Footer.js     Footer
  context/
    AuthContext.js  User auth state
    CartContext.js  Cart state
  lib/
    api.js  All API calls
```

---

## 🤲 Bismillah

*"وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ"*
*"And my success is not but through Allah"* — Quran 11:88
