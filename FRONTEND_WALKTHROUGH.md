# Sentinel AI Frontend Code Walkthrough

## Overview

The Sentinel AI frontend is a modern React TypeScript application that provides a comprehensive user interface for AI governance and monitoring. It features a responsive dashboard, real-time data visualization, and intuitive management interfaces for policies, events, and violations.

## Architecture

### Technology Stack
- **Framework**: React 19 with TypeScript 4.9.5
- **Routing**: React Router DOM 7.6.3 for client-side navigation
- **HTTP Client**: Axios 1.10.0 for API communication
- **Charts**: Recharts 3.0.2 for data visualization
- **Icons**: Lucide React 0.525.0 for consistent iconography
- **Styling**: CSS with CSS custom properties for theming
- **Testing**: Jest with React Testing Library and MSW
- **Build Tool**: Create React App (CRA) with React Scripts 5.0.1

### Project Structure
```
frontend/
├── public/
│   ├── index.html           # Main HTML template
│   ├── favicon.ico          # Application favicon
│   ├── logo192.png          # App logo (192x192)
│   ├── logo512.png          # App logo (512x512)
│   ├── manifest.json        # PWA manifest
│   └── robots.txt           # Search engine robots file
├── src/
│   ├── App.tsx              # Main application component
│   ├── App.css              # Global application styles
│   ├── App.test.tsx         # App component tests
│   ├── index.tsx            # Application entry point
│   ├── index.css            # Global CSS reset and base styles
│   ├── logo.svg             # React logo
│   ├── react-app-env.d.ts   # React app type definitions
│   ├── reportWebVitals.ts   # Web vitals reporting
│   ├── setupTests.ts        # Test setup and configuration
│   ├── components/          # React components
│   │   ├── Dashboard.tsx        # Dashboard overview component
│   │   ├── Navigation.tsx       # Main navigation component
│   │   ├── Policies.tsx         # Policies management component
│   │   ├── Events.tsx           # Events monitoring component
│   │   ├── Violations.tsx       # Violations management component
│   │   └── __tests__/           # Component tests
│   │       ├── Dashboard.test.tsx   # Dashboard component tests
│   │       └── Policies.test.tsx    # Policies component tests
│   ├── services/            # API service layer
│   │   ├── api.ts               # API client and methods
│   │   └── __tests__/           # Service tests
│   │       └── api.test.ts      # API service tests
│   └── mocks/               # MSW mock handlers
│       ├── handlers.ts          # API mock handlers
│       └── server.ts            # MSW server setup
├── package.json             # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Frontend-specific documentation
```

## Core Components

### 1. Application Root (App.tsx)

The main application component manages routing, theming, and global state:

```typescript
function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <Router>
      <div className="App">
        <Navigation darkMode={darkMode} toggleTheme={toggleTheme} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/events" element={<Events />} />
            <Route path="/violations" element={<Violations />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
```

**Key Features:**
- **Theme Management**: Dark/light mode with localStorage persistence
- **Client-side Routing**: React Router for SPA navigation
- **Global State**: Theme state management across components
- **Responsive Layout**: Flexible layout with navigation and main content areas

### 2. Navigation Component (Navigation.tsx)

Provides the main navigation interface with theme switching:

```typescript
const Navigation: React.FC<NavigationProps> = ({ darkMode, toggleTheme }) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/policies', label: 'Policies', icon: FileText },
    { path: '/events', label: 'Events', icon: AlertTriangle },
    { path: '/violations', label: 'Violations', icon: Shield },
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <div className="nav-logo">
          <Shield className="logo-icon" />
          <span className="logo-text">SentinelAI</span>
        </div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      {/* Navigation menu and user info */}
    </nav>
  );
};
```

**Key Features:**
- **Active State Management**: Highlights current page
- **Icon Integration**: Lucide React icons for visual consistency
- **Theme Toggle**: Integrated dark/light mode switcher
- **User Information**: User avatar and role display
- **Responsive Design**: Adapts to different screen sizes

### 3. Dashboard Component (Dashboard.tsx)

The main dashboard provides comprehensive system overview with real-time data:

```typescript
const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [timeline, setTimeline] = useState<TimelineData[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, timelineData, activityData] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getEventsTimeline(),
          apiService.getRecentActivity()
        ]);
        
        setStats(statsData);
        setTimeline(timelineData);
        setRecentActivity(activityData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);
```

**Key Features:**
- **Real-time Updates**: Auto-refresh every 30 seconds
- **Multiple Data Sources**: Parallel API calls for efficiency
- **Statistics Cards**: Key metrics display (policies, events, violations)
- **Data Visualization**: Charts using Recharts library
- **Activity Feed**: Recent system activity with timestamps
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Graceful error management

