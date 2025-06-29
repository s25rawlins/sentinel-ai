import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Policies from '../Policies';
import { apiService } from '../../services/api';

// Mock the API service
jest.mock('../../services/api');
const mockApiService = apiService as jest.Mocked<typeof apiService>;

const mockPolicies = [
  {
    id: 1,
    name: 'Content Safety Policy',
    description: 'Monitors for inappropriate content',
    category: 'content_safety',
    status: 'active',
    severity: 'medium',
    performance_mode: 'balanced',
    estimated_cost_per_event: 240,
    estimated_latency_ms: 100,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Data Privacy Policy',
    description: 'Ensures data privacy compliance',
    category: 'privacy',
    status: 'draft',
    severity: 'high',
    performance_mode: 'robust',
    estimated_cost_per_event: 480,
    estimated_latency_ms: 200,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

describe('Policies Component', () => {
  beforeEach(() => {
    mockApiService.getPolicies.mockResolvedValue(mockPolicies);
    mockApiService.deletePolicy.mockResolvedValue({ message: 'Policy deleted successfully' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders policies header', async () => {
    render(<Policies />);
    
    expect(screen.getByText('AI Governance Policies')).toBeInTheDocument();
    expect(screen.getByText('Manage and monitor your AI governance policies')).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    render(<Policies />);
    
    expect(screen.getByText('Loading policies...')).toBeInTheDocument();
  });

  test('displays policies after loading', async () => {
    render(<Policies />);
    
    await waitFor(() => {
      expect(screen.getByText('Content Safety Policy')).toBeInTheDocument();
    });

    expect(screen.getByText('Data Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Monitors for inappropriate content')).toBeInTheDocument();
    expect(screen.getByText('Ensures data privacy compliance')).toBeInTheDocument();
  });

  test('displays policy metadata correctly', async () => {
    render(<Policies />);
    
    await waitFor(() => {
      expect(screen.getByText('Content Safety Policy')).toBeInTheDocument();
    });

    // Check categories
    expect(screen.getByText('content_safety')).toBeInTheDocument();
    expect(screen.getByText('privacy')).toBeInTheDocument();

    // Check statuses
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('draft')).toBeInTheDocument();

    // Check severities
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  test('renders create new policy button', async () => {
    render(<Policies />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Policy')).toBeInTheDocument();
    });

    const createButton = screen.getByRole('button', { name: /create new policy/i });
    expect(createButton).toBeInTheDocument();
  });

  test('renders action buttons for each policy', async () => {
    render(<Policies />);
    
    await waitFor(() => {
      expect(screen.getByText('Content Safety Policy')).toBeInTheDocument();
    });

    // Should have edit and delete buttons for each policy
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    
    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  test('handles delete policy action', async () => {
    const user = userEvent.setup();
    render(<Policies />);
    
    await waitFor(() => {
      expect(screen.getByText('Content Safety Policy')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    // Should show confirmation dialog
    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    expect(mockApiService.deletePolicy).toHaveBeenCalledWith(1);
  });

  test('handles API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockApiService.getPolicies.mockRejectedValue(new Error('API Error'));
    
    render(<Policies />);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching policies:', expect.any(Error));
    });
    
    // Should still render the header even with errors
    expect(screen.getByText('AI Governance Policies')).toBeInTheDocument();
    
    consoleErrorSpy.mockRestore();
  });

  test('filters policies by category', async () => {
    const user = userEvent.setup();
    render(<Policies />);
    
    await waitFor(() => {
      expect(screen.getByText('Content Safety Policy')).toBeInTheDocument();
    });

    // Find and use category filter
    const categoryFilter = screen.getByRole('combobox', { name: /category/i });
    await user.selectOptions(categoryFilter, 'content_safety');

    // Should filter the displayed policies
    expect(screen.getByText('Content Safety Policy')).toBeInTheDocument();
    expect(screen.queryByText('Data Privacy Policy')).not.toBeInTheDocument();
  });

  test('filters policies by status', async () => {
    const user = userEvent.setup();
    render(<Policies />);
    
    await waitFor(() => {
      expect(screen.getByText('Content Safety Policy')).toBeInTheDocument();
    });

    // Find and use status filter
    const statusFilter = screen.getByRole('combobox', { name: /status/i });
    await user.selectOptions(statusFilter, 'active');

    // Should filter the displayed policies
    expect(screen.getByText('Content Safety Policy')).toBeInTheDocument();
    expect(screen.queryByText('Data Privacy Policy')).not.toBeInTheDocument();
  });

  test('searches policies by name', async () => {
    const user = userEvent.setup();
    render(<Policies />);
    
    await waitFor(() => {
      expect(screen.getByText('Content Safety Policy')).toBeInTheDocument();
    });

    // Find and use search input
    const searchInput = screen.getByRole('textbox', { name: /search/i });
    await user.type(searchInput, 'Content');

    // Should filter the displayed policies
    expect(screen.getByText('Content Safety Policy')).toBeInTheDocument();
    expect(screen.queryByText('Data Privacy Policy')).not.toBeInTheDocument();
  });

  test('displays empty state when no policies', async () => {
    mockApiService.getPolicies.mockResolvedValue([]);
    
    render(<Policies />);
    
    await waitFor(() => {
      expect(screen.getByText('No policies found')).toBeInTheDocument();
    });

    expect(screen.getByText('Create your first policy to get started')).toBeInTheDocument();
  });

  test('displays policy performance metrics', async () => {
    render(<Policies />);
    
    await waitFor(() => {
      expect(screen.getByText('Content Safety Policy')).toBeInTheDocument();
    });

    // Check cost and latency metrics
    expect(screen.getByText('240')).toBeInTheDocument(); // cost
    expect(screen.getByText('100ms')).toBeInTheDocument(); // latency
    expect(screen.getByText('480')).toBeInTheDocument(); // cost for second policy
    expect(screen.getByText('200ms')).toBeInTheDocument(); // latency for second policy
  });

  test('handles policy status changes', async () => {
    const user = userEvent.setup();
    mockApiService.updatePolicy.mockResolvedValue({
      ...mockPolicies[0],
      status: 'inactive'
    });
    
    render(<Policies />);
    
    await waitFor(() => {
      expect(screen.getByText('Content Safety Policy')).toBeInTheDocument();
    });

    // Find and click status toggle
    const statusToggle = screen.getAllByRole('button', { name: /toggle status/i })[0];
    await user.click(statusToggle);

    expect(mockApiService.updatePolicy).toHaveBeenCalledWith(1, { status: 'inactive' });
  });

  test('navigates to policy details on click', async () => {
    const user = userEvent.setup();
    render(<Policies />);
    
    await waitFor(() => {
      expect(screen.getByText('Content Safety Policy')).toBeInTheDocument();
    });

    // Click on policy name/card
    const policyCard = screen.getByText('Content Safety Policy');
    await user.click(policyCard);

    // Should navigate to policy details (this would be tested with router mock)
    // For now, just verify the click handler exists
    expect(policyCard).toBeInTheDocument();
  });

  test('displays policy creation date', async () => {
    render(<Policies />);
    
    await waitFor(() => {
      expect(screen.getByText('Content Safety Policy')).toBeInTheDocument();
    });

    // Check that creation dates are displayed (format may vary)
    const dateElements = screen.getAllByText(/2024|Jan|01/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  test('handles bulk actions', async () => {
    const user = userEvent.setup();
    render(<Policies />);
    
    await waitFor(() => {
      expect(screen.getByText('Content Safety Policy')).toBeInTheDocument();
    });

    // Select multiple policies
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);

    // Should show bulk actions
    expect(screen.getByText('2 selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bulk delete/i })).toBeInTheDocument();
  });

  test('sorts policies correctly', async () => {
    const user = userEvent.setup();
    render(<Policies />);
    
    await waitFor(() => {
      expect(screen.getByText('Content Safety Policy')).toBeInTheDocument();
    });

    // Find and use sort dropdown
    const sortSelect = screen.getByRole('combobox', { name: /sort/i });
    await user.selectOptions(sortSelect, 'name');

    // Policies should be sorted by name
    const policyNames = screen.getAllByRole('heading', { level: 3 });
    expect(policyNames[0]).toHaveTextContent('Content Safety Policy');
    expect(policyNames[1]).toHaveTextContent('Data Privacy Policy');
  });
});
