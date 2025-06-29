# Sentinel AI Frontend

A modern React TypeScript application providing a comprehensive user interface for AI governance and monitoring.

## Overview

The Sentinel AI frontend is built with React 19 and TypeScript, featuring a responsive dashboard, real-time data visualization, and intuitive management interfaces for policies, events, and violations.

## Features

- **Dashboard**: Real-time statistics and activity monitoring
- **Policy Management**: Complete CRUD operations for governance policies
- **Event Monitoring**: Real-time event tracking with WebSocket support
- **Violation Management**: Advanced filtering and risk analysis
- **Theme Support**: Dark/light mode with persistent storage
- **Responsive Design**: Mobile-first responsive layout
- **Real-time Updates**: Auto-refresh and live data streaming

## Technology Stack

- **React 19** - JavaScript library for building user interfaces
- **TypeScript 4.9.5** - Static type checking for JavaScript
- **React Router DOM 7.6.3** - Client-side routing for single-page applications
- **Axios 1.10.0** - HTTP client for API communication
- **Recharts 3.0.2** - Data visualization and charting library
- **Lucide React 0.525.0** - Modern icon library
- **CSS Custom Properties** - Native CSS theming system

## Project Structure

```
src/
├── App.tsx              # Main application component
├── App.css              # Global application styles
├── index.tsx            # Application entry point
├── index.css            # Global CSS reset and base styles
├── components/          # React components
│   ├── Dashboard.tsx        # Dashboard overview component
│   ├── Navigation.tsx       # Main navigation component
│   ├── Policies.tsx         # Policies management component
│   ├── Events.tsx           # Events monitoring component
│   ├── Violations.tsx       # Violations management component
│   └── __tests__/           # Component tests
├── services/            # API service layer
│   ├── api.ts               # API client and methods
│   └── __tests__/           # Service tests
└── mocks/               # MSW mock handlers
    ├── handlers.ts          # API mock handlers
    └── server.ts            # MSW server setup
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Backend API running on http://localhost:8000

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

The page will reload when you make edits and you'll see lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run test:coverage`

Runs tests with coverage reporting.

### `npm run test:ci`

Runs tests in CI mode (no watch, with coverage).

### `npm run test:debug`

Runs tests in debug mode with Node.js inspector.

### `npm run build`

Builds the app for production to the `build` folder.

The build is minified and filenames include hashes for optimal caching.

## Key Components

### Dashboard
- Real-time statistics cards
- Event timeline visualization
- Recent activity feed
- Performance metrics

### Navigation
- Responsive navigation menu
- Theme toggle (dark/light mode)
- Active page highlighting
- User information display

### Policies
- Policy CRUD operations
- Category and status filtering
- Policy templates
- Performance mode configuration

### Events
- Real-time event monitoring
- WebSocket live updates
- Event filtering and search
- Severity classification

### Violations
- Advanced violation management
- Risk analysis with confidence scores
- Multi-dimensional filtering
- Acknowledgment workflow

## API Integration

The frontend communicates with the backend API at `http://localhost:8000`:

- **Dashboard APIs**: `/api/dashboard/*`
- **Policy APIs**: `/api/policies/*`
- **Event APIs**: `/api/events/*`
- **Violation APIs**: `/api/violations/*`

## Testing

The project uses Jest and React Testing Library for comprehensive testing:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test Dashboard.test.tsx
```

### Test Features
- Component testing with React Testing Library
- API mocking with Mock Service Worker (MSW)
- User interaction testing
- Accessibility testing
- 70% minimum code coverage

## Theming

The application supports dark and light themes using CSS custom properties:

```css
:root {
  --primary-color: #2563eb;
  --background-color: #ffffff;
  --text-color: #1f2937;
}

[data-theme="dark"] {
  --primary-color: #3b82f6;
  --background-color: #1f2937;
  --text-color: #f9fafb;
}
```

Theme preference is automatically saved to localStorage.

## Performance Features

- **Code Splitting**: Route-based lazy loading
- **Memoization**: React.memo for expensive renders
- **Debounced Search**: Reduced API calls
- **Efficient Re-renders**: Optimized state updates

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Color Contrast**: High contrast ratios
- **Focus Management**: Visible focus indicators

## Development

### Code Quality
- **ESLint**: Code linting for consistency
- **TypeScript**: Static type checking
- **React Testing Library**: Component testing best practices

### Build Process
- **Create React App**: Zero-configuration build setup
- **Webpack**: Module bundling and optimization
- **Babel**: JavaScript transpilation

## Deployment

The application can be deployed to any static hosting service:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your hosting service

### Deployment Options
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **AWS S3**: Static website hosting
- **GitHub Pages**: Free hosting for public repos

## Environment Variables

Create a `.env` file for environment-specific configuration:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_WEBSOCKET_URL=ws://localhost:8000
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## Learn More

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [React Router Documentation](https://reactrouter.com/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
