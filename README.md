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

## 🌍 Deploy to Vercel (Frontend)

### Step 1: Push to GitHub
```bash
# In the frontend folder
git init
git add .
git commit -m "Gumnam Momina Frontend"
git remote add origin YOUR_GITHUB_REPO_URL
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-url.com/api`
5. Click Deploy!

---

## 🖥️ Deploy Backend (Railway / Render)

### Railway (Recommended)
1. Go to [railway.app](https://railway.app) → New Project
2. Deploy from GitHub (your backend folder)
3. Add these environment variables:
   ```
   MONGO_URI=your_atlas_uri
   JWT_SECRET=your_secret_key
   PORT=5000
   NODE_ENV=production
   ```
4. Railway gives you a URL like `https://your-app.railway.app`

### Then update Vercel:
- Update `NEXT_PUBLIC_API_URL` to `https://your-app.railway.app/api`

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
