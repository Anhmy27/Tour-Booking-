# Project Structure Documentation

This document provides a detailed overview of the Tour Booking Management System's file and folder structure.

## 📂 Root Directory

```
Tour-Booking-/
├── README.md                 # Main project documentation
├── CONTRIBUTING.md           # Contribution guidelines
├── PROJECT_STRUCTURE.md      # This file
├── Tour-Booking BE/          # Backend API server
└── Tour-Booking FE/          # Frontend React application
```

## 🔧 Backend Structure (Tour-Booking BE)

### Overview
The backend follows the MVC (Model-View-Controller) pattern with additional layers for routes, utilities, and configurations.

```
Tour-Booking BE/
├── config/                   # Configuration files
│   └── passport.js           # Passport.js authentication strategies
│
├── controllers/              # Route controllers (business logic)
│   ├── adminController.js    # Admin-specific operations
│   ├── authController.js     # Authentication & authorization
│   ├── blogController.js     # Blog management
│   ├── bookingController.js  # Booking CRUD operations
│   ├── dashboardAdminController.js  # Admin dashboard data
│   ├── errorController.js    # Global error handling
│   ├── reportController.js   # Report generation
│   ├── reviewController.js   # Review management
│   └── tourController.js     # Tour CRUD operations
│
├── models/                   # Mongoose data models
│   ├── blogModel.js          # Blog schema
│   ├── bookingModel.js       # Booking schema
│   ├── reviewModel.js        # Review schema
│   ├── tourModel.js          # Tour schema
│   └── userModel.js          # User schema
│
├── routes/                   # API route definitions
│   ├── index.js              # Routes aggregator
│   ├── adminRoutes.js        # Admin endpoints
│   ├── authRoutes.js         # Authentication endpoints
│   ├── blogRoutes.js         # Blog endpoints
│   ├── bookingRoutes.js      # Booking endpoints
│   ├── reportRoutes.js       # Report endpoints
│   ├── reviewRoutes.js       # Review endpoints
│   └── tourRoutes.js         # Tour endpoints
│
├── utils/                    # Utility functions and helpers
│   ├── appError.js           # Custom error class
│   ├── catchAsync.js         # Async error wrapper
│   └── [other utilities]     # Various helper functions
│
├── public/                   # Static files
│   └── [images, uploads]     # Public assets
│
├── .env                      # Environment variables (not in repo)
├── .env.example              # Environment variables template
├── .eslintrc.json            # ESLint configuration
├── .prettierrc               # Prettier configuration
├── .gitignore                # Git ignore rules
├── app.js                    # Express app setup
├── server.js                 # Server entry point
├── package.json              # Dependencies and scripts
└── package-lock.json         # Locked dependencies
```

### Key Backend Files

#### `server.js`
- Application entry point
- Database connection setup
- Server initialization
- Process error handlers (uncaughtException, unhandledRejection, SIGTERM)

#### `app.js`
- Express application configuration
- Middleware setup (CORS, helmet, rate limiting, etc.)
- Route registration
- Global error handler

#### Models
Each model defines:
- Schema structure
- Validation rules
- Indexes
- Instance/static methods
- Middleware (pre/post hooks)
- Virtual properties

Example structure:
```javascript
// tourModel.js
const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // ... other fields
});

tourSchema.pre('save', function(next) {
  // Pre-save hook
});

const Tour = mongoose.model('Tour', tourSchema);
```

#### Controllers
Controllers handle:
- Request validation
- Business logic execution
- Database operations
- Response formatting
- Error handling

Pattern:
```javascript
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  
  if (!tour) {
    return next(new AppError('Tour not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: { tour }
  });
});
```

#### Routes
Routes define:
- HTTP methods and paths
- Middleware chain
- Controller associations
- Route-level validation

Pattern:
```javascript
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'partner'),
    tourController.createTour
  );
```

## 🎨 Frontend Structure (Tour-Booking FE)

### Overview
The frontend is a React application using React Router for navigation, Context API for state management, and a service layer for API calls.

