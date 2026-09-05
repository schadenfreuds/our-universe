# ✨ Our Universe — Aesthetic Cosmic Anniversary & Memory Vault Web App

> **A celestial love journey crafted with code.** An open-source, modern, and aesthetic web experience designed for couples to celebrate their journey together. Features a scroll-driven 3D cosmic starfield, a real-time live ticking counter, and an anniversary-protected memory vault.

[🇹🇷 Türkçe Dökümantasyon İçin Buraya Tıklayın](./README_TR.md)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
![License: MIT](https://img.shields.io/badge/License-MIT-rose.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-cyan.svg)

---

## 🌟 Key Features

- 🌌 **Scroll-Driven 3D Starfield Parallax:** Pure HTML5 Canvas 60 FPS cosmic experience. As you scroll down through the memories, the camera glides through layers of stars and shifting nebulae.
- ⏱️ **Live Ticking Anniversary Counter:** Live calculation of elapsed days, hours, minutes, and seconds from your special date, ticking in real-time in glowing glass tiles.
- 🔒 **Anniversary-Protected Memory Vault:** The memory timeline remains locked like a cosmic safe box until your partner inputs your anniversary date (supports multiple flexible formats like `07.09`, `07092024`, `07/09`).
- 📸 **Smart In-Browser Retina Image Compression:** Upload high-res (8–12 MB) camera photos straight from your phone. The built-in client-side canvas compressor automatically optimizes them to 1800px 2K Retina (~250 KB) with zero noticeable loss in quality!
- ⚙️ **Integrated Zero-Code Admin Dashboard:** Click the lock icon in the top header (default PIN: `0411`) to edit names, dates, upload photos, and update captions directly in your browser. Auto-saves locally to `story.json`.
- 🎵 **Built-in Ambient Music Player:** Includes peaceful background music with a sound toggle.
- 🌍 **Bilingual Support (EN / TR):** Seamless one-click language switcher (`EN 🌍 | TR 🇹🇷`) persisted in local storage.

---

## 🚀 Quickstart (1 Minute Setup)

```bash
# 1. Clone the repository
git clone https://github.com/schadenfreuds/our-universe.git

# 2. Navigate into project directory
cd our-universe

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🛠️ Customization (2 Easy Methods)

### Option A: Using the Admin Dashboard (Recommended)
1. Open the site in your browser.
2. Click the 🔒 **Lock** icon in the top-right corner of the header.
3. Enter the default PIN: **`0411`** (customizable inside the panel).
4. In the **General Settings** tab:
   - Change your names, story title, anniversary date, and unlock password.
5. In the **Memory Vault** tab:
   - Upload your couple photos, set dates, locations, and romantic captions.
6. In the **Security & Vault** tab:
   - Customize your secret unlock question, hint placeholder, and vault password.
7. Hit **Save & Update**. Everything updates instantly without touching code!

### 📸 Recommended Photo Guidelines & Aspect Ratio

To achieve the cleanest, most aesthetic polaroid look on your memory cards:
- **Recommended Aspect Ratio:** **4:3 (Landscape / Horizontal)** or **1:1 (Square)**.
- **Recommended Resolution:** `1200 x 900 px` or `1600 x 1200 px` (higher camera resolutions are fully supported).
- **Supported Formats:** JPG, JPEG, PNG, WebP.
- **Automatic In-Browser Compression:** You never need to manually crop or resize high-res phone pictures! The integrated canvas compressor automatically downscales 10+ MB photos to crisp 1800px 2K Retina images (~200 KB) right in your browser with zero quality loss.

### Option B: Direct Config (`src/data/story.json`)
All story metadata, dates, and memories are cleanly stored in `src/data/story.json`:
```json
{
  "general": {
    "title": "Our Universe",
    "subtitle": "Under the stars, every second with you...",
    "creatorName": "Alex",
    "partnerName": "Emma",
    "startDate": "2024-09-07T00:00:00",
    "anniversaryPassword": "0709",
    "secretPin": "0411"
  }
}
```

---

## 🌐 Free 1-Click Deployment (Vercel)

1. Push this repository to your GitHub account.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your repository and click **Deploy**.
4. In less than 30 seconds, your unique custom link (e.g. `alex-emma.vercel.app`) is live worldwide for your partner!

---

## 💖 Contributing & Open Source
Contributions, pull requests, and feature ideas are warmly welcome! If you loved this template for your anniversary or gift, please leave a ⭐️ star on the repo!

## 📄 License
MIT License • Free to use, adapt, and share with your loved ones.
