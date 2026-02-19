# 🎯 Debate Management System

A full-stack, production-ready Debate Management Website built with the **MERN stack** (MongoDB, Express, React, Node.js). Admins manage debates and topics; users join debates through Clerk authentication and receive automatic email notifications.

---

## 📁 Project Structure

```
Debate/
├── backend/                  # Node.js + Express API
│   ├── config/
│   │   ├── db.js             # MongoDB connection
│   │   └── index.js          # Centralized env config
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── debateController.js
│   │   ├── topicController.js
│   │   ├── userController.js
│   │   └── webhookController.js
│   ├── middleware/
│   │   ├── adminAuth.js      # JWT verification for admin
│   │   └── clerkAuth.js      # Clerk user verification
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Debate.js
│   │   ├── Topic.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── debateRoutes.js
│   │   ├── topicRoutes.js
│   │   ├── userRoutes.js
│   │   └── webhookRoutes.js
│   ├── scripts/
│   │   └── seedAdmin.js      # Seeds default admin account
│   ├── utils/
│   │   ├── emailTemplates.js # HTML email templates
│   │   └── sendEmail.js      # Nodemailer utility
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/                 # React + Vite + TailwindCSS
    ├── src/
    │   ├── components/
    │   │   ├── ui/           # shadcn/ui components
    │   │   ├── AdminLayout.jsx
    │   │   ├── AdminSidebar.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── UserLayout.jsx
    │   ├── hooks/
    │   │   ├── use-toast.js
    │   │   ├── useAdminAuth.jsx
    │   │   └── useSyncUser.js
    │   ├── lib/
    │   │   └── utils.js
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── AdminLogin.jsx
    │   │   │   ├── ManageDebates.jsx
    │   │   │   ├── ManageTopics.jsx
    │   │   │   └── ManageUsers.jsx
    │   │   └── user/
    │   │       ├── Dashboard.jsx
    │   │       ├── DebateDetails.jsx
    │   │       ├── DebateList.jsx
    │   │       └── Profile.jsx
    │   ├── services/
    │   │   └── api.js        # All Axios API calls
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🛠️ Tech Stack

| Layer       | Technology                                           |
| ----------- | ---------------------------------------------------- |
| Frontend    | React 18, Vite, TailwindCSS, shadcn/ui, React Router |
| Backend     | Node.js, Express.js                                  |
| Database    | MongoDB Atlas, Mongoose                              |
| User Auth   | Clerk (signup, login, logout, protected routes)      |
| Admin Auth  | Email + Password → JWT (stored in MongoDB)           |
| Email       | Nodemailer (Gmail SMTP)                              |
| HTTP Client | Axios                                                |
| UI Icons    | Lucide React                                         |

---

## ⚙️ Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key

CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
EMAIL_FROM="Debate Management <noreply@debatemanagement.com>"

CLIENT_URL=http://localhost:5173
```

### Frontend — `frontend/.env`

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:5000/api
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords. Generate a 16-character password and use it as `SMTP_PASS`.

