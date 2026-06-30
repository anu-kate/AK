# Anturun V2 🚀

Anturun V2 is a comprehensive monorepo project designed for a modern delivery/ride-hailing platform. Built with a unified stack, it includes dedicated applications for customers, drivers, merchants, and administrators.

## 🏗️ Architecture

This project is structured as a monorepo using **NPM Workspaces** to share configurations and code across multiple applications. 

### 📱 Applications (`/apps`)
- **`customer`**: Application for end-users to place orders or request services.
- **`driver`**: Application for drivers to manage and fulfill requests.
- **`merchant`**: Application for merchants/partners to manage their store and incoming orders.
- **`admin`**: Dashboard for system administrators to monitor and manage the platform.

### 📦 Packages (`/packages`)
- **`config`**: Shared configurations.
- **`shared`**: Shared components, utilities, and composables used across multiple apps.

## 🛠️ Technology Stack

- **Frontend Framework**: [Vue 3](https://vuejs.org/) (Composition API & `<script setup>`)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Mobile Support**: [Capacitor](https://capacitorjs.com/) (for Android/iOS native builds)
- **Backend/Database**: [Supabase](https://supabase.com/)
- **Maps/Location**: [Leaflet](https://leafletjs.com/)

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/)
- [NPM](https://www.npmjs.com/) 

### Installation

1. Install dependencies at the root level (this will install dependencies for all workspaces):
   ```bash
   npm install
   ```

### Development Scripts

You can run individual apps or all of them concurrently from the root directory using the scripts defined in `package.json`.

**Run all applications simultaneously:**
```bash
npm run dev:all
```

**Run individual applications:**
- Customer App: `npm run dev:customer`
- Merchant App: `npm run dev:merchant`
- Driver App: `npm run dev:driver`
- Admin App: `npm run dev:admin`

## 🗄️ Backend / Database Setup
This project uses **Supabase**.
- Database schemas and migrations can be found in `skema_cloud.sql` or inside the `supabase` directory.
- Ensure you have the appropriate Supabase credentials configured for the applications to connect properly.
