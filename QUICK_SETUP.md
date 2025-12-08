# 🚀 Quick Setup Guide

This guide will help you get the Tour Booking Management System up and running in just a few minutes.

## Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js (v14 or higher) installed - [Download here](https://nodejs.org/)
- [ ] MongoDB installed and running - [Download here](https://www.mongodb.com/try/download/community) OR [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas)
- [ ] Git installed - [Download here](https://git-scm.com/)
- [ ] A code editor (VS Code recommended) - [Download here](https://code.visualstudio.com/)

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Anhmy27/Tour-Booking-.git
cd Tour-Booking-
```

### 2. Setup Backend

```bash
# Navigate to backend folder
cd "Tour-Booking BE"

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env
```

**Edit the `.env` file** with your settings:

**Minimum required configuration:**
```env
NODE_ENV=development
PORT=9999
DATABASE=mongodb://localhost:27017/tour-booking
FRONT_END_URI=http://localhost:3000
JWT_SECRET=your-secret-key-at-least-32-characters-long
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

**For production features (optional):**
- Stripe keys for payments
- Cloudinary credentials for image uploads
- Email service credentials
- Google OAuth credentials

### 3. Setup Frontend

Open a **new terminal window** and:

```bash
cd "Tour-Booking FE"

# Install dependencies
npm install

# (Optional) Create .env file if you need custom API URL
# echo "REACT_APP_API_URL=http://localhost:9999/api/v1" > .env
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd "Tour-Booking BE"
npm start
```

You should see:
```
App running on port 9999...
DB connection successful!
```

**Terminal 2 - Frontend:**
```bash
cd "Tour-Booking FE"
npm start
```

Your browser should automatically open to `http://localhost:3000`

## 🎉 You're Done!

The application should now be running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:9999/api/v1

## Common Issues & Solutions

### Issue: MongoDB Connection Error

**Error Message:**
```
MongooseServerSelectionError: connect ECONNREFUSED
```

**Solution:**
1. Make sure MongoDB is running:
   ```bash
   # On macOS/Linux
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```
2. Or use MongoDB Atlas (cloud):
   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get your connection string
   - Update `DATABASE` in `.env` file

### Issue: Port Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::9999
```

**Solution:**
1. Change the PORT in `.env` file:
   ```env
   PORT=8000
   ```
2. Or kill the process using the port:
   ```bash
   # Find process
   lsof -i :9999
   
   # Kill it (replace PID with actual process ID)
   kill -9 PID
   ```

### Issue: Node Modules Not Found

**Error Message:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: React App Not Starting

**Solution:**
```bash
cd "Tour-Booking FE"

# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Try starting again
npm start
```

## Next Steps

### For Development:

1. **Explore the codebase:**
   - Read [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) to understand the organization
   - Check [CONTRIBUTING.md](./CONTRIBUTING.md) for coding standards

2. **Create test data:**
   - Register a user account
   - Create some tours (you'll need admin access)
   - Make test bookings

3. **Set up development tools:**
   ```bash
   # Install recommended VS Code extensions
   # - ESLint
   # - Prettier
   # - ES7+ React/Redux/React-Native snippets
   ```

### For Production Deployment:

1. **Get API keys:**
   - [Stripe](https://stripe.com/) for payments
   - [Cloudinary](https://cloudinary.com/) for image hosting
   - [Google Cloud Console](https://console.cloud.google.com/) for OAuth
   - Email service (Mailtrap, SendGrid, etc.)

2. **Update environment variables** with production values

3. **Build the frontend:**
   ```bash
   cd "Tour-Booking FE"
   npm run build
   ```

4. **Deploy:**
   - Backend: Deploy to services like Heroku, Railway, or DigitalOcean
   - Frontend: Deploy to Vercel, Netlify, or serve from backend
   - Database: Use MongoDB Atlas for production

## Testing the Application

### Test User Accounts (if you seed the database):

You might want to create these test accounts:

```javascript
// Admin Account
email: admin@test.com
password: test1234

// Regular User
email: user@test.com
password: test1234
```

### Quick Feature Test:

1. ✅ Register a new account
2. ✅ Browse available tours
3. ✅ View tour details
4. ✅ Add a review (if you have bookings)
5. ✅ Check booking history
6. ✅ Update profile

## Development Workflow

```bash
# 1. Start both servers in development mode
cd "Tour-Booking BE" && npm start
cd "Tour-Booking FE" && npm start

# 2. Make your changes

# 3. Format code before committing
npm run format

# 4. Commit and push
git add .
git commit -m "Your descriptive commit message"
git push
```

## Useful Commands

### Backend
```bash
# Start server with auto-reload
npm start

# Format code
npm run format

# Start in production mode
npm run start:prod
```

### Frontend
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Format code
npm run format
```

## Additional Resources

- 📖 [Full Documentation](./README.md)
- 🇻🇳 [Vietnamese Documentation](./README.vi.md)
- 🏗️ [Project Structure](./PROJECT_STRUCTURE.md)
- 🤝 [Contributing Guide](./CONTRIBUTING.md)

## Getting Help

If you're stuck:

1. Check this guide again carefully
2. Search for your error message in the [Issues](https://github.com/Anhmy27/Tour-Booking-/issues)
3. Read the detailed documentation
4. Create a new issue with:
   - What you're trying to do
   - What error you're getting
   - What you've already tried

## Tips for Success

- 💡 **Keep both terminals open** - one for backend, one for frontend
- 💡 **Check the console** - Most errors appear in the browser console (F12) or terminal
- 💡 **Start simple** - Get the basic setup working before adding features
- 💡 **Use version control** - Commit your changes regularly
- 💡 **Read error messages** - They usually tell you exactly what's wrong

---

Happy coding! 🎉 If this guide helped you, consider giving the project a ⭐ on GitHub!