> **Clerk Keys:** Get from [https://dashboard.clerk.com](https://dashboard.clerk.com) → Your Application → API Keys.

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Clerk account
- Gmail account with App Password enabled

### 1. Clone and install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure environment files

Copy and fill in the values:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend — create manually
# Add VITE_CLERK_PUBLISHABLE_KEY and VITE_API_URL
```

### 3. Seed the Admin account

```bash
cd backend
npm run seed:admin
```

This creates the default admin account in MongoDB:

| Field    | Value              |
| -------- | ------------------ |
| Email    | `admin@debate.com` |
| Password | `admin123456`      |
| Name     | Super Admin        |

> **Important:** Change the password after first login by updating the database directly or adding a change-password feature.

### 4. Start the backend

```bash
cd backend
npm run dev        # Development (nodemon)
# or
npm start          # Production
```

Backend runs at: `http://localhost:5000`

### 5. Start the frontend

```bash
cd frontend
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## ☁️ Deploying to Vercel

The project is pre-configured for a **single Vercel deployment** — the frontend is served as static files and the backend runs as a serverless function, both under the same domain.

### How it works

| Path            | Handler                                      |
| --------------- | -------------------------------------------- |
| `/api/*`        | `api/index.js` → Express serverless function |
| Everything else | `frontend/dist` → Vite static build          |

### Steps

#### 1. Push to GitHub

Make sure your repository is pushed to GitHub (or GitLab/Bitbucket).

#### 2. Import on Vercel

Go to [vercel.com/new](https://vercel.com/new), import the repo, and use the **root** as the project root (leave "Root Directory" blank — the `vercel.json` handles everything).

#### 3. Add environment variables

In **Vercel → Project → Settings → Environment Variables**, add:

**Backend variables** (used by the serverless function):

| Variable               | Value                                                         |
| ---------------------- | ------------------------------------------------------------- |
| `MONGODB_URI`          | Your MongoDB Atlas connection string                          |
| `JWT_SECRET`           | A strong random secret                                        |
| `CLERK_SECRET_KEY`     | From Clerk dashboard                                          |
| `CLERK_WEBHOOK_SECRET` | From Clerk webhook settings                                   |
| `CLIENT_URL`           | Your Vercel frontend URL (e.g. `https://your-app.vercel.app`) |
| `SMTP_HOST`            | e.g. `smtp.gmail.com`                                         |
| `SMTP_PORT`            | `587`                                                         |
| `SMTP_USER`            | Your email address                                            |
| `SMTP_PASS`            | Your email app password                                       |
| `EMAIL_FROM`           | e.g. `noreply@your-app.com`                                   |

**Frontend variables** (must be prefixed with `VITE_`):

| Variable                     | Value                                    |
| ---------------------------- | ---------------------------------------- |
| `VITE_CLERK_PUBLISHABLE_KEY` | From Clerk dashboard (starts with `pk_`) |

> `VITE_API_URL` does **not** need to be set — it defaults to `/api`, which correctly hits the serverless function on the same domain.

#### 4. Deploy

Click **Deploy**. Vercel will:

1. Install dependencies for both `backend/` and `frontend/`
2. Build the frontend (`vite build`)
3. Serve static files from `frontend/dist/`
4. Handle all `/api/*` requests via the Express serverless function

#### 5. Update Clerk webhook URL

After deploy, update your Clerk webhook endpoint to:

```
https://your-app.vercel.app/api/webhooks/clerk
```

#### 6. Seed the admin (first deploy only)

Run the seed script locally against your production MongoDB URI:

```bash
cd backend
MONGODB_URI=mongodb+srv://... node scripts/seedAdmin.js
```

---

## 🔐 Authentication

### User Authentication — Clerk

Users sign up and log in using **Clerk**. On first login, Clerk user data is automatically synced to the MongoDB `users` collection via the `useSyncUser` hook. Protected user routes redirect to Clerk's sign-in page if not authenticated.

**Clerk Webhook (optional but recommended):**
Set your Clerk webhook URL to:

```
POST https://your-domain.com/api/webhooks/clerk
```

Events handled: `user.created`, `user.updated`, `user.deleted`

### Admin Authentication — JWT

Admins log in at `/admin` using email + password. A JWT token is returned and stored in `localStorage`. All admin API requests include this token in the `Authorization: Bearer <token>` header.

JWT tokens expire after **7 days**.

---

## 👤 Admin Panel

**URL:** `http://localhost:5173/admin`

**Default Credentials:**

```
Email:    admin@debate.com
Password: admin123456
```

### Admin Features

#### Dashboard (`/admin/dashboard`)

- Total Users count
- Total Debates count
- Upcoming Debates count
- Active Users count (users who joined at least one debate)

#### Manage Topics (`/admin/topics`)

- Create new topics with title and description
- View all topics with creation date
- Delete topics

#### Manage Debates (`/admin/debates`)

- Create debate with optional topic, date, time, and location
- Change debate status: `upcoming` → `active` → `completed` / `cancelled`
- **Reveal Topic** — sets `revealStatus: true` and sends email to all participants
- View participant count per debate
- Delete debates

#### Manage Users (`/admin/users`)

- View all registered users (synced from Clerk)
- See user name, email, avatar, debates joined count, and join date

---

## 👥 User Panel

**URL:** `http://localhost:5173` (requires Clerk login)

### User Features

#### Dashboard (`/`)

- Welcome message with user's first name
- Stats: Upcoming / Joined / Past debate counts
- Preview of upcoming debates with quick links

#### Debate List (`/debates`)

- Search debates by location, topic, or time
- Status badges: `Upcoming`, `Joined`, `Topic Revealed`, `Completed`, `Cancelled`
- Topics are **hidden** until admin reveals them (`🔒 Topic Hidden`)

#### Debate Details (`/debates/:id`)

- Full debate info: date, time, location, participants
- **Join** button (disabled if already joined or cancelled)
- Topic section — visible only after admin reveals it

#### Profile (`/profile`)

- User avatar, name, email
- Member since date
- Upcoming debates list
- Past debates history

---

## 📧 Email System

Emails are sent automatically using **Nodemailer** with Gmail SMTP.

### Email Triggers

| Event               | Recipients       | Subject                          |
| ------------------- | ---------------- | -------------------------------- |
| User joins debate   | The joining user | `🎯 Debate Joined Successfully!` |
| Admin reveals topic | All participants | `🔓 Debate Topic Revealed!`      |

### Email Content

**Debate Joined** includes:

- Date (formatted: Monday, February 19, 2026)
- Time
- Location
- Note that topic will be revealed later

**Topic Revealed** includes:

- Topic title (highlighted)
- Topic description
- Date, time, location
- Good luck message

> Email failures are logged but do not break the API response — the operation succeeds even if email delivery fails.

---

## 🗄️ Database Models

### `User`

```js
{
  clerkId:       String (unique, indexed),
  name:          String,
  email:         String (unique),
  avatar:        String,
  joinedDebates: [ObjectId → Debate],
  createdAt, updatedAt
}
```

### `Topic`

```js
{
  title:       String,
  description: String,
  createdBy:   ObjectId → Admin,
  createdAt, updatedAt
}
```

### `Debate`

```js
{
  topicId:      ObjectId → Topic (nullable),
  date:         Date,
  time:         String,
  location:     String,
  revealStatus: Boolean (default: false),
  status:       "upcoming" | "active" | "completed" | "cancelled",
  participants: [ObjectId → User],
  createdAt, updatedAt
}
```

### `Admin`

```js
{
  email:     String (unique),
  password:  String (bcrypt hashed, 12 rounds),
  name:      String,
  createdAt, updatedAt
}
```

---

## 🌐 API Endpoints

### Public

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| `GET`  | `/api/health`      | Health check          |
| `GET`  | `/api/debates`     | List all debates      |
| `GET`  | `/api/debates/:id` | Get debate by ID      |
| `POST` | `/api/users/sync`  | Sync Clerk user to DB |

### User (requires `x-clerk-user-id` header)

| Method | Endpoint            | Description     |
| ------ | ------------------- | --------------- |
| `POST` | `/api/debates/join` | Join a debate   |
| `GET`  | `/api/users/me`     | Get own profile |

### Admin (requires `Authorization: Bearer <jwt>`)

| Method   | Endpoint                  | Description               |
| -------- | ------------------------- | ------------------------- |
| `POST`   | `/api/admin/login`        | Admin login → returns JWT |
| `GET`    | `/api/admin/stats`        | Dashboard statistics      |
| `GET`    | `/api/admin/users`        | All users                 |
| `POST`   | `/api/topics`             | Create topic              |
| `GET`    | `/api/topics`             | List all topics           |
| `GET`    | `/api/topics/:id`         | Get topic by ID           |
| `DELETE` | `/api/topics/:id`         | Delete topic              |
| `POST`   | `/api/debates`            | Create debate             |
| `PATCH`  | `/api/debates/:id`        | Update debate             |
| `PATCH`  | `/api/debates/reveal/:id` | Reveal topic + notify     |
| `DELETE` | `/api/debates/:id`        | Delete debate             |

### Webhooks

| Method | Endpoint              | Description                 |
| ------ | --------------------- | --------------------------- |
| `POST` | `/api/webhooks/clerk` | Clerk user lifecycle events |

---

## 🎨 UI & Design

- **Theme:** Dark mode (always-on)
- **Color Palette:** Deep navy background with purple/violet primary accents
- **Component Library:** shadcn/ui (Button, Card, Dialog, Badge, Input, Label, Select, Toast, Textarea)
- **Icons:** Lucide React
- **Responsive:** Mobile-first — navbar collapses to bottom tab bar on mobile

---

## 📜 Available Scripts

### Backend

```bash
npm run dev         # Start with nodemon (hot reload)
npm start           # Start production server
npm run seed:admin  # Create default admin account
```

### Frontend

```bash
npm run dev         # Start Vite dev server
npm run build       # Production build → dist/
npm run preview     # Preview production build
```

---

## 🔒 Security Notes

1. **Change the default admin password** after first setup.
2. **JWT_SECRET** must be a long, random string in production — never commit it.
3. **SMTP credentials** use a Gmail App Password — not your main Gmail password.
4. **Clerk keys** starting with `sk_live_` are production keys — keep them secret.
5. The `.gitignore` excludes `.env` files from version control.
6. Admin passwords are hashed with **bcrypt** (12 salt rounds).

---

## 🐛 Troubleshooting

| Issue                       | Solution                                                          |
| --------------------------- | ----------------------------------------------------------------- |
| `Cannot connect to MongoDB` | Check `MONGODB_URI` in `.env`; whitelist your IP in MongoDB Atlas |
| `Clerk key missing`         | Set `VITE_CLERK_PUBLISHABLE_KEY` in `frontend/.env`               |
| `Emails not sending`        | Verify Gmail App Password; check `SMTP_USER` and `SMTP_PASS`      |
| `Admin login fails`         | Run `npm run seed:admin` in the backend directory                 |
| `CORS errors`               | Ensure `CLIENT_URL` in backend `.env` matches the frontend URL    |
| `JWT invalid`               | Clear `localStorage` in the browser and log in again              |

---

## 📄 License

MIT — Free to use, modify, and distribute.
