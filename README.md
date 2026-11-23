# LabLink - GenAI Campus Laboratory Resource Sharing

![LabLink Banner](https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop)

## 📖 Overview

**LabLink** is a GenAI-powered platform designed to solve the fragmentation of campus laboratory resources. Students often struggle to discover, book, and get approval for specialized equipment across different departments. LabLink provides a centralized, intelligent hub for resource allocation.

Built for the **PromptWars x Cynergy Coding Club Hackathon**.

## ✨ Key Features

- **🧠 GenAI Conflict Resolution:** A smart engine that analyzes booking requests, reads project justifications, and intelligently resolves scheduling conflicts by suggesting alternative equipment or time slots.
- **⏱️ Time-Slot Collision Detection:** The system prevents double-booking and visually disables already reserved time slots.
- **🏢 Cross-Department Discovery:** A unified catalog of equipment (Microscopes, 3D Printers, Oscilloscopes, etc.) with live status tracking, search, and sorting.
- **👨‍🏫 Faculty Approval Portal:** A dedicated dashboard for faculty members to review, approve, reject, and export project-based access requests.
- **📊 Live Analytics:** Real-time utilization metrics calculated dynamically based on active bookings, paired with a live activity feed.
- **💾 State Persistence:** All bookings, requests, and favorites are saved locally via `localStorage`.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite
- **Styling:** Tailwind CSS (Custom Bento-Box layout, Glassmorphism)
- **Icons:** Lucide React
- **Testing:** Vitest, React Testing Library
- **Architecture:** Modularized into `components` (reusable UI) and `views` (page layouts) for maximum maintainability.

## 🚀 Getting Started Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/msanjan9980-eng/CampusLab-Allocator.git
   ```

2. **Navigate into the directory:**

   ```bash
   cd CampusLab-Allocator
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Run the test suite:**

   ```bash
   npm run test
   ```

## 🌐 Live Deployment

The application is deployed on Vercel:

https://campus-laballocator.vercel.app/

## 🔐 Demo Access

*No login is required for evaluation.*

Use the **"Demo Role View"** toggle at the bottom left of the sidebar to instantly switch between the **Student** view (to book equipment) and the **Faculty** view (to approve requests).

Use the **"Reset Demo Data"** button to clear the state and start fresh.