**Dashboard Sections:**
1. **Stats Grid**: Total policies, events, violations, and system status
2. **Charts Section**: Events timeline and policy status distribution
3. **Recent Activity**: Real-time activity feed with severity indicators

### 4. Violations Component (Violations.tsx)

Comprehensive violations management interface with advanced filtering and risk analysis:

```typescript
const Violations: React.FC = () => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);

  const handleAcknowledgeViolation = async (violationId: number) => {
    try {
      await apiService.updateViolation(violationId, { 
        status: 'acknowledged',
        acknowledged_by: 1 // TODO: Get from authenticated user
      });
      fetchViolations();
    } catch (error) {
      console.error('Error acknowledging violation:', error);
    }
  };
```

**Key Features:**
- **Advanced Filtering**: Search, status, severity, and type filters
- **Risk Analysis**: ML-based confidence scores and risk breakdowns
- **Violation Management**: Acknowledge and resolve violations
- **Detailed View**: Expandable violation details panel
- **Real-time Statistics**: Live violation counts and metrics
- **Visual Indicators**: Color-coded severity and status badges
- **Risk Scores**: Legal advice, controversial topics, code prompts analysis

**Violation Interface Elements:**
1. **Header Statistics**: Total, open, and critical violation counts
2. **Filter Section**: Multi-dimensional filtering capabilities
3. **Violation Cards**: Comprehensive violation information display
4. **Risk Analysis**: Visual risk score bars with color coding
5. **Action Buttons**: Acknowledge, resolve, and view details
6. **Details Panel**: Expandable detailed violation information

### 5. API Service Layer (services/api.ts)

Centralized API communication with comprehensive error handling:

```typescript
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Key Features:**
- **Axios Configuration**: Centralized HTTP client setup
- **Authentication**: Token-based auth with automatic header injection
- **Error Handling**: Global error handling with automatic logout
- **API Organization**: Grouped methods by feature (dashboard, laws, events, violations)
- **WebSocket Support**: Real-time connection management
- **Type Safety**: TypeScript interfaces for all API responses

**API Service Methods:**
- **Dashboard APIs**: Stats, timeline, activity, performance metrics
- **Policies APIs**: CRUD operations, templates, testing
- **Events APIs**: Management, filtering, statistics
- **Violations APIs**: Management, updates, filtering
- **WebSocket**: Real-time event streaming

## Key Features

### 1. Real-time Data Visualization

The application provides comprehensive data visualization using Recharts:

```typescript
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={timeline}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>
```

**Chart Types:**
- **Line Charts**: Events timeline and trends
- **Pie Charts**: Policy status distribution
- **Bar Charts**: Violation categories and severity
- **Progress Bars**: Risk score visualization

### 2. Advanced Filtering and Search

Multi-dimensional filtering capabilities across all data views:

```typescript
const filteredViolations = violations.filter(violation => {
  const matchesSearch = violation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       violation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       violation.violation_type.toLowerCase().includes(searchTerm.toLowerCase());
  
  const matchesType = !typeFilter || violation.violation_type === typeFilter;
  
  return matchesSearch && matchesType;
});
```

**Filter Types:**
- **Text Search**: Full-text search across multiple fields
- **Status Filtering**: Filter by violation/event status
- **Severity Filtering**: Filter by severity levels
- **Type Filtering**: Filter by violation/event types
- **Date Filtering**: Time-based filtering capabilities

### 3. Theme System

Comprehensive dark/light theme support with CSS custom properties:

```css
:root {
  --primary-color: #2563eb;
  --background-color: #ffffff;
  --text-color: #1f2937;
  --border-color: #e5e7eb;
}

