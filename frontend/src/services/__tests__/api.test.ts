import { apiService } from '../api';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Policies API', () => {
    test('getPolicies returns policies data', async () => {
      const mockPolicies = [
        { id: 1, name: 'Test Policy', category: 'content_safety' },
        { id: 2, name: 'Another Policy', category: 'privacy' }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockPolicies });

      const result = await apiService.getPolicies();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/policies/');
      expect(result).toEqual(mockPolicies);
    });

    test('getPolicy returns single policy data', async () => {
      const mockPolicy = { id: 1, name: 'Test Policy', category: 'content_safety' };

      mockedAxios.get.mockResolvedValue({ data: mockPolicy });

      const result = await apiService.getPolicy(1);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/policies/1');
      expect(result).toEqual(mockPolicy);
    });

    test('createPolicy sends POST request with policy data', async () => {
      const newPolicy = { name: 'New Policy', category: 'content_safety' };
      const createdPolicy = { id: 1, ...newPolicy };

      mockedAxios.post.mockResolvedValue({ data: createdPolicy });

      const result = await apiService.createPolicy(newPolicy);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/policies/', newPolicy);
      expect(result).toEqual(createdPolicy);
    });

    test('updatePolicy sends PUT request with updated data', async () => {
      const updateData = { name: 'Updated Policy' };
      const updatedPolicy = { id: 1, name: 'Updated Policy', category: 'content_safety' };

      mockedAxios.put.mockResolvedValue({ data: updatedPolicy });

      const result = await apiService.updatePolicy(1, updateData);

      expect(mockedAxios.put).toHaveBeenCalledWith('/api/policies/1', updateData);
      expect(result).toEqual(updatedPolicy);
    });

    test('deletePolicy sends DELETE request', async () => {
      mockedAxios.delete.mockResolvedValue({ data: { message: 'Policy deleted' } });

      const result = await apiService.deletePolicy(1);

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/policies/1');
      expect(result).toEqual({ message: 'Policy deleted' });
    });

    test('testPolicy sends POST request to test endpoint', async () => {
      const testData = { content: 'Test content' };
      const testResult = { policy_id: 1, test_passed: true, confidence_score: 0.85 };

      mockedAxios.post.mockResolvedValue({ data: testResult });

      const result = await apiService.testPolicy(1, testData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/policies/1/test', testData);
      expect(result).toEqual(testResult);
    });
  });

  describe('Events API', () => {
    test('getEvents returns events data', async () => {
      const mockEvents = [
        { id: 1, event_type: 'text_generation', source: 'gpt-4' },
        { id: 2, event_type: 'image_generation', source: 'dall-e' }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockEvents });

      const result = await apiService.getEvents();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/events/');
      expect(result).toEqual(mockEvents);
    });

    test('getEvent returns single event data', async () => {
      const mockEvent = { id: 1, event_type: 'text_generation', source: 'gpt-4' };

      mockedAxios.get.mockResolvedValue({ data: mockEvent });

      const result = await apiService.getEvent(1);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/events/1');
      expect(result).toEqual(mockEvent);
    });
  });

  describe('Violations API', () => {
    test('getViolations returns violations data', async () => {
      const mockViolations = [
        { id: 1, policy_id: 1, severity: 'high', description: 'Test violation' },
        { id: 2, policy_id: 2, severity: 'medium', description: 'Another violation' }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockViolations });

      const result = await apiService.getViolations();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/violations/');
      expect(result).toEqual(mockViolations);
    });

    test('getViolation returns single violation data', async () => {
      const mockViolation = { id: 1, policy_id: 1, severity: 'high', description: 'Test violation' };

      mockedAxios.get.mockResolvedValue({ data: mockViolation });

      const result = await apiService.getViolation(1);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/violations/1');
      expect(result).toEqual(mockViolation);
    });
  });

  describe('Dashboard API', () => {
    test('getDashboardStats returns dashboard statistics', async () => {
      const mockStats = {
        total_policies: 10,
        active_policies: 8,
        total_events: 1500,
        open_violations: 5
      };

      mockedAxios.get.mockResolvedValue({ data: mockStats });

      const result = await apiService.getDashboardStats();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/dashboard/stats');
      expect(result).toEqual(mockStats);
    });

    test('getEventsTimeline returns timeline data', async () => {
      const mockTimeline = [
        { date: '2024-01-01', total: 100 },
        { date: '2024-01-02', total: 120 }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockTimeline });

      const result = await apiService.getEventsTimeline();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/dashboard/timeline');
      expect(result).toEqual(mockTimeline);
    });

    test('getRecentActivity returns recent activity data', async () => {
      const mockActivity = [
        { type: 'violation', id: 1, title: 'Test violation', severity: 'high' },
        { type: 'event', id: 2, title: 'Test event', severity: 'medium' }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockActivity });

      const result = await apiService.getRecentActivity();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/dashboard/activity');
      expect(result).toEqual(mockActivity);
    });
  });

  describe('Error Handling', () => {
    test('handles network errors', async () => {
      const networkError = new Error('Network Error');
      mockedAxios.get.mockRejectedValue(networkError);

      await expect(apiService.getPolicies()).rejects.toThrow('Network Error');
    });

    test('handles HTTP errors', async () => {
      const httpError = {
        response: {
          status: 404,
          data: { detail: 'Not found' }
        }
      };
      mockedAxios.get.mockRejectedValue(httpError);

      await expect(apiService.getPolicy(999)).rejects.toEqual(httpError);
    });

    test('handles server errors', async () => {
      const serverError = {
        response: {
          status: 500,
          data: { detail: 'Internal server error' }
        }
      };
      mockedAxios.post.mockRejectedValue(serverError);

      await expect(apiService.createPolicy({ name: 'Test' })).rejects.toEqual(serverError);
    });
  });

  describe('Request Configuration', () => {
    test('uses correct base URL', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    test('includes proper headers', async () => {
      const mockPolicy = { id: 1, name: 'Test Policy' };
      mockedAxios.get.mockResolvedValue({ data: mockPolicy });

      await apiService.getPolicy(1);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/policies/1');
    });
  });

  describe('Query Parameters', () => {
    test('getPolicies accepts query parameters', async () => {
      const mockPolicies = [{ id: 1, name: 'Test Policy' }];
      mockedAxios.get.mockResolvedValue({ data: mockPolicies });

      const params = { category: 'content_safety', status: 'active' };
      await apiService.getPolicies(params);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/policies/', { params });
    });

    test('getEvents accepts query parameters', async () => {
      const mockEvents = [{ id: 1, event_type: 'text_generation' }];
      mockedAxios.get.mockResolvedValue({ data: mockEvents });

      const params = { limit: 10, offset: 0 };
      await apiService.getEvents(params);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/events/', { params });
    });

    test('getViolations accepts query parameters', async () => {
      const mockViolations = [{ id: 1, severity: 'high' }];
      mockedAxios.get.mockResolvedValue({ data: mockViolations });

      const params = { severity: 'high', status: 'open' };
      await apiService.getViolations(params);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/violations/', { params });
    });
  });
});
