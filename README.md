# 🏋️‍♂️ GymFinder Riyadh | جِم فايندر الرياض

<div align="center">

**Your Gateway to Fitness in Riyadh**  
**بوابتك للياقة البدنية في الرياض**

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

*Discover, Compare, and Join the Best Gyms in Riyadh*  
*اكتشف، قارن، وانضم لأفضل صالات الرياضة بالرياض*

</div>

## 📂 Project Structure | هيكل المشروع

```
GymFinderRiyadh/
│
├── 📁 frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/            # React Components
│   │   │   ├── Header.jsx        # Navigation Bar
│   │   │   ├── Landing.jsx       # Hero Section
│   │   │   ├── About.jsx         # About Section
│   │   │   ├── GymCard.jsx       # Gym Display Card
│   │   │   ├── GymDetail.jsx     # Detailed Gym View
│   │   │   ├── SearchBar.jsx     # Search & Filter
│   │   │   └── ContactForm.jsx   # Contact Section
│   │   ├── contexts/              # React Contexts
│   │   │   ├── LanguageContext.jsx
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx               # Main App Component
│   │   └── main.jsx              # Entry Point
│   ├── public/                    # Static Assets
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── 📁 backend/                     # FastAPI Backend
│   ├── app/
│   │   ├── models/               # Database Models
│   │   │   ├── gym.py
│   │   │   ├── user.py
│   │   │   └── message.py
│   │   ├── routers/              # API Routes
│   │   │   ├── auth.py          # Authentication
│   │   │   ├── gyms.py          # Gym CRUD
│   │   │   ├── users.py         # User Management
│   │   │   └── admin.py         # Admin Panel
│   │   ├── templates/            # Admin Templates (Jinja2)
│   │   ├── database.py           # DB Configuration
│   │   ├── main.py              # FastAPI App
│   │   └── config.py            # Settings
│   ├── alembic/                  # Database Migrations
│   ├── gym_finder.db            # SQLite Database
│   ├── requirements.txt
│   └── import_scripts/          # Data Import Tools
│
├── 📄 README.md                    # هذا الملف
└── 📄 .gitignore
```

## 💡 The Problem | المشكلة

في الرياض، الناس يواجهون صعوبة في العثور على الجيم المناسب:
- معلومات الجيمات متفرقة في أماكن كثيرة
- صعوبة المقارنة بين الخيارات المتاحة
- عدم وضوح المرافق والخدمات المقدمة
- صعوبة التواصل المباشر مع الأندية

**In Riyadh, fitness enthusiasts face real challenges:**
- Gym information is scattered across multiple platforms
- No easy way to compare facilities and services
- Lack of clear, comprehensive details
- Difficult to contact gyms directly

## 🎯 Our Solution | الحل

**GymFinder Riyadh** - منصة واحدة تجمع كل شي!

A **centralized, smart platform** that brings everything together in one seamless experience.

## 🌟 What Makes Us Different | ايش يميزنا

**GymFinder Riyadh** مو بس موقع عادي للبحث عن الجيمات - هو تجربة متكاملة مصممة خصيصًا للسوق السعودي!

**GymFinder Riyadh** isn't just another gym directory - it's a complete fitness discovery platform crafted specifically for the Saudi market!

### ✨ Key Highlights | المميزات الرئيسية

- 🌍 **True Bilingual Experience** - واجهة ثنائية اللغة كاملة (عربي/إنجليزي) مع دعم RTL/LTR
- 🎯 **Smart Search & Filters** - ابحث بالاسم، الحي، أو نوع النادي (رجالي/نسائي/مختلط)
- 📱 **Fully Responsive** - يشتغل على كل الأجهزة بسلاسة
- 🔐 **Secure Authentication** - نظام تسجيل دخول آمن مع استعادة كلمة المرور
- 📧 **Direct Contact System** - تواصل مباشر مع الأندية عبر نموذج متكامل
- 👑 **Admin Dashboard** - لوحة تحكم شاملة لإدارة الجيمات والمستخدمين والرسائل
- ⚡ **Lightning Fast** - أداء فائق مع Redis caching
- 🎨 **Single Page Experience** - تجربة صفحة واحدة سلسة مع انتقالات ناعمة
- 📊 **Comprehensive Gym Info** - صور، مرافق، ساعات العمل، الأسعار، وسائل التواصل

---

## 🔌 API Documentation | توثيق الـ API

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | تسجيل مستخدم جديد |
| `POST` | `/api/auth/login` | تسجيل الدخول |
| `POST` | `/api/auth/logout` | تسجيل الخروج |
| `POST` | `/api/auth/forgot-password` | استعادة كلمة المرور |

