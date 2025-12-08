# Contributing to Tour Booking Management System

Thank you for your interest in contributing to the Tour Booking Management System! This document provides guidelines and standards for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Architecture](#project-architecture)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

## Getting Started

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Tour-Booking-.git
   cd Tour-Booking-
   ```

2. **Set Up Development Environment**
   - Install Node.js (v14+)
   - Install MongoDB
   - Configure environment variables (see README.md)

3. **Install Dependencies**
   ```bash
   # Backend
   cd "Tour-Booking BE"
   npm install
   
   # Frontend
   cd "../Tour-Booking FE"
   npm install
   ```

4. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Process

### 1. Planning
- Check existing issues or create a new one
- Discuss your approach before starting major work
- Break down large features into smaller tasks

### 2. Implementation
- Write clean, readable code
- Follow the coding standards (see below)
- Add comments for complex logic
- Keep functions small and focused

### 3. Testing
- Test your changes thoroughly
- Ensure existing tests still pass
- Add new tests for new features

### 4. Documentation
- Update README.md if needed
- Add JSDoc comments for functions
- Document API changes

## Coding Standards

### Backend (Node.js/Express)

#### File Organization
```javascript
// 1. External imports
const express = require('express');
const mongoose = require('mongoose');

// 2. Internal imports
const AppError = require('./utils/appError');
const catchAsync = require('./utils/catchAsync');

// 3. Code implementation
```

#### Naming Conventions
- **Files**: camelCase (e.g., `userController.js`)
- **Classes/Models**: PascalCase (e.g., `User`, `Tour`)
- **Functions/Variables**: camelCase (e.g., `getUserById`, `tourName`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_UPLOAD_SIZE`)

#### Error Handling
```javascript
// Use catchAsync for async route handlers
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: { tour }
  });
});
```

#### API Response Format
```javascript
// Success response
{
  "status": "success",
  "data": {
    "tours": [...]
  }
}

// Error response
{
  "status": "error",
  "message": "Error message here"
}
```

#### Database Queries
- Use Mongoose methods appropriately
- Implement proper indexing
- Use `lean()` for read-only queries
- Avoid N+1 query problems

```javascript
// Good: Populate in one query
const tours = await Tour.find().populate('reviews');

// Bad: Multiple queries
const tours = await Tour.find();
for (let tour of tours) {
  tour.reviews = await Review.find({ tour: tour._id });
}
```

#### Security Best Practices
- **Never** commit sensitive data (API keys, passwords)
- Validate all user inputs
- Sanitize data before database operations
- Use parameterized queries
- Implement rate limiting on sensitive endpoints

```javascript
// Input validation
const { body, validationResult } = require('express-validator');

router.post('/users',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process request...
  }
);
```

### Frontend (React)

#### Component Structure
```javascript
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Component definition
const TourCard = ({ tour, onBook }) => {
  // 1. Hooks
  const [isLoading, setIsLoading] = useState(false);
  
  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 3. Event handlers
  const handleBookClick = () => {
    onBook(tour.id);
  };
  
  // 4. Render
  return (
    <div className="tour-card">
      {/* JSX */}
    </div>
  );
};

// PropTypes
TourCard.propTypes = {
  tour: PropTypes.object.isRequired,
  onBook: PropTypes.func.isRequired,
};

export default TourCard;
```

#### Naming Conventions
- **Components**: PascalCase (e.g., `TourCard.jsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useAuth.js`)
- **Utilities**: camelCase (e.g., `formatDate.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

#### State Management
- Use React hooks (`useState`, `useEffect`, `useContext`)
- Keep state as local as possible
- Use Context API for global state
- Avoid prop drilling

```javascript
// Good: Using context for global state
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { user, logout } = useAuth();
  // Component logic...
};
```

#### API Calls
- Use a centralized service layer
- Handle errors appropriately
- Show loading states

```javascript
// services/tourService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getTours = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/tours`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

#### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use semantic class names
- Keep consistent spacing

```jsx
// Good: Semantic and consistent
<div className="tour-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
  <h2 className="text-2xl font-bold mb-4">{tour.name}</h2>
  <p className="text-gray-600 mb-4">{tour.description}</p>
</div>
```

#### Performance Best Practices
- Use React.memo for expensive components
- Implement proper key props in lists
- Lazy load routes and components
- Optimize images

```javascript
// Lazy loading
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));

// In routing
<Suspense fallback={<LoadingSpinner />}>
  <AdminDashboard />
</Suspense>
```

## Testing Guidelines

### Backend Testing
```javascript
// Use descriptive test names
describe('Tour Controller', () => {
  describe('GET /api/tours', () => {
    it('should return all tours with status 200', async () => {
      // Arrange
      const mockTours = [{ name: 'Test Tour' }];
      
      // Act
      const res = await request(app).get('/api/tours');
      
      // Assert
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });
  });
});
```

### Frontend Testing
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import TourCard from './TourCard';

test('renders tour name', () => {
  const tour = { id: '1', name: 'Amazing Tour' };
  render(<TourCard tour={tour} onBook={() => {}} />);
  
  expect(screen.getByText('Amazing Tour')).toBeInTheDocument();
});
```

## Pull Request Process

### Before Submitting
1. **Run Linters**
   ```bash
   # Backend
   cd "Tour-Booking BE"
   npm run format
   
   # Frontend
   cd "Tour-Booking FE"
   npm run format
   ```

2. **Run Tests**
   ```bash
   # Frontend
   npm test
   ```

3. **Update Documentation**
   - Update README.md if adding features
   - Add JSDoc comments
   - Update API documentation if needed

4. **Test Manually**
   - Test in development mode
   - Check for console errors
   - Verify mobile responsiveness

### PR Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Tested manually

### PR Title Format
```
[Type] Brief description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance tasks
```

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe your testing process

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where needed
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests
- [ ] All tests pass
```

## Project Architecture

### Backend Architecture
```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Routes    │ ──── Authentication Middleware
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controllers │ ──── Validation
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Models    │ ──── Business Logic
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Database   │
└─────────────┘
```

### Frontend Architecture
```
┌─────────────┐
│   Router    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Layouts   │ ──── Common UI structure
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Pages    │ ──── Route components
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Components  │ ──── Reusable UI
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Services   │ ──── API calls
└─────────────┘
```

## Common Patterns

### Backend: Async Error Handling
```javascript
// utils/catchAsync.js
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
```

### Backend: Factory Functions
```javascript
// controllers/handlerFactory.js
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
```

### Frontend: Custom Hooks
```javascript
// hooks/useFetch.js
import { useState, useEffect } from 'react';

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
};
```

## Questions?

If you have questions about contributing, please:
1. Check existing documentation
2. Search closed issues
3. Open a new issue with the "question" label

Thank you for contributing to Tour Booking Management System! 🎉
