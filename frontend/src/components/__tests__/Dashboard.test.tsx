import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { apiService } from '../../services/api';

// Mock the API service
jest.mock('../../services/api');
const mockApiService = apiService as jest.Mocked<typeof apiService>;

// Mock recharts components to avoid canvas issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  Pie: () => <div data-testid="pie" />,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Cell: () => <div data-testid="cell" />
}));

const mockDashboardStats = {
  total_policies: 10,
  active_policies: 8,
  total_events: 1500,
  open_violations: 5,
  events_last_24h: 150,
  critical_violations: 2
};

const mockTimelineData = [
  {
    date: '2024-01-01',
    total: 100,
    severity_breakdown: { low: 50, medium: 30, high: 15, critical: 5 }
  },
  {
    date: '2024-01-02',
    total: 120,
    severity_breakdown: { low: 60, medium: 35, high: 20, critical: 5 }
  }
];

const mockRecentActivity = [
  {
    type: 'violation',
    id: 1,
    title: 'Content Policy Violation',
    severity: 'high',
    timestamp: '2024-01-01T10:00:00Z',
    status: 'open'
  },
  {
    type: 'event',
    id: 2,
    title: 'New AI Model Event',
    severity: 'medium',
    timestamp: '2024-01-01T09:30:00Z',
    status: 'processed'
  }
];

describe('Dashboard Component', () => {
  beforeEach(() => {
    mockApiService.getDashboardStats.mockResolvedValue(mockDashboardStats);
    mockApiService.getEventsTimeline.mockResolvedValue(mockTimelineData);
    mockApiService.getRecentActivity.mockResolvedValue(mockRecentActivity);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard header', async () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('AI governance monitoring and policy management')).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
  });

  test('displays stats cards after loading', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Policies')).toBeInTheDocument();
    });

    expect(screen.getByText('10')).toBeInTheDocument(); // total_policies
    expect(screen.getByText('8 active')).toBeInTheDocument(); // active_policies
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('1500')).toBeInTheDocument(); // total_events
    expect(screen.getByText('150 last 24h')).toBeInTheDocument(); // events_last_24h
    expect(screen.getByText('Violations')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // open_violations
    expect(screen.getByText('2 critical')).toBeInTheDocument(); // critical_violations
    expect(screen.getByText('System Status')).toBeInTheDocument();
    expect(screen.getByText('99.7%')).toBeInTheDocument();
  });

  test('renders charts section', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Events Timeline (Last 7 Days)')).toBeInTheDocument();
    });

    expect(screen.getByText('Policy Status Distribution')).toBeInTheDocument();
    expect(screen.getAllByTestId('responsive-container')).toHaveLength(2);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  test('displays recent activity', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });

    expect(screen.getByText('Content Policy Violation')).toBeInTheDocument();
    expect(screen.getByText('New AI Model Event')).toBeInTheDocument();
    
    // Check severity badges
    const severityBadges = screen.getAllByText(/high|medium/);
    expect(severityBadges.length).toBeGreaterThan(0);
    
    // Check status badges
    const statusBadges = screen.getAllByText(/open|processed/);
    expect(statusBadges.length).toBeGreaterThan(0);
  });

  test('calls API services on mount', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(mockApiService.getDashboardStats).toHaveBeenCalledTimes(1);
    });
    
    expect(mockApiService.getEventsTimeline).toHaveBeenCalledTimes(1);
    expect(mockApiService.getRecentActivity).toHaveBeenCalledTimes(1);
  });

  test('handles API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockApiService.getDashboardStats.mockRejectedValue(new Error('API Error'));
    mockApiService.getEventsTimeline.mockRejectedValue(new Error('API Error'));
    mockApiService.getRecentActivity.mockRejectedValue(new Error('API Error'));
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching dashboard data:', expect.any(Error));
    });
    
    // Should still render the dashboard structure even with errors
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    consoleErrorSpy.mockRestore();
  });

  test('formats timestamps correctly', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });

    // Check that timestamps are formatted (exact format may vary by locale)
    const timestampElements = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/);
    expect(timestampElements.length).toBeGreaterThan(0);
  });

  test('applies correct severity colors', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });

    const highSeverityBadge = screen.getByText('high');
    const mediumSeverityBadge = screen.getByText('medium');
    
    expect(highSeverityBadge).toHaveStyle('background-color: #ea580c');
    expect(mediumSeverityBadge).toHaveStyle('background-color: #d97706');
  });

  test('applies correct status colors', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });

    const openStatusBadge = screen.getByText('open');
    const processedStatusBadge = screen.getByText('processed');
    
    expect(openStatusBadge).toHaveStyle('background-color: #dc2626');
    expect(processedStatusBadge).toHaveStyle('background-color: #6b7280');
  });

  test('renders activity icons correctly', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });

    // Check that activity items have icons (lucide-react icons render as SVGs)
    const activityItems = screen.getAllByRole('generic', { name: /activity-item/i });
    expect(activityItems.length).toBeGreaterThan(0);
  });

  test('handles empty data gracefully', async () => {
    mockApiService.getDashboardStats.mockResolvedValue({
      total_policies: 0,
      active_policies: 0,
      total_events: 0,
      open_violations: 0,
      events_last_24h: 0,
      critical_violations: 0
    });
    mockApiService.getEventsTimeline.mockResolvedValue([]);
    mockApiService.getRecentActivity.mockResolvedValue([]);
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Policies')).toBeInTheDocument();
    });

    // Should display zeros for all stats
    expect(screen.getAllByText('0')).toHaveLength(6); // 6 zero values in stats
    expect(screen.getByText('0 active')).toBeInTheDocument();
    expect(screen.getByText('0 last 24h')).toBeInTheDocument();
    expect(screen.getByText('0 critical')).toBeInTheDocument();
  });
});
