# Roadworthys Authentication System

A full-stack authentication system built with Express.js backend, Next.js frontend, Tailwind CSS, shadcn UI, and MySQL database.

## Features

- User registration with email, name, and password
- User login with email and password
- User logout
- Protected routes with JWT authentication
- Beautiful UI with shadcn components and Tailwind CSS
- HTTP-only cookies for secure token storage
- Password hashing with bcrypt
- Input validation

## Tech Stack

### Backend
- Express.js
- MySQL
- JWT (JSON Web Tokens)
- bcrypt for password hashing
- express-validator for input validation
- CORS enabled
- Cookie-parser for handling cookies

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn UI components
- Context API for state management

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Database Setup

1. Make sure MySQL is running on your machine
2. Create the database and table:

```bash
mysql -u root -p < backend/config/init.sql
```

Or manually:

```sql
CREATE DATABASE IF NOT EXISTS roadworthys;
USE roadworthys;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON users(email);
```

### Backend Setup

1. Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

2. Configure `.env` file with your MySQL credentials

3. Start the backend server:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## Testing the Application

1. **Register**: Go to `http://localhost:3000` → Click "Register" → Fill form → Submit
2. **View Dashboard**: After registration, you'll see your user info
3. **Logout**: Click "Logout" button to clear session
4. **Login**: Go to login page → Enter credentials → Submit

## API Endpoints

**Base URL:** `http://localhost:5000/api/auth`

- **POST** `/register` - Register new user
- **POST** `/login` - Login user
- **POST** `/logout` - Logout user
- **GET** `/me` - Get current user (protected)

## Security Features

- Bcrypt password hashing
- HTTP-only cookies
- CORS protection
- Input validation
- SQL injection protection
- Secure cookies in production
- SameSite cookie policy

## License

MIT
