# 🏋️‍♂️ GymFinder Riyadh

**GymFinder Riyadh** is an interactive digital platform that helps residents and visitors of Riyadh discover, compare, and explore gyms easily.  
It provides a seamless bilingual experience (Arabic & English) with modern UI/UX tailored to local culture and preferences.

---

## 🚀 Overview

GymFinder Riyadh allows users to:
- Search and filter gyms by name, district, or category.
- View detailed gym information (facilities, timings, and photos).
- Register and log in for a personalized experience.
- Contact gyms directly via an integrated message system.
- Access an admin panel to manage users, gyms, and messages.

This project combines a **React frontend** with a **FastAPI backend** to deliver a smooth, single-page experience with high performance and scalability.

---

## 🧱 System Architecture

**Architecture Type:** Full Stack Application


- **Frontend:** Built with React (Vite) using TailwindCSS and Lucide Icons.
- **Backend:** FastAPI with SQLAlchemy, Alembic, Redis caching, and MailTrap integration.
- **Database:** SQLite (with migration path to PostgreSQL/MySQL).
- **Communication:** RESTful APIs for authentication, users, gyms, messages, and admin operations.
- **Caching & Sessions:** Redis.
- **Mail Services:** MailTrap SMTP for safe message delivery.

---

## 🧰 Tech Stack

| Layer | Tools & Frameworks |
|-------|--------------------|
| **Frontend** | React (Vite), JavaScript (ES6+), JSX, TailwindCSS, Lucide Icons |
| **State Management** | React Context API (language, authentication) |
| **Backend** | Python, FastAPI, Uvicorn, SQLAlchemy, Alembic, Redis |
| **Database** | SQLite (`gym_finder.db`) |
| **Build & Tooling** | Node.js, npm, Vite, PostCSS, Virtualenv |
| **Email Service** | MailTrap SMTP |
| **API Type** | RESTful Endpoints |

---

## ✨ Main Features

- Animated **one-page landing experience** with anchor navigation.  
- **Search & filter system** for gyms (by name, area, type).  
- **Gym details page** with facilities, images, and opening hours.  
- **User authentication**: sign up, login, password recovery, and profile dashboard.  
- **Admin dashboard** for managing gyms, users, and messages.  
- **Contact form** integrated with backend email service.  
- **Bilingual support (Arabic & English)** with dynamic RTL/LTR switching.  
- **Responsive design** with smooth scroll and transition effects.  

---

## 🧩 Development Stages

| Stage | Description |
|--------|-------------|
| **Stage 1 – Initialization** | Set up FastAPI & Vite environments, imported initial gym dataset. |
| **Stage 2 – Backend API** | Built SQLAlchemy models, authentication routes, CRUD for gyms, and Alembic migrations. |
| **Stage 3 – Frontend Core** | Developed React components (Header, Search, Gym Cards), integrated APIs, and language context. |
| **Stage 4 – Admin & Integrations** | Implemented admin dashboard, Redis caching, email handling, and security improvements. |
| **Final Stage – One-Page Experience** | Combined all sections into a single smooth page, added animations, polished responsiveness, and finalized documentation. |

---

## 🧠 Challenges & Solutions

| Challenge | Solution |
|------------|-----------|
| **Slow SQL queries** | Optimized ORM queries and added optional Redis caching. |
| **RTL/LTR layout switching** | Used dynamic TailwindCSS classes and React Context for language state. |
| **Sticky header with smooth scroll** | Calculated header height and applied `scroll-margin-top` for consistent behavior. |
| **Email delivery testing** | Integrated MailTrap to test contact form emails securely. |
| **Single-page optimization** | Restructured components and minimized route transitions for smooth UX. |

---

## 🔮 Future Enhancements

- **Analytics dashboard** for tracking user interactions.  
- **Migration to PostgreSQL** with optional payment/subscription features.  
- **Mobile app version** using React Native or Flutter.  
- **Personalized gym recommendations** via user preferences and behavior tracking.  
- **Third-party integrations:** Google Maps, live reviews, gym booking systems.  
- **Accessibility improvements:** dark mode, keyboard navigation, screen-reader support.

---

## 📂 Folder Structure


---
### ⚙️ Installation & Setup

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/GymFinderRiyadh.git
cd GymFinderRiyadh
```

#### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 👥 Contributors

| Name | Role |
|------|------|
| Nada | Project Lead, Frontend Design |
| Shouq | Frontend Design & UI Implementation |
| Nada, Munira, Shouq | Backend Support, Data Integration, QA |

---

## 📜 License

This project is released under the **MIT License**.

You are free to use, modify, and distribute it with attribution.

---

## 💬 Acknowledgments

Special thanks to **Tuwaiq Academy** and **Holberton School** for their guidance, mentorship, and continuous support throughout this project.

Their hands-on full-stack development training enabled our team to build GymFinder Riyadh with professionalism, collaboration, and creativity.
