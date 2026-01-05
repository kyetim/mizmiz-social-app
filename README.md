# MIZMIZ Social App

A modern social media platform built with Next.js, Express, and PostgreSQL.

## 🌟 Features

- **User Authentication** - Secure login/register with JWT
- **Posts & Feed** - Create, like, comment on posts
- **Real-time Messaging** - WebSocket-based chat
- **User Profiles** - Customizable profiles with avatars
- **Search** - Find users and posts
- **Notifications** - Real-time notifications
- **Categories** - Organize posts by topics
- **Media Upload** - Image and file sharing

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit + RTK Query
- **Real-time:** Socket.IO Client

### Backend
- **Framework:** Express + TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **Real-time:** Socket.IO
- **File Upload:** Multer

## 📁 Project Structure

```
mizmiz-social-app/
├── frontend/          # Next.js application
├── backend/           # Express API server
├── .env              # Environment variables
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd mizmiz-social-app
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npx prisma generate
npx prisma db push
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local
# Configure your .env.local file
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📚 Documentation

- [Backend Guide](./BACKEND_GUIDE.md)
- [Frontend Guide](./FRONTEND_GUIDE.md)
- [Features](./FEATURES.md)
- [Security](./SECURITY_NOTES.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Rate limiting
- Input validation
- XSS protection

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend
Deploy to your preferred hosting service (Railway, Render, etc.)

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
PORT=5000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 🤝 Contributing

This is a personal project. Feel free to fork and modify for your own use.

## 📄 License

MIT License

---

**Note:** This is a web-only application. Mobile development has been removed from this project.