[data-theme="dark"] {
  --primary-color: #3b82f6;
  --background-color: #1f2937;
  --text-color: #f9fafb;
  --border-color: #374151;
}
```

**Theme Features:**
- **Persistent Storage**: Theme preference saved to localStorage
- **System Integration**: Respects system theme preferences
- **Smooth Transitions**: CSS transitions for theme switching
- **Component Consistency**: All components support both themes

### 4. Responsive Design

Mobile-first responsive design with flexible layouts:

```css
.dashboard {
  display: grid;
  gap: 1.5rem;
  padding: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
```

**Responsive Features:**
- **Grid Layouts**: CSS Grid for flexible component arrangement
- **Breakpoint System**: Mobile, tablet, and desktop breakpoints
- **Touch-friendly**: Optimized for touch interactions
- **Adaptive Navigation**: Collapsible navigation for mobile

### 5. Error Handling and Loading States

Comprehensive error handling and user feedback:

```typescript
if (loading) {
  return (
    <div className="dashboard loading">
      <div className="loading-spinner">
        <Activity className="animate-spin" size={32} />
        <span>Loading dashboard...</span>
      </div>
    </div>
  );
}
```

**Error Handling Features:**
- **Loading Indicators**: Visual feedback during data fetching
- **Empty States**: Informative messages when no data is available
- **Error Boundaries**: React error boundaries for crash prevention
- **Retry Mechanisms**: Automatic retry for failed requests
- **User Notifications**: Toast notifications for user actions

## Data Flow

### 1. Component Lifecycle
1. **Mount**: Component initializes and fetches initial data
2. **Update**: Real-time updates via polling or WebSocket
3. **User Interaction**: Filter changes trigger data refetch
4. **Unmount**: Cleanup intervals and WebSocket connections

### 2. State Management
- **Local State**: Component-level state with React hooks
- **Shared State**: Theme state passed through props
- **Persistent State**: localStorage for user preferences
- **Server State**: API data with loading and error states

### 3. API Integration
- **RESTful APIs**: Standard HTTP methods for CRUD operations
- **Real-time Updates**: WebSocket connections for live data
- **Error Handling**: Centralized error handling with user feedback
- **Caching**: Browser caching for static resources

## Performance Optimizations

### 1. Code Splitting
- **Route-based Splitting**: Lazy loading for route components
- **Component Splitting**: Dynamic imports for large components
- **Bundle Analysis**: Webpack bundle analyzer for optimization

### 2. Data Optimization
- **Pagination**: Server-side pagination for large datasets
- **Debounced Search**: Debounced search input to reduce API calls
- **Memoization**: React.memo for expensive component renders
- **Virtual Scrolling**: For large lists (future enhancement)

### 3. Caching Strategy
- **HTTP Caching**: Browser caching for API responses
- **Local Storage**: Persistent storage for user preferences
- **Memory Caching**: In-memory caching for frequently accessed data

## Security Considerations

### 1. Authentication
- **Token Storage**: Secure token storage in localStorage
- **Automatic Logout**: Session timeout and automatic logout
- **Route Protection**: Protected routes for authenticated users

### 2. Data Validation
- **Input Sanitization**: Client-side input validation
- **Type Safety**: TypeScript for compile-time type checking
- **API Validation**: Server-side validation for all requests

### 3. XSS Prevention
- **React Protection**: Built-in XSS protection with React
- **Content Security Policy**: CSP headers for additional security
- **Sanitized Rendering**: Safe rendering of user-generated content

## Accessibility Features

### 1. Keyboard Navigation
- **Tab Order**: Logical tab order for keyboard navigation
- **Focus Management**: Visible focus indicators
- **Keyboard Shortcuts**: Keyboard shortcuts for common actions

### 2. Screen Reader Support
- **ARIA Labels**: Comprehensive ARIA labeling
- **Semantic HTML**: Proper HTML semantics for screen readers
- **Alt Text**: Alternative text for images and icons

### 3. Visual Accessibility
- **Color Contrast**: High contrast ratios for text and backgrounds
- **Font Scaling**: Responsive font sizes
- **Motion Reduction**: Respect for reduced motion preferences

## Future Enhancements

### 1. Advanced Features
- **Real-time Notifications**: Push notifications for critical events
- **Advanced Analytics**: Machine learning insights and predictions
- **Customizable Dashboards**: User-configurable dashboard layouts
- **Export Functionality**: Data export in various formats

### 2. Performance Improvements
- **Service Workers**: Offline functionality and caching
- **Progressive Web App**: PWA features for mobile experience
- **Virtual Scrolling**: For handling large datasets
- **GraphQL**: More efficient data fetching

### 3. User Experience
- **Drag and Drop**: Intuitive drag-and-drop interfaces
- **Bulk Operations**: Bulk actions for managing multiple items
- **Advanced Filtering**: More sophisticated filtering options
- **Collaborative Features**: Multi-user collaboration capabilities

## Development Workflow

### 1. Local Development
```bash
npm start          # Start development server
npm test           # Run test suite
npm run build      # Build for production
npm run eject      # Eject from CRA (if needed)
```

### 2. Code Quality
- **ESLint**: Code linting for consistency
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Testing**: Jest and React Testing Library

### 3. Deployment
- **Build Optimization**: Production build optimization
- **Environment Variables**: Environment-specific configuration
- **CDN Integration**: Static asset delivery via CDN
- **Monitoring**: Application performance monitoring
