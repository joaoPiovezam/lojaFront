# Playwright Tests for LojaFront

This document describes the Playwright test suite for the LojaFront trading system application.

## Overview

The test suite covers:
- Authentication (login/logout)
- Navigation between pages
- Form submissions and validation
- Data display and interaction
- File upload functionality
- PDF generation
- Multi-language support
- Responsive design
- API integration (mocked)

## Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npm run test:install
```

## Running Tests

### All Tests
```bash
npm test
```

### Tests with Browser UI (Headed Mode)
```bash
npm run test:headed
```

### Debug Mode
```bash
npm run test:debug
```

### Interactive UI Mode
```bash
npm run test:ui
```

### View Test Report
```bash
npm run test:report
```

### Run with Local Server
```bash
npm run test:dev
```

## Test Structure

```
tests/
├── auth/
│   └── login.spec.js           # Login functionality tests
├── pages/
│   ├── index.spec.js           # Home page tests
│   ├── customer.spec.js        # Customer management tests
│   └── orders.spec.js          # Order management tests
├── integration/
│   └── navigation.spec.js      # Navigation and integration tests
├── utils/
│   ├── helpers.js              # Common test utilities
│   └── api-mocks.js           # API mocking utilities
└── fixtures/
    └── test-data.js           # Test data and fixtures
```

## Test Categories

### Authentication Tests (`tests/auth/login.spec.js`)
- Login form display
- Successful login with valid credentials
- Error handling for invalid credentials
- Form validation
- Navigation to registration

### Home Page Tests (`tests/pages/index.spec.js`)
- Page layout and components
- Data loading and display
- Dropdown functionality
- localStorage initialization
- Responsive design

### Customer Management Tests (`tests/pages/customer.spec.js`)
- Customer registration form
- Form validation
- Data submission
- Error handling
- Field formatting (phone, CNPJ, etc.)

### Order Management Tests (`tests/pages/orders.spec.js`)
- Order creation and editing
- Order listing and search
- Status updates
- File uploads
- PDF generation
- Multi-language support

### Navigation Tests (`tests/integration/navigation.spec.js`)
- Cross-page navigation
- Header component loading
- localStorage persistence
- Language switching
- Responsive design across pages
- Error handling

## API Mocking

The test suite uses comprehensive API mocking to ensure tests are:
- Fast and reliable
- Independent of external services
- Predictable in their behavior

### Mock Responses Include:
- Login success/failure
- Customer data (CRUD operations)
- Order/budget data
- Parts and suppliers data
- Error responses for testing error handling

## Test Data

Test data is centralized in `tests/fixtures/test-data.js` and includes:
- User credentials
- Form data for all entities
- API response templates
- Validation messages
- Navigation menu items

## Utilities

### TestHelpers Class (`tests/utils/helpers.js`)
Provides common functionality:
- Page navigation and waiting
- Form filling and submission
- localStorage management
- Element interaction
- Screenshot capture
- API response waiting

### APIMocks Class (`tests/utils/api-mocks.js`)
Handles API mocking:
- Login endpoints
- CRUD operations for all entities
- Error response simulation
- Mock data management

## Configuration

### Playwright Configuration (`playwright.config.js`)
- Multiple browser support (Chrome, Firefox, Safari)
- Mobile device testing
- Automatic server startup
- Test reporting configuration
- Screenshot and video capture on failure

### Browser Support
Tests run on:
- Desktop Chrome
- Desktop Firefox
- Desktop Safari
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Best Practices

### Writing Tests
1. Use descriptive test names
2. Keep tests independent and isolated
3. Use page object patterns for complex interactions
4. Mock external dependencies
5. Test both happy path and error scenarios

### Debugging
1. Use `test:debug` for step-by-step debugging
2. Use `test:headed` to see browser interactions
3. Check screenshots and videos in `test-results/`
4. Use `page.pause()` to pause execution during debugging

### Maintenance
1. Update test data when application changes
2. Keep API mocks in sync with real API
3. Review and update selectors when UI changes
4. Add tests for new features

## Continuous Integration

The test suite is configured for CI environments:
- Automatic retry on failure
- Parallel test execution
- Multiple output formats (HTML, JSON, JUnit)
- Screenshot and video capture on failure

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout in playwright.config.js
   - Check if server is running properly
   - Verify network conditions

2. **Element not found errors**
   - Check if selectors are correct
   - Verify page loading is complete
   - Update selectors if UI changed

3. **API mock issues**
   - Verify mock URLs match actual API calls
   - Check mock response format
   - Ensure mocks are cleared between tests

### Getting Help

1. Check Playwright documentation: https://playwright.dev/
2. Review test logs and screenshots in `test-results/`
3. Use debug mode to step through failing tests
4. Check browser console for JavaScript errors

## Contributing

When adding new tests:
1. Follow existing naming conventions
2. Add appropriate test data to fixtures
3. Use existing utilities and helpers
4. Include both positive and negative test cases
5. Update this documentation if needed