```
Tour-Booking FE/
├── public/                   # Public static files
│   ├── index.html            # HTML template
│   ├── favicon.ico           # Site favicon
│   └── robots.txt            # Search engine instructions
│
├── src/                      # Source code
│   ├── components/           # Reusable React components
│   │   ├── common/           # Common UI components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── Modal.jsx
│   │   ├── tour/             # Tour-related components
│   │   │   ├── TourCard.jsx
│   │   │   ├── TourList.jsx
│   │   │   └── TourFilter.jsx
│   │   ├── booking/          # Booking components
│   │   │   └── BookingForm.jsx
│   │   └── [other domains]   # Component organization by feature
│   │
│   ├── contexts/             # React Context providers
│   │   ├── AuthContext.jsx   # Authentication state
│   │   ├── TourContext.jsx   # Tour data state
│   │   └── ThemeContext.jsx  # Theme/UI preferences
│   │
│   ├── data/                 # Static data files
│   │   └── constants.js      # Application constants
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.js        # Authentication hook
│   │   ├── useFetch.js       # Data fetching hook
│   │   └── useDebounce.js    # Debounce hook
│   │
│   ├── layouts/              # Layout components
│   │   ├── MainLayout.jsx    # Main app layout
│   │   ├── AdminLayout.jsx   # Admin dashboard layout
│   │   └── AuthLayout.jsx    # Authentication pages layout
│   │
│   ├── pages/                # Page components (routes)
│   │   ├── HomePage.js       # Landing page
│   │   ├── TourDetailPage.jsx # Tour details
│   │   ├── BookingHistoryPage.js # User booking history
│   │   ├── UserProfile.jsx   # User profile
│   │   ├── BlogPage.js       # Blog listing
│   │   ├── BlogDetailPage.js # Blog post detail
│   │   ├── PaymentReturn.jsx # Payment callback
│   │   ├── GoogleAuthSuccess.jsx # OAuth callback
│   │   └── admin/            # Admin pages
│   │       ├── Dashboard.jsx
│   │       ├── TourManagement.jsx
│   │       ├── UserManagement.jsx
│   │       ├── BookingManagement.jsx
│   │       └── BlogManagement.jsx
│   │
│   ├── routes/               # Route configuration
│   │   └── index.js          # React Router setup
│   │
│   ├── services/             # API service layer
│   │   ├── api.js            # Axios instance configuration
│   │   ├── authService.js    # Authentication API calls
│   │   ├── tourService.js    # Tour API calls
│   │   ├── bookingService.js # Booking API calls
│   │   ├── reviewService.js  # Review API calls
│   │   └── blogService.js    # Blog API calls
│   │
│   ├── styles/               # Global styles and CSS
│   │   ├── globals.css       # Global CSS
│   │   └── [other styles]    # Component-specific styles
│   │
│   ├── App.js                # Root component
│   ├── index.js              # Application entry point
│   └── index.css             # Main CSS file
│
├── .env                      # Environment variables (not in repo)
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── .prettierrc               # Prettier configuration
├── package.json              # Dependencies and scripts
├── package-lock.json         # Locked dependencies
├── README.md                 # Frontend-specific README
└── tailwind.config.js        # Tailwind CSS configuration
```

### Key Frontend Files

#### `index.js`
- React application entry point
- React root rendering
- Global providers wrapper

#### `App.js`
- Root application component
- Router provider
- Top-level error boundaries

#### Pages
Pages are route-level components:
- Map to URL paths
- Compose smaller components
- Handle page-level state
- Fetch and manage data

#### Components
Reusable UI building blocks:
- **Presentation Components**: Pure UI, receive props
- **Container Components**: Handle logic and state
- **Layout Components**: Structure and composition

Component structure:
```javascript
// TourCard.jsx
import React from 'react';
import PropTypes from 'prop-types';

const TourCard = ({ tour, onBook }) => {
  return (
    <div className="tour-card">
      {/* Component JSX */}
    </div>
  );
};

TourCard.propTypes = {
  tour: PropTypes.object.isRequired,
  onBook: PropTypes.func,
};

export default TourCard;
```

#### Services
API communication layer:
- Centralized API calls
- Error handling
- Request/response transformation
- Token management

Service pattern:
```javascript
// tourService.js
import api from './api';

export const getTours = async (params) => {
  const response = await api.get('/tours', { params });
  return response.data;
};

export const getTourById = async (id) => {
  const response = await api.get(`/tours/${id}`);
  return response.data;
};
```

