# 🌍 Tour Booking Management System (TBMS)

A comprehensive web-based tour booking platform built with the MERN stack (MongoDB, Express.js, React, Node.js). This system enables users to browse tours, make bookings, write reviews, read travel blogs, and provides administrators with powerful management tools.

> **Tiếng Việt**: Xem [README.vi.md](./README.vi.md) để đọc tài liệu bằng tiếng Việt

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Development Guidelines](#-development-guidelines)
- [Security Features](#-security-features)
- [Contributing](#-contributing)

## ✨ Features

### User Features
- **Authentication & Authorization**
  - Local authentication with JWT
  - Google OAuth 2.0 integration
  - Password reset functionality
  - Secure session management

- **Tour Management**
  - Browse available tours with filtering and sorting
  - View detailed tour information with interactive maps (Leaflet)
  - Check tour availability and dates
  - See ratings and reviews from other users

- **Booking System**
  - Book tours with date selection
  - Specify number of participants
  - Secure payment processing via Stripe
  - View booking history
  - Generate QR codes for bookings

- **Review System**
  - Write reviews for completed tours
  - Rate tours (1-5 stars)
  - View reviews from other travelers

- **Blog Platform**
  - Read travel blogs and articles
  - Browse blog posts by categories
  - Markdown editor support for content creation

- **User Profile**
  - Update personal information
  - View booking history
  - Manage account settings

### Admin Features
- **Dashboard**
  - Revenue analytics and charts
  - Booking statistics
  - User metrics
  - Tour performance tracking

- **Tour Management**
  - Create, update, and delete tours
  - Upload tour images (Cloudinary integration)
  - Manage tour schedules and availability
  - Set pricing and discounts

- **Booking Management**
  - View all bookings
  - Generate reports
  - Track payment status

- **User Management**
  - Manage user accounts
  - Assign roles and permissions
  - View user activity

- **Blog Management**
  - Create and edit blog posts
  - Manage blog categories
  - Publish/unpublish content

- **Review Moderation**
  - Monitor and moderate reviews
  - Remove inappropriate content

## 🛠 Technology Stack

### Frontend
- **Framework**: React 19.1.0
- **Routing**: React Router DOM 7.6.0
- **UI Libraries**:
  - Material-UI (MUI) 7.1.1
  - React Bootstrap 2.10.10
  - Tailwind CSS 3.4.17
  - Headless UI 2.2.4
- **Maps**: React Leaflet 5.0.0
- **Charts**: Chart.js 4.5.0, Recharts 2.15.3
- **Forms & Date Pickers**: 
  - React DatePicker 8.4.0
  - MUI Date Pickers 8.5.2
- **Other Features**:
  - QR Code generation
  - Markdown editor
  - Swiper for carousels
  - Axios for API calls
  - Google OAuth integration

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.21.2
- **Database**: MongoDB with Mongoose 8.10.1
- **Authentication**: 
  - JWT (jsonwebtoken 9.0.2)
  - Passport.js with Google OAuth 2.0
  - bcryptjs for password hashing
- **Payment**: Stripe 17.7.0
- **File Upload**: 
  - Multer 1.4.5
  - Cloudinary 2.6.0
  - Sharp 0.33.5 (image processing)
- **Security**:
  - Helmet 8.0.0 (HTTP headers)
  - express-rate-limit 7.5.0
  - express-mongo-sanitize 2.2.0
  - xss-clean 0.1.4
  - hpp 0.2.3 (HTTP Parameter Pollution)
- **Email**: Nodemailer 6.10.0
- **Template Engine**: Pug 3.0.3
- **Other**:
  - Morgan (logging)
  - Compression
  - Cookie Parser
  - Validator
  - Slugify

## 📁 Project Structure

```
Tour-Booking-/
├── Tour-Booking BE/          # Backend API Server
│   ├── config/               # Configuration files (passport, etc.)
│   ├── controllers/          # Route controllers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── blogController.js
│   │   ├── bookingController.js
│   │   ├── dashboardAdminController.js
│   │   ├── errorController.js
│   │   ├── reportController.js
│   │   ├── reviewController.js
│   │   └── tourController.js
│   ├── models/               # Mongoose models
│   │   ├── blogModel.js
│   │   ├── bookingModel.js
│   │   ├── reviewModel.js
│   │   ├── tourModel.js
│   │   └── userModel.js
│   ├── routes/               # API routes
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── blogRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── tourRoutes.js
│   ├── utils/                # Utility functions
│   ├── public/               # Static files
│   ├── app.js                # Express app configuration
│   ├── server.js             # Server entry point
│   └── package.json
│
└── Tour-Booking FE/          # Frontend React Application
    ├── public/               # Public assets
    ├── src/
    │   ├── components/       # Reusable React components
    │   ├── contexts/         # React Context providers
    │   ├── data/             # Static data files
    │   ├── hooks/            # Custom React hooks
    │   ├── layouts/          # Layout components
    │   ├── pages/            # Page components
    │   │   ├── admin/        # Admin pages
    │   │   ├── BlogPage.js
    │   │   ├── BlogDetailPage.js
    │   │   ├── BookingHistoryPage.js
    │   │   ├── HomePage.js
    │   │   ├── TourDetailPage.jsx
    │   │   ├── UserProfile.jsx
    │   │   └── PaymentReturn.jsx
    │   ├── routes/           # Route configurations
    │   ├── services/         # API service layer
    │   ├── styles/           # Global styles
    │   ├── App.js            # Root component
    │   └── index.js          # Entry point
    ├── tailwind.config.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- Stripe account (for payments)
- Cloudinary account (for image uploads)
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anhmy27/Tour-Booking-.git
   cd Tour-Booking-
   ```

2. **Install Backend Dependencies**
   ```bash
   cd "Tour-Booking BE"
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd "../Tour-Booking FE"
   npm install
   ```

4. **Configure Environment Variables**
   
   Create a `.env` file in the `Tour-Booking BE` directory (see [Environment Variables](#-environment-variables) section)

5. **Start the Backend Server**
   ```bash
   cd "Tour-Booking BE"
   npm start
   ```
   The backend will run on `http://localhost:9999` (or your configured PORT)

6. **Start the Frontend Development Server**
   ```bash
   cd "Tour-Booking FE"
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## 🔐 Environment Variables

Create a `.env` file in the `Tour-Booking BE` directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=9999

# Database
DATABASE=mongodb://localhost:27017/tour-booking
# OR for MongoDB Atlas:
# DATABASE=mongodb+srv://username:password@cluster.mongodb.net/tour-booking

# Frontend URL
FRONT_END_URI=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Email Configuration (for Nodemailer)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=your-email-username
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=noreply@tourbooking.com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:9999/api/v1/auth/google/callback
```

## 📚 API Documentation

### Base URL
```
http://localhost:9999/api/v1
```

### Main Endpoints

#### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/forgotPassword` - Request password reset
- `PATCH /auth/resetPassword/:token` - Reset password
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback

#### Tours
- `GET /tours` - Get all tours (with filtering, sorting, pagination)
- `GET /tours/:id` - Get tour by ID
- `POST /tours` - Create tour (admin/partner only)
- `PATCH /tours/:id` - Update tour (admin/partner only)
- `DELETE /tours/:id` - Delete tour (admin only)

#### Bookings
- `GET /bookings` - Get all bookings (admin only)
- `GET /bookings/my-bookings` - Get current user's bookings
- `POST /bookings` - Create booking
- `GET /bookings/:id` - Get booking by ID
- `PATCH /bookings/:id` - Update booking (admin only)
- `DELETE /bookings/:id` - Cancel booking

#### Reviews
- `GET /reviews` - Get all reviews
- `GET /tours/:tourId/reviews` - Get reviews for specific tour
- `POST /tours/:tourId/reviews` - Create review for tour
- `PATCH /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

#### Blogs
- `GET /blogs` - Get all blogs
- `GET /blogs/:id` - Get blog by ID
- `POST /blogs` - Create blog (admin only)
- `PATCH /blogs/:id` - Update blog (admin only)
- `DELETE /blogs/:id` - Delete blog (admin only)

#### Admin
- `GET /admin/users` - Get all users
- `GET /admin/dashboard` - Get dashboard statistics
- `GET /admin/reports` - Generate reports
- `PATCH /admin/users/:id` - Update user role

## 👨‍💻 Development Guidelines

### Code Style

- **Backend**: Follow Node.js best practices
  - Use async/await for asynchronous operations
  - Implement proper error handling
  - Use ESLint for code linting: `npm run format`
  
- **Frontend**: Follow React best practices
  - Use functional components with hooks
  - Implement proper component composition
  - Use Prettier for code formatting: `npm run format`

### Testing

- **Frontend**: Run tests with `npm test`
- **Backend**: Tests can be added following the project structure

### Git Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Run linters and tests
4. Commit with descriptive messages
5. Push and create a pull request

### Commit Message Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

## 🔒 Security Features

This application implements multiple security best practices:

1. **Authentication & Authorization**
   - JWT-based authentication
   - Password hashing with bcrypt
   - Role-based access control (user, partner, admin)

2. **Data Security**
   - MongoDB sanitization (prevent NoSQL injection)
   - XSS protection
   - HTTP Parameter Pollution (HPP) prevention
   - Input validation with validator.js

3. **HTTP Security**
   - Helmet.js for secure HTTP headers
   - CORS configuration
   - Rate limiting to prevent brute force attacks

4. **Payment Security**
   - Stripe integration for secure payments
   - Webhook signature verification

5. **Session Security**
   - Secure cookie handling
   - HTTPS enforcement in production

6. **Error Handling**
   - Global error handler
   - No sensitive data in error responses
   - Proper logging for debugging

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Setup

1. Ensure all dependencies are installed
2. Configure your local environment variables
3. Run the development servers
4. Make your changes and test thoroughly
5. Run linters before committing: `npm run format`

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- **Anhmy27** - [GitHub Profile](https://github.com/Anhmy27)

## 🙏 Acknowledgments

- React documentation and community
- Express.js team
- MongoDB team
- All open-source contributors whose packages are used in this project

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Note**: This is an educational/portfolio project. For production deployment, ensure all security measures are properly configured and environment variables are securely managed.
