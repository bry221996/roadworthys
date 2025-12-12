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
- ServiceM8 API Key (required for materials and job management)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd roadworthys
```

### Step 2: Database Setup

1. **Start MySQL** on your machine

2. **Create the database:**
```bash
mysql -u root -p
```

```sql
CREATE DATABASE IF NOT EXISTS roadworthys;
```

### Step 3: Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file** in the `backend` directory with the following variables:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=roadworthys

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key_here

# Server Configuration
PORT=5001
NODE_ENV=development

# ServiceM8 API Configuration
SERVICEM8_API_KEY=your_servicem8_api_key_here
```

4. **Run database migrations:**
```bash
npx sequelize-cli db:migrate
```

This will create the `users` table with the `company_id` column.

5. **Start the backend server:**
```bash
npm run dev
```

Backend runs on `http://localhost:5001`

### Step 4: Frontend Setup

1. **Open a new terminal** and navigate to frontend directory:
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env.local` file** in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

4. **Start the development server:**
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

### Step 5: Verify Installation

1. Open your browser and go to `http://localhost:3000`
2. You should see the Roadworthys home page
3. Backend API should be accessible at `http://localhost:5001/api`

## Using the Application

### 1. User Registration and Login

1. **Register a new account:**
   - Go to `http://localhost:3000`
   - Click "Register" button in the navbar
   - Fill in your name, email, and password
   - Submit the form
   - You'll be automatically logged in and redirected to the home page

2. **Login:**
   - Click "Login" in the navbar
   - Enter your email and password
   - Submit the form

### 2. Browse Materials

1. After logging in, you'll see the materials catalog on the home page
2. Browse through available materials from ServiceM8
3. View material details including:
   - Material name and item number
   - Price per unit
   - Stock status (Always Available or quantity in stock)

### 3. Shopping Cart

1. **Add items to cart:**
   - Click "Add to Cart" on any material card
   - Adjust quantity as needed
   - Items are saved to your cart (persists across page refreshes)

2. **View cart:**
   - Click the cart icon in the navbar (shows item count badge)
   - Review your items and quantities
   - Adjust quantities or remove items

3. **Checkout:**
   - Click "Proceed to Checkout" in the cart page
   - Your order will be created in ServiceM8
   - A company will be automatically created if this is your first order
   - You'll be redirected to your orders page

### 4. View Orders

1. **List all orders:**
   - Click "My Orders" in the navbar
   - View all your orders with status badges
   - See order creation date and last update

2. **View order details:**
   - Click "View Details" on any order
   - See complete order information including:
     - Job ID and status
     - List of materials with quantities and prices
     - Total order amount
     - All notes for the order

### 5. Add Notes to Orders

1. Go to any order details page
2. Scroll to the "Notes" section at the bottom
3. Type your note in the textarea
4. Click "Add Note"
5. Your note will appear in the list with a timestamp

## API Endpoints

### Authentication
**Base URL:** `http://localhost:5001/api/auth`

- **POST** `/register` - Register new user
- **POST** `/login` - Login user
- **POST** `/logout` - Logout user
- **GET** `/me` - Get current user (protected)

### Materials
**Base URL:** `http://localhost:5001/api/materials`

- **GET** `/` - List all active materials from ServiceM8 (protected)

### Jobs/Orders
**Base URL:** `http://localhost:5001/api/jobs`

- **POST** `/` - Create new job with materials (protected)
- **GET** `/` - List all jobs for user's company (protected)
- **GET** `/:uuid` - Get job details and materials (protected)
- **POST** `/:uuid/notes` - Add note to job (protected)
- **GET** `/:uuid/notes` - List all notes for job (protected)

## Project Structure

```
roadworthys/
├── backend/
│   ├── config/
│   │   ├── database.js          # Sequelize configuration
│   │   └── config.js            # Database connection config
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── materialsController.js # Materials from ServiceM8
│   │   └── jobsController.js    # Jobs and notes logic
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── index.js             # Sequelize models loader
│   │   └── user.js              # User model
│   ├── migrations/
│   │   └── *-create-users.js    # Database migrations
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── materials.js         # Materials routes
│   │   └── jobs.js              # Jobs routes
│   ├── .env                     # Environment variables
│   ├── .sequelizerc             # Sequelize CLI config
│   ├── server.js                # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── login/               # Login page
│   │   ├── register/            # Register page
│   │   ├── cart/                # Shopping cart page
│   │   ├── jobs/
│   │   │   ├── [uuid]/          # Job details page
│   │   │   └── page.tsx         # Jobs list page
│   │   ├── layout.tsx           # Root layout with navbar
│   │   ├── page.tsx             # Home/materials page
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── ui/                  # shadcn UI components
│   │   ├── Navbar.tsx           # Navigation bar
│   │   └── MaterialCard.tsx     # Material display card
│   ├── context/
│   │   ├── AuthContext.tsx      # Authentication state
│   │   └── CartContext.tsx      # Shopping cart state
│   ├── lib/
│   │   ├── api.ts               # API client functions
│   │   └── utils.ts             # Utility functions
│   ├── .env.local               # Frontend environment variables
│   └── package.json
│
├── README.md                    # This file
└── TECH_NOTES.md               # Technical documentation
```

## Security Features

- **Password Security:** Bcrypt hashing with salt rounds
- **Session Management:** HTTP-only cookies prevent XSS attacks
- **CORS Protection:** Configured for specific origins
- **Input Validation:** Server-side validation with express-validator
- **SQL Injection Prevention:** Sequelize ORM with parameterized queries
- **Authorization:** Company-based access control for all protected resources
- **Secure Cookies:** SameSite policy and secure flag in production
- **JWT Tokens:** Short-lived tokens for API authentication

## Troubleshooting

### Backend won't start
- **Check MySQL:** Ensure MySQL is running on port 3306
- **Database exists:** Verify `roadworthys` database was created
- **Environment variables:** Check all required vars in `.env` file
- **Port conflict:** Ensure port 5001 is not in use
- **Dependencies:** Run `npm install` in backend directory

### Frontend won't start
- **Port conflict:** Ensure port 3000 is not in use
- **Environment variables:** Check `.env.local` has correct API URL
- **Dependencies:** Run `npm install` in frontend directory
- **Node version:** Ensure Node.js v18 or higher

### Authentication not working
- **Cookie issues:** Check browser allows cookies from localhost
- **CORS errors:** Verify backend CORS is configured for `http://localhost:3000`
- **JWT secret:** Ensure `JWT_SECRET` is set in backend `.env`
- **Cookie sameSite:** Should be set to `lax` in development

### ServiceM8 API errors
- **API Key:** Verify `SERVICEM8_API_KEY` is correct in backend `.env`
- **API Limits:** Check if you've hit ServiceM8 API rate limits
- **Network:** Ensure server can reach ServiceM8 API endpoints
- **Permissions:** Verify API key has required permissions

### Database migration issues
- **Sequelize CLI:** Ensure `npx sequelize-cli db:migrate` was run
- **Database connection:** Check database credentials in `.env`
- **Migration files:** Verify migration files exist in `backend/migrations/`

### Cart not persisting
- **localStorage:** Check browser supports localStorage
- **Browser privacy:** Ensure not in private/incognito mode
- **Clear storage:** Try clearing browser localStorage and retry

## Additional Documentation

- **[TECH_NOTES.md](TECH_NOTES.md)** - Detailed technical documentation including:
  - Architecture decisions and reasoning
  - Assumptions made during development
  - Potential improvements
  - How AI assisted in development

## License

MIT
