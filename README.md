# Roadworthys Application

A full-stack e-commerce application for managing vehicle roadworthiness materials and services. Built with Express.js backend, Next.js frontend, Tailwind CSS, shadcn UI, MySQL database, and ServiceM8 API integration.

## Features

### Authentication & User Management
- User registration with email, name, and password
- User login with JWT authentication
- Protected routes with middleware
- HTTP-only cookies for secure token storage
- Password hashing with bcrypt
- Automatic company creation on first checkout

### Materials Catalog
- Browse active materials from ServiceM8
- View material pricing and stock information
- Inventory status indicators (always available vs limited stock)
- Add materials to shopping cart with quantity selection

### Shopping Cart
- Add/remove items with quantity management
- Persistent cart using localStorage
- Real-time price calculations
- Cart badge with item count

### Order Management
- Create orders (jobs) in ServiceM8
- View all orders with status indicators
- Detailed order view with materials breakdown
- Company-based order filtering and authorization

### Notes System
- Add notes to specific orders
- View all notes for an order
- Timestamp tracking for notes
- Company ownership authorization

## Tech Stack

### Backend
- Express.js - Web framework
- MySQL - Database
- Sequelize - ORM with migrations
- JWT (JSON Web Tokens) - Authentication
- bcrypt - Password hashing
- express-validator - Input validation
- axios - ServiceM8 API integration
- CORS - Cross-origin resource sharing
- cookie-parser - Cookie handling
- uuid - UUID generation for ServiceM8

### Frontend
- Next.js 15 (App Router) - React framework
- React 19 - UI library
- TypeScript - Type safety
- Tailwind CSS v4 - Styling
- shadcn UI components - UI component library
- Context API - State management

### Third-Party Integration
- ServiceM8 API - Materials, jobs, companies, and notes management

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
