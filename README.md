
---

# 🏥 Healthy Gut AI — SEO Article Generation System

**AI-Powered SEO Content Generator • MERN Stack • JWT Auth • Tailwind UI • n8n Automation**

A modern, full-stack SEO article generation platform built using the **MERN** stack with **JWT authentication**, **AI-powered content generation**, **PDF export**, **JSON-LD schema**, and **workflow automation using n8n**.

This system generates SEO-optimized articles (pillar + supporting), includes a beautiful dark UI, and supports automated article workflows.

---

## 🌟 Features Overview

### 🔐 Authentication & Users

* Secure login & registration
* JWT-based authentication
* Protected routes
* Bcrypt password hashing
* Persistent login

### 📝 AI-Powered Article Generation

* Pillar articles (2500–3000 words)
* Supporting articles (1000–1500 words)
* SEO meta descriptions
* JSON-LD schema markup
* FAQ generation
* PDF export

### 🎨 Frontend (React + Tailwind CSS)

* Fully responsive dark theme
* Framer Motion animations
* Dashboard with article cards
* Skeleton loaders
* Toast notifications

### 🛠 Backend (Node.js + Express)

* REST API architecture
* MongoDB + Mongoose
* Rate limiting
* Error-handling middleware
* Input validation
* AI service integration (Gemini or Simulator)

### 🔄 n8n Workflow Automation

* Auto-generate articles via API
* Manual & scheduled workflows
* Bulk generation support
* Workflow JSON export

---

# 📁 Project Structure

```
Article Generating System/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                      # Express Backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   ├── test-api.js
│   ├── test-register.js
│   ├── test-create-article.js
│   ├── test-ai-status.js
│   ├── run-tests.js
│   ├── check-env.js
│   ├── start.bat
│   ├── start.ps1
│   ├── index.js
│   └── package.json
│
├── n8n/
│   └── workflows/
│       └── article-generation.json
│
├── screens/
│   ├── homePage.png
│   ├── register.png
│   ├── login.png
│   ├── Dashboard.png
│   ├── generate-article.png
│   ├── content.png
│   ├── settings.png
│   └── n8nWrorkflow.png
│
└── README.md
```

---

# 🚀 Getting Started

## 1️⃣ Clone Repository

```bash
git clone https://github.com/asifmohd01/Article-generating-System
cd "Article-generating-System"
```

---

## 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env`:

```env
PORT=4000
MONGO_URL=your_mongodb_url
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

AI_API_KEY=your_gemini_key
AI_API_PROVIDER=gemini
```

Start backend (development):

```bash
npm run dev
```

Start backend (production):

```bash
npm start
```

---

## 3️⃣ Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

Open in browser:
👉 [http://localhost:5173](http://localhost:5173)

---

## 4️⃣ n8n Setup (Automation)

Install n8n globally:

```bash
npm install -g n8n
```

Start n8n:

```bash
n8n start
```

Open n8n dashboard:
👉 [http://localhost:5678](http://localhost:5678)

### Import Workflow

```
n8n → Workflows → Import → article-generation.json
```

### Configure HTTP Request Node

```
POST http://localhost:4000/articles/create

Headers:
Authorization: Bearer <your_token>
Content-Type: application/json

Body:
{
  "title": "Test Article From n8n",
  "primaryKeyword": "gut health",
  "articleType": "pillar"
}
```

---

# 🧪 Testing

All tests are located inside `/server`.

### Run full test suite:

```bash
cd server
npm test
```

### Run individual tests:

```bash
node test-api.js
node test-register.js
node test-create-article.js
node test-ai-status.js
```

Tests include:
✔ API health check
✔ User registration
✔ Login
✔ Article creation
✔ AI service checks
✔ Environment validation

---

# 🖼 Screenshots

### 🏠 Home

![Home](screens/homePage.png)

### 📝 Register

![Register](screens/register.png)

### 🔐 Login

![Login](screens/login.png)

### 📊 Dashboard

![Dashboard](screens/Dashboard.png)

### ✍️ Create Article

![Create Article](screens/generate-article.png)

### 📖 View Article

![View Article](screens/content.png)

### ⚙️ Settings

![Settings](screens/settings.png)

### 🔄 n8n Workflow

![n8n Workflow](screens/n8nWrorkflow.png)

---

# 🧩 API Endpoints

## Authentication

```
POST /auth/register
POST /auth/login
POST /auth/forgot-password
POST /auth/reset-password
GET  /auth/verify
GET  /auth/ai-status
```

## Articles (Protected)

```
POST   /articles/create
GET    /articles
GET    /articles/:id
PUT    /articles/:id
DELETE /articles/:id
```

---

# 🗃 Technologies Used

### **Frontend**

* React 18
* Vite
* Tailwind CSS
* Framer Motion
* Axios
* jsPDF + html2canvas
* React Hot Toast

### **Backend**

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Bcrypt
* Rate Limiting
* dotenv

### **Automation**

* n8n
* Scheduling
* HTTP Request nodes

---

# 🛡 Security

* Protected API routes
* JWT-based authentication
* Hashed passwords
* CORS enabled
* Express rate limiter


---

# 🙋 Support

If you face issues:

1. Check troubleshooting
2. Verify `.env`
3. Restart backend / n8n
4. Run tests

---

# ❤️ Built for AI-Powered SEO Content Generation

---


