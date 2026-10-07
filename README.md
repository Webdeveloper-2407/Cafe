# Artisan Café — Full-Stack Coffee & Bakery Web Application

A full-stack, production-grade café website faithfully recreating the warm handcrafted aesthetic from the design reference, featuring online ordering, table reservations, blog, photo gallery, and an admin management console.

---

## ☕ Key Features

1. **Exact Visual Identity Matching Reference**:
   - Warm cream/beige background tones (`#FAF4ED`, `#EFE7DE`)
   - Classic serif headlines (*Playfair Display*) and script accents (*Alex Brush*)
   - Rounded espresso buttons (`#6B4226`) and delicate borders
   - Center-staged hero flatlay with artisan morning pastry and latte art arrangement
   - "Why Choose Us?" feature triad
   - "Our Menu Highlights" 4-column product showcase with dynamic database fetching
   - "Visit Us Today" editorial gallery composition with barista pour photography
   - Comprehensive footer with live newsletter subscription and social links

2. **Full-Stack REST Backend & Data Persistence**:
   - Built on Node.js + Express.js with clean modular routing
   - Document database store with atomic persistence in `.data/db.json` and full MongoDB/Mongoose compatibility via `MONGODB_URI`
   - Complete models: `User`, `MenuItem`, `Category`, `Order`, `Reservation`, `ContactMessage`, `NewsletterSubscriber`, `BlogPost`, `GalleryImage`
   - Initialized with realistic café seed data

3. **Customer Ordering & Cart Flow**:
   - Slide-out shopping bag drawer
   - Real-time quantity adjustment, item deletion, notes
   - Fulfillment selector: Store Pickup (Free) or Local Delivery ($3.50)
   - Dynamic taxes (8%) and subtotal calculations
   - Order confirmation screen with tracking ID (e.g. `CF-2026-101`) and timeline status

4. **Table Reservation System**:
   - Guest booking modal with date, time, party size, and special seating requests
   - Direct database submission with confirmation notification

5. **Contact & Newsletter**:
   - Working contact message form
   - Newsletter subscription with duplicate prevention and validation

6. **Admin Dashboard & Authentication**:
   - Secure JWT and salted hash password verification
   - Default demo admin: `admin@cafe.com` / `adminpassword123`
   - Real-time overview metrics: Total Orders, Revenue, Pending Bookings, Unread Inquiries, Subscribers
   - Menu Management: Add new item, toggle In-Stock/Out-of-Stock, delete item
   - Order Management: Status pipeline (`Pending` → `Confirmed` → `Preparing` → `Ready` → `Completed`)
   - Reservation management: One-click Confirm / Cancel
   - Message inbox & subscriber directory
   - System utility: One-click database reseed button

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express 4, TypeScript (`tsx`)
- **Database**: Document Database engine with `.data/db.json` persistence & optional MongoDB connection via `MONGODB_URI`
- **Build / Dev**: Vite 8 with Express integration

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key variables:
- `PORT=3000`
- `JWT_SECRET=your_secure_secret_key`
- `MONGODB_URI=mongodb://localhost:27017/cafe_db` *(Optional: If omitted, the embedded persistent document database is used automatically)*

### 3. Running in Development
Start the full-stack server (runs both Express REST API and Vite frontend on port 3000):
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Admin Login Credentials
Click **Admin Portal** in the website footer or navigate to the staff portal:
- **Email**: `admin@cafe.com`
- **Password**: `adminpassword123`

### 5. Production Build & Deployment
```bash
npm run build
npm start
```
This builds the optimized frontend client into `dist/` and launches the full-stack Express server.