#### Contexts
Global state management:
```javascript
// AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Auth logic...
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### Hooks
Custom React hooks for reusable logic:
```javascript
// useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## 🔄 Data Flow

### Backend Request Flow
```
Client Request
    ↓
Express Router
    ↓
Authentication Middleware (if protected)
    ↓
Route-specific Middleware (validation, etc.)
    ↓
Controller
    ↓
Model (Database)
    ↓
Response to Client
```

### Frontend Data Flow
```
User Action (Click, Submit, etc.)
    ↓
Event Handler
    ↓
Service Call (API)
    ↓
State Update (useState/Context)
    ↓
Component Re-render
    ↓
UI Update
```

## 📝 Naming Conventions

### Backend
- **Files**: camelCase with descriptive names
  - `tourController.js`, `userModel.js`
- **Classes/Models**: PascalCase
  - `Tour`, `User`, `AppError`
- **Functions**: camelCase, verb-based
  - `getTours()`, `createBooking()`, `deleteReview()`
- **Constants**: UPPER_SNAKE_CASE
  - `MAX_FILE_SIZE`, `DEFAULT_PAGE_SIZE`
- **Routes**: kebab-case
  - `/api/tours`, `/api/user-bookings`

### Frontend
- **Components**: PascalCase
  - `TourCard.jsx`, `UserProfile.jsx`
- **Hooks**: camelCase with "use" prefix
  - `useAuth.js`, `useFetch.js`
- **Services**: camelCase with "Service" suffix
  - `tourService.js`, `authService.js`
- **Utilities**: camelCase
  - `formatDate.js`, `validateEmail.js`
- **CSS Classes**: kebab-case or Tailwind utilities
  - `tour-card`, `user-profile`

## 🗂 File Naming

### Backend
- Models: `*Model.js` (e.g., `tourModel.js`)
- Controllers: `*Controller.js` (e.g., `tourController.js`)
- Routes: `*Routes.js` (e.g., `tourRoutes.js`)
- Utilities: descriptive names (e.g., `appError.js`, `email.js`)

### Frontend
- Components: `*.jsx` or `*.js` in PascalCase
- Pages: `*Page.js` or `*Page.jsx` (e.g., `HomePage.js`)
- Services: `*Service.js` (e.g., `tourService.js`)
- Hooks: `use*.js` (e.g., `useAuth.js`)
- Context: `*Context.jsx` (e.g., `AuthContext.jsx`)

## 📦 Dependencies Management

### Backend Key Dependencies
- **Framework**: express
- **Database**: mongoose
- **Authentication**: jsonwebtoken, passport, bcryptjs
- **Security**: helmet, express-rate-limit, xss-clean, express-mongo-sanitize
- **File Upload**: multer, sharp, cloudinary
- **Payment**: stripe
- **Email**: nodemailer
- **Validation**: validator

### Frontend Key Dependencies
- **Framework**: react, react-dom
- **Routing**: react-router-dom
- **UI**: @mui/material, react-bootstrap, tailwindcss
- **HTTP**: axios
- **Maps**: react-leaflet, leaflet
- **Charts**: chart.js, react-chartjs-2, recharts
- **Forms**: react-datepicker
- **Auth**: @react-oauth/google
- **Others**: qrcode.react, swiper

## 🔍 Code Organization Principles

1. **Separation of Concerns**: Each file/module has a single, well-defined responsibility
2. **DRY (Don't Repeat Yourself)**: Shared logic is extracted to utilities/hooks
3. **Modularity**: Features are self-contained and can be modified independently
4. **Scalability**: Structure supports growth and new features
5. **Maintainability**: Clear naming and organization for easy navigation
6. **Testability**: Components and functions are isolated for easier testing

## 📚 Additional Resources

- [Backend README](./Tour-Booking%20BE/README.md) - Backend-specific documentation (if exists)
- [Frontend README](./Tour-Booking%20FE/README.md) - Frontend-specific documentation
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [README.md](./README.md) - Main project documentation

## 🔄 Keeping Structure Updated

When adding new files or features:
1. Follow existing naming conventions
2. Place files in appropriate directories
3. Update this documentation if adding new directories
4. Maintain consistency with existing patterns

---

Last Updated: December 2024