### Gyms Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/gyms` | جلب جميع الجيمات (مع البحث والفلترة) |
| `GET` | `/api/gyms/{id}` | جلب تفاصيل جيم معين |
| `POST` | `/api/gyms` | إضافة جيم جديد (Admin only) |
| `PUT` | `/api/gyms/{id}` | تحديث معلومات جيم (Admin only) |
| `DELETE` | `/api/gyms/{id}` | حذف جيم (Admin only) |

### Users Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users/profile` | جلب ملف المستخدم الشخصي |
| `PUT` | `/api/users/profile` | تحديث الملف الشخصي |
| `GET` | `/api/users` | جلب جميع المستخدمين (Admin only) |

### Messages Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/messages` | إرسال رسالة تواصل |
| `GET` | `/api/messages` | جلب جميع الرسائل (Admin only) |

### Example Request

```javascript
// البحث عن الجيمات
fetch('http://localhost:8000/api/gyms?district=الملقا&gender=نسائي', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 🚀 Overview | نظرة عامة

في عالم يزداد فيه الوعي الصحي يوم بعد يوم، وجدنا أن الناس في الرياض يحتاجون منصة موثوقة وسهلة للعثور على النادي المناسب. **GymFinder Riyadh** جاء ليحل هذي المشكلة!

In a world where health awareness grows daily, we identified a gap: Riyadh needed a reliable, user-friendly platform to discover the perfect gym. **GymFinder Riyadh** fills that gap!

## 📸 Screenshots

### 🏠 Landing Page
![GymFinder Riyadh Landing Page](./assets/photo_2025-11-12_20.43.04.jpeg)

---

### 🔍 Filter Menu
![GymFinder Riyadh Filter Menu](./assets/photo_2025-11-12_20.43.07.jpeg)

---

### 💪 Gym Cards Display
![GymFinder Riyadh Gyms List](./assets/photo_2025-11-12_20.43.12.jpeg)

---

## 🎬 Features Showcase | استعراض المميزات

### 🔍 For Gym Seekers | للباحثين عن الجيمات

```
✓ اكتشف أفضل الجيمات حولك حسب الحي
✓ قارن الأسعار والمرافق والخدمات
✓ شاهد صور حقيقية وساعات العمل
✓ فلتر حسب النوع (رجالي/نسائي/مختلط)
✓ تواصل مباشرة مع إدارة النادي
✓ احفظ مفضلاتك في حسابك الشخصي
```

### 👑 For Administrators | للمديرين

```
✓ إدارة كاملة للجيمات (إضافة/تعديل/حذف)
✓ متابعة الرسائل والاستفسارات الواردة
✓ إدارة حسابات المستخدمين
✓ رفع الصور وتحديث المعلومات
✓ إحصائيات شاملة عن النظام
✓ نظام آمن محمي بصلاحيات
```

---

## 🏗️ Architecture | البنية التقنية

<div align="center">

```
┌─────────────────────────────────────────────────┐
│           Frontend - React + Vite                │
│    (TailwindCSS, Context API, Lucide Icons)     │
└──────────────────┬──────────────────────────────┘
                   │ RESTful APIs
                   ▼
┌─────────────────────────────────────────────────┐
│          Backend - FastAPI + SQLAlchemy          │
│     (Authentication, CRUD, Email Service)        │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
   ┌─────────┐          ┌──────────┐
   │  SQLite │          │  Redis   │
   │   DB    │          │  Cache   │
   └─────────┘          └──────────┘
```

</div>

---

## 🛠️ Tech Stack | التقنيات المستخدمة

### Frontend الواجهة الأمامية
- ⚛️ **React 18+** with Vite - للأداء الفائق
- 🎨 **TailwindCSS** - للتصميم العصري
- 🎯 **Context API** - لإدارة الحالة
- 🔔 **Lucide Icons** - للأيقونات الجميلة

### Backend الخلفية
- 🚀 **FastAPI** - أسرع framework في Python
- 🗄️ **SQLAlchemy** - للتعامل مع قاعدة البيانات
- 🔐 **JWT Authentication** - للأمان
- 📧 **MailTrap** - لإرسال الإيميلات
- ⚡ **Redis** - للتخزين المؤقت

### DevOps الأدوات
- 🔄 **Alembic** - لإدارة الـ migrations
- 📦 **Uvicorn** - خادم ASGI عالي الأداء
- 🛡️ **CORS** - للأمان وإدارة الطلبات

---

## 📋 Quick Start | البداية السريعة

### المتطلبات | Prerequisites

```bash
• Python 3.8+
• Node.js 16+
• npm أو yarn
• Git
```

### التثبيت | Installation

#### 1️⃣ استنسخ المشروع | Clone the Repository

```bash
git clone https://github.com/yourusername/GymFinderRiyadh.git
cd GymFinderRiyadh
```

#### 2️⃣ اعداد الخلفية | Backend Setup

```bash
cd backend

