# 🔮 AstroBrand Lab

> **Turn Your Astrology into a Powerful Personal Brand & High-Converting Landing Page.**

AstroBrand is a complete, full-stack digital growth platform built specifically for Vedic Astrologers, Tarot Masters, and Numerologists. It empowers practitioners to create branded luxury landing pages, connect custom domains, manage service offerings, capture client consultation enquiries, and automate WhatsApp bookings.

---

## 🌟 Key Features

- **Luxury Astrology Landing Page Builder**:
  - Celestial hero section with real astrologer portrait and sacred geometry accents
  - Live preview across Desktop, Tablet, and Mobile devices
  - Customizable color palettes, typography (Cormorant Garamond, Cinzel, Plus Jakarta Sans), and section visibility
- **Full Authentication System**:
  - Secure signup & login with JWT authentication and persistent sessions
  - Role-based profiles with custom brand names and bio synchronization
- **Custom Domain & DNS Automation**:
  - Connect apex domains (`example.com`) and subdomains (`www.example.com`)
  - Automated DNS verification instructions (A, CNAME, and TXT records)
  - Integration guides for GoDaddy, Hostinger, Namecheap, and Cloudflare
  - Free automated 256-bit Let's Encrypt SSL management
- **Service Catalog & Booking System**:
  - Complete interactive CRUD for astrology consultation offerings
  - 1-click active/disabled toggle (instantly syncs with public landing page)
  - Comprehensive birth details collection (Date, Exact Time, Place)
- **Direct WhatsApp Conversion Engine**:
  - 1-click client appointment confirmation via WhatsApp
  - Automated pre-filled consultation request messages

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS with custom design system
- **Icons**: Lucide React
- **Animations**: AOS + CSS keyframe transitions
- **Routing**: React Router DOM v6
- **State Management**: React Context (`AuthContext`, `WebsiteContext`)

### Backend (`/server`)
- **Runtime**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs
- **Domain Middleware**: Dynamic multi-tenant custom domain routing
- **File Uploads**: Multer (profile photos, banner assets)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or MongoDB Atlas connection URI

### 1. Backend Setup
```bash
cd server
npm install
# Configure your environment variables in server/.env
npm run dev
# Server runs on http://localhost:5005
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
# Vite client runs on http://localhost:5173
```

---

## 📄 License
MIT License © 2026 AstroBrand Lab
