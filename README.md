"# UTF League - EAFC Pro Clubs League Management System

A modern, full-stack web application for managing EAFC (EA Sports FC) Pro Clubs competitive leagues. Built with Next.js, Express, MongoDB, and Tailwind CSS.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Express](https://img.shields.io/badge/Express-5.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-success)

## Features

### Core League Management
- **Team Management**: Register teams, manage team details, track stats
- **Fixture Generation**: Automatic round-robin fixture generation
- **Match Results**: Submit and review match results with image proof
- **League Table**: Real-time standings with points, goal difference
- **Player Stats**: Track individual player performance (goals, assists, MOTM)

### Design & UX
- **Modern Dark Theme**: Gaming-inspired aesthetic with cyan/purple accents
- **Responsive Design**: Fully mobile-responsive interface
- **Smooth Animations**: CSS animations and transitions
- **Glass Morphism**: Modern glass-effect UI components

### Authentication & Security
- **JWT Authentication**: Secure token-based auth
- **Role-Based Access**: Manager and Staff roles
- **IP Tracking**: Track manager registrations by IP
- **Cloudinary Integration**: Secure image uploads for match proof

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS 3.4
- Lucide React Icons
- SweetAlert2 for notifications

### Backend
- Express.js 5
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- Multer for file uploads
- Bcrypt.js for password hashing

### Admin Dashboard
- Separate Next.js app for admin
- Staff management interface
- Results approval workflow
- Fixture management

## Project Structure

```
utf/
├── backend/           # Express.js API
│   ├── config/        # Database configuration
│   ├── controllers/   # Route controllers
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   └── server.js      # Entry point
├── frontend/          # Main Next.js app (public)
│   ├── src/app/       # App router pages
│   │   ├── components/
│   │   ├── fixtures/
│   │   ├── table/
│   │   ├── teams/
│   │   ├── login/
│   │   └── signup/
│   └── package.json
├── dashboard/         # Admin dashboard (separate app)
│   └── src/app/
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone and install dependencies:**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install

# Dashboard
cd dashboard
npm install
```

2. **Environment Variables:**

Create `.env` files:

**backend/.env:**
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**frontend/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. **Start Development Servers:**

```bash
# Terminal 1 - Backend
cd backend
npm run dev  # or: node server.js

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Dashboard (optional)
cd dashboard
npm run dev
```

4. **Access the apps:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Dashboard: http://localhost:3001 (or next available port)

## API Endpoints

### Authentication
- `POST /utf/auth/login/manager` - Manager login
- `POST /utf/auth/login/staff` - Staff login

### Managers (Teams)
- `GET /utf/managers` - Get all managers
- `GET /utf/managers/ip/:ip` - Get manager by IP
- `POST /utf/managers` - Register new manager
- `PUT /utf/managers/status/:id` - Update manager status
- `DELETE /utf/managers/:id` - Delete manager

### Fixtures
- `GET /utf/fixtures/all` - Get all fixtures grouped by gameweek
- `GET /utf/fixtures/latest` - Get latest gameweek fixtures
- `GET /utf/fixtures/generate/:gameweek` - Generate fixtures for gameweek
- `POST /utf/fixtures/save/:gameweek` - Save fixtures
- `PUT /utf/fixtures/fixture/:id` - Update fixture
- `DELETE /utf/fixtures/gameweek/:gameweek` - Delete gameweek

### Results
- `POST /utf/results/submit` - Submit match result
- `GET /utf/results/all` - Get all results
- `PATCH /utf/results/status/:id` - Update result status

### League Table
- `GET /utf/table` - Get league standings

### Staff
- `GET /utf/staff` - Get all staff members

## Screenshots

### Home Page
Modern hero section with animated background, stats display, and league rules.

### Teams Page
Grid display of all competing teams with search functionality.

### League Table
Standings table with position indicators, form arrows, and champion highlighting.

### Fixtures
Gameweek navigation with match cards showing home/away teams.

## Deployment

### Vercel (Frontend + Dashboard)
1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

### Railway/Render (Backend)
1. Connect GitHub repo
2. Set environment variables
3. Deploy

### MongoDB Atlas
- Create cluster
- Whitelist IP addresses
- Get connection string

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - feel free to use for your own league management needs.

## Support

For issues or questions, please open a GitHub issue or contact the development team.

---

Built with passion for the Pro Clubs community." 