# انشئ بيئة افتراضية
python3 -m venv venv

# فعّل البيئة الافتراضية
source venv/bin/activate  # Mac/Linux
# أو
venv\Scripts\activate     # Windows

# ثبّت المتطلبات
pip install -r requirements.txt

# شغّل الخادم
uvicorn app.main:app --reload
```

✅ الخلفية شغالة على `http://localhost:8000`

#### 3️⃣ اعداد الواجهة | Frontend Setup

```bash
cd frontend

# ثبّت الحزم
npm install

# شغّل السيرفر
npm run dev
```

✅ الموقع شغال على `http://localhost:5173`

---
---

## 🚧 Development Journey | رحلة التطوير

### المرحلة الأولى | Stage 1: Foundation
- ✅ إعداد البيئة التطويرية
- ✅ تصميم قاعدة البيانات
- ✅ استيراد بيانات الجيمات الأولية

### المرحلة الثانية | Stage 2: Backend Core
- ✅ بناء API endpoints
- ✅ نظام المصادقة والتوثيق
- ✅ عمليات CRUD للجيمات
- ✅ إعداد Alembic migrations

### المرحلة الثالثة | Stage 3: Frontend Magic
- ✅ تطوير المكونات الأساسية
- ✅ ربط الـ APIs
- ✅ نظام اللغات والـ Context

### المرحلة الرابعة | Stage 4: Advanced Features
- ✅ لوحة تحكم الأدمن
- ✅ نظام الإيميلات
- ✅ Redis caching
- ✅ تحسينات الأمان

### المرحلة النهائية | Final Stage: Polish
- ✅ تحويل لصفحة واحدة سلسة
- ✅ إضافة الأنيميشن
- ✅ تحسين الأداء
- ✅ التوثيق الشامل

---

## 💪 Challenges We Crushed | التحديات اللي تغلبنا عليها

| التحدي 🚧 | الحل 💡 |
|---------|--------|
| **استعلامات SQL بطيئة** | حسّنا الـ queries وضفنا Redis للكاش |
| **التبديل بين RTL/LTR** | استخدمنا Tailwind الديناميكي مع Context |
| **Header ثابت مع Smooth Scroll** | حسبنا ارتفاع الـ header وضبطنا الـ scroll |
| **اختبار الإيميلات** | دمجنا MailTrap للاختبار الآمن |
| **تحسين الصفحة الواحدة** | أعدنا هيكلة الكومبوننتس وقللنا الترانزشن |

---

## 🔮 Future Roadmap | خارطة الطريق

### قريب جدًا | Coming Soon
- [ ] 📊 لوحة تحليلات متقدمة
- [ ] 💳 نظام الدفع والاشتراكات
- [ ] 🗺️ تكامل مع Google Maps
- [ ] ⭐ نظام التقييمات والمراجعات

### قيد التخطيط | In Planning
- [ ] 📱 تطبيق موبايل (React Native)
- [ ] 🤖 توصيات ذكية مخصصة
- [ ] 🌙 الوضع الليلي
- [ ] ♿ تحسينات الوصول للجميع
- [ ] 📅 نظام الحجز المباشر

---

## 👥 The Dream Team | الفريق الحالم
<table>
  <tr>
    <td align="center">
      <sub>👩‍💻</sub><br />
      <sub><b>Nada</b></sub><br />
      <sub>Project Lead & Frontend Design</sub>
    </td>
    <td align="center">
      <sub>👩‍💻</sub><br />
      <sub><b>Shouq</b></sub><br />
      <sub>Frontend Design & QA</sub>
    </td>
    <td align="center">
      <sub>👩‍💻</sub><br />
      <sub><b>Bushra</b></sub><br />
      <sub>UI Implementation & Backend</sub>
    </td>
    <td align="center">
      <sub>👩‍💻</sub><br />
      <sub><b>Munira</b></sub><br />
      <sub>Data Integration</sub>
    </td>
  </tr>
</table>


---

## 🙏 Acknowledgments | شكر وتقدير

<div align="center">

### شكرًا خاصًا لـ | Special Thanks To

**🎓 Tuwaiq Academy**  
على دعمهم المستمر وتوفير بيئة تعليمية ممتازة

**🎓 Holberton School**  
على التدريب العملي المكثف في تطوير Full Stack

---

بدونهم، ما كان هالمشروع يشوف النور! 🌟  
*Without them, this project wouldn't have seen the light!*

</div>

---

<div align="center">

### صُنع بـ ❤️ في الرياض | Made with ❤️ in Riyadh

**Star ⭐ the repo if you like it!**  
**نجمّ المشروع اذا عجبك! ⭐**

[⬆ Back to Top](#-gymfinder-riyadh--جم-فايندر-الرياض)

</div>
