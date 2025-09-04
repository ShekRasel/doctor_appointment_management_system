# 🩺 Appointment Management System

This is a **Next.js  (App Router)** project built with **TypeScript** that provides a modern appointment booking and management system for doctors and patients.  

It’s designed with scalability and performance in mind, following best practices for state management, API communication, and form validation.  

---

## 🚀 Tech Stack

- **Next.js 14 (App Router)** – fullstack React framework
- **TypeScript** – type-safe development
- **Zod** – schema validation
- **React Hook Form** – form handling + Zod integration
- **Zustand** – lightweight state management
- **React Query (TanStack Query)** – server state & caching
- **Axios** – HTTP requests
- **React Hot Toast** – elegant toast notifications
- **Tailwind CSS** – utility-first styling
- **JWT Decode** – decoding tokens client-side
- **ESLint + Prettier** – linting & formatting
- **Render / Vercel Ready** – for deployment

---

## ✨ Features

- 🔐 **Authentication**
  - JWT based login / signup
  - Role based (Doctor / Patient)

- 📅 **Appointment Management**
  - Doctors can view patient appointments (paginated)
  - Filters by **date** and **status** (Pending, Complete, Cancelled)
  - Update status in real-time with confirmation dialogs
  - Patients can book appointments
  - Realtime search and filter use

- 👤 **Profile**
  - Token decoded client-side → build profile UI
  - Profile photo with fallback avatar
  - Doctor specialization, email, join date

- 🎨 **UI/UX**
  - Responsive layout with **Sidebar + Fixed Navbar**
  - Smooth feedback with toast notifications
  - Loading & disabled states for API actions

---

## 🛠️ Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/appointment-system.git
   cd appointment-system
