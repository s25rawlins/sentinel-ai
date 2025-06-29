import { http, HttpResponse } from 'msw';

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
    status: 'active',
    severity: 'high',
    performance_mode: 'robust',
    estimated_cost_per_event: 480,
    estimated_latency_ms: 200,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const mockEvents = [
  {
    id: 1,
    event_type: 'text_generation',
    source: 'gpt-4',
    content: 'Generated text content',
    policy_id: 1,
    metadata: { user_id: 'user123' },
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    event_type: 'image_generation',
    source: 'dall-e',
    content: 'Generated image description',
    policy_id: 2,
    metadata: { user_id: 'user456' },
    created_at: '2024-01-01T01:00:00Z'
  }
];

const mockViolations = [
  {
    id: 1,
    policy_id: 1,
    event_id: 1,
    violation_type: 'content_policy',
    severity: 'medium',
    confidence_score: 0.85,
    description: 'Inappropriate content detected',
    metadata: { rule_triggered: 'profanity_filter' },
    created_at: '2024-01-01T00:00:00Z'
  }
];

const mockDashboard = {
  total_policies: 2,
  active_policies: 2,
  total_events: 150,
  total_violations: 5,
  violation_rate: 3.33,
  recent_events: mockEvents.slice(0, 5),
  recent_violations: mockViolations.slice(0, 5),
  policy_performance: [
    { policy_name: 'Content Safety', events: 75, violations: 3, rate: 4.0 },
    { policy_name: 'Data Privacy', events: 75, violations: 2, rate: 2.67 }
  ]
};

export const handlers = [
  http.get('/api/policies/', () => {
    return HttpResponse.json(mockPolicies);
  }),

  http.get('/api/policies/:id', ({ params }) => {
    const id = parseInt(params.id as string);
    const policy = mockPolicies.find(p => p.id === id);
    if (!policy) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(policy);
  }),

  http.post('/api/policies/', async ({ request }) => {
    const newPolicy = await request.json() as any;
    const policy = {
      id: mockPolicies.length + 1,
      ...newPolicy,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockPolicies.push(policy);
    return HttpResponse.json(policy);
  }),

  http.put('/api/policies/:id', async ({ params, request }) => {
    const id = parseInt(params.id as string);
    const updates = await request.json() as any;
    const policyIndex = mockPolicies.findIndex(p => p.id === id);
    
    if (policyIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    mockPolicies[policyIndex] = {
      ...mockPolicies[policyIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    return HttpResponse.json(mockPolicies[policyIndex]);
  }),

  http.delete('/api/policies/:id', ({ params }) => {
    const id = parseInt(params.id as string);
    const policyIndex = mockPolicies.findIndex(p => p.id === id);
    
    if (policyIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    mockPolicies.splice(policyIndex, 1);
    return HttpResponse.json({ message: 'Policy deleted successfully' });
  }),

  http.get('/api/events/', () => {
    return HttpResponse.json(mockEvents);
  }),

  http.get('/api/events/:id', ({ params }) => {
    const id = parseInt(params.id as string);
    const event = mockEvents.find(e => e.id === id);
    if (!event) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(event);
  }),

  http.get('/api/violations/', () => {
    return HttpResponse.json(mockViolations);
  }),

  http.get('/api/violations/:id', ({ params }) => {
    const id = parseInt(params.id as string);
    const violation = mockViolations.find(v => v.id === id);
    if (!violation) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(violation);
  }),

  http.get('/api/dashboard/stats', () => {
    return HttpResponse.json(mockDashboard);
  }),

  http.get('/api/policies/templates/', () => {
    return HttpResponse.json([
      {
        id: 1,
        name: 'Content Safety Template',
        description: 'Template for content safety policies',
        category: 'content_safety',
        rules: [
          { condition: 'contains_profanity', action: 'block', threshold: 0.8 }
        ]
      }
    ]);
  }),

  http.post('/api/policies/:id/test', ({ params }) => {
    const id = parseInt(params.id as string);
    return HttpResponse.json({
      policy_id: id,
      test_passed: true,
      confidence_score: 0.85,
      evaluation_time_ms: 150,
      violations_detected: 0,
      details: 'Mock evaluation completed successfully'
    });
  })
];
