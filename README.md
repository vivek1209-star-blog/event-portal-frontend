# 🎨 Event Portal Frontend

This is the **frontend** for the Event Portal application, built with **React.js**, **React Router**, and **Axios**.
It connects to the backend API to manage authentication, events, and categories.

---

## 📂 Folder Structure

```
frontend/

 public/                 # Static files
 src/
 components/         # Reusable UI components
 pages/              # Application pages (Login, Register, Home, etc.)
 utils/              # Helper functions & API calls
 App.jsx             # Main App component
 main.jsx            # React entry point
 index.css           # Global styles
 package.json
 README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Navigate to frontend folder

```bash
cd frontend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create `.env` file

```env
VITE_API_URL=http://localhost:5000/api
```

### 4️⃣ Run the frontend

```bash
npm run dev
```

The app will be available at **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Features

* **Login / Register** with JWT
* **Single Login Enforcement** — Automatically logs out if logged in from another browser/device
* **Event Management** — Create, view, update, delete events
* **Category Management** — Create categories with parent-child relationships
* **Protected Routes** — Users must be logged in to access certain pages
* **Toast Notifications** for success/error messages

---

## 📌 Pages

| Page       | Path          | Description              |
| ---------- | ------------- | ------------------------ |
| Login      | `/login`      | Login to the application |
| Register   | `/register`   | Create a new account     |
| Home       | `/home`       | Dashboard                |
| Events     | `/events`     | Manage events            |
| Categories | `/categories` | Manage categories        |

---

## 🔄 API Communication

* All API calls are made using **Axios**.
* Base API URL is set in `.env` file using `VITE_API_URL`.
* Protected routes send the JWT token in the `Authorization` header.

Example:

```javascript
axios.get(`${import.meta.env.VITE_API_URL}/events`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

---

## 🚀 How to Run with Backend

1. **Start backend**:

   ```bash
   cd backend
   npm run dev
   ```
2. **Start frontend**:

   ```bash
   cd frontend
   npm run dev
   ```