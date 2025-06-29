import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, AlertTriangle, Clock, Activity, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';

interface Event {
  id: number;
  event_id: string;
  event_type: string;
  severity: string;
  status: string;
  title: string;
  description: string;
  trigger_date: string;
  policy_id: number;
  user_id: number;
  acknowledged_by: number | null;
  acknowledged_date: string | null;
  model_name?: string;
  request_tokens?: number;
  response_tokens?: number;
  duration_ms?: number;
  created_at: string;
  updated_at: string;
}

interface Violation {
  id: number;
  violation_type: string;
  severity: string;
  status: string;
  title: string;
  description: string;
  confidence_score: number;
  event_id: number;
  policy_id: number;
  created_at: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventViolations, setEventViolations] = useState<Violation[]>([]);
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [statusFilter, severityFilter]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    
    if (realTimeEnabled) {
      ws = apiService.connectWebSocket((data) => {
        if (data.type === 'new_event') {
          setEvents(prev => [data.event, ...prev]);
        } else if (data.type === 'event_updated') {
          setEvents(prev => prev.map(event => 
            event.id === data.event.id ? { ...event, ...data.event } : event
          ));
        }
      });
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [realTimeEnabled]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (severityFilter) params.severity = severityFilter;
      
      const data = await apiService.getEvents(params);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventViolations = async (eventId: number) => {
    try {
      const violations = await apiService.getEventViolations(eventId);
      setEventViolations(violations);
    } catch (error) {
      console.error('Error fetching event violations:', error);
    }
  };

  const handleAcknowledgeEvent = async (eventId: number) => {
    try {
      await apiService.updateEvent(eventId, { 
        status: 'acknowledged',
        acknowledged_by: 1 // TODO: Get from authenticated user
      });
      fetchEvents();
    } catch (error) {
      console.error('Error acknowledging event:', error);
    }
  };

  const handleViewEvent = async (event: Event) => {
    setSelectedEvent(event);
    await fetchEventViolations(event.id);
  };

  const filteredEvents = events.filter(event =>
    (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     event.event_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#65a30d';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return '#dc2626';
      case 'investigating': return '#d97706';
      case 'acknowledged': return '#2563eb';
      case 'resolved': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="events-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Events</h1>
          <p>Monitor and analyze AI system events</p>
        </div>
        <div className="header-actions">
          <button 
            className={`btn ${realTimeEnabled ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setRealTimeEnabled(!realTimeEnabled)}
          >
            <Activity size={16} />
            {realTimeEnabled ? 'Live' : 'Connect'}
          </button>
          <button 
            className="btn btn-secondary"
            onClick={fetchEvents}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>
          
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      <div className="events-container">
        <div className="events-list">
          {loading ? (
            <div className="loading-state">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="empty-state">
              <Activity size={48} />
              <h3>No events found</h3>
              <p>Events will appear here as they are detected</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p className="event-id">ID: {event.event_id}</p>
                  </div>
                  <div className="event-badges">
                    <span 
                      className="severity-badge"
                      style={{ backgroundColor: getSeverityColor(event.severity) }}
                    >
                      {event.severity}
                    </span>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(event.status) }}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
                
                <div className="event-content">
                  <p>{event.description}</p>
                  
                  <div className="event-metadata">
                    <div className="metadata-item">
                      <Clock size={14} />
                      <span>{formatTimestamp(event.trigger_date)}</span>
                    </div>
                    {event.model_name && (
                      <div className="metadata-item">
                        <span>Model: {event.model_name}</span>
                      </div>
                    )}
                    {event.duration_ms && (
                      <div className="metadata-item">
                        <span>Duration: {event.duration_ms}ms</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="event-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleViewEvent(event)}
                  >
                    <Eye size={14} />
                    View Details
                  </button>
                  {event.status === 'open' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAcknowledgeEvent(event.id)}
                    >
                      <CheckCircle size={14} />
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Event Details Panel */}
        {selectedEvent && (
          <div className="event-details-panel">
            <div className="panel-header">
              <h2>Event Details</h2>
              <button 
                className="btn-close"
                onClick={() => setSelectedEvent(null)}
              >
                ×
              </button>
            </div>
            
            <div className="panel-content">
              <div className="detail-section">
                <h3>Basic Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Event ID:</label>
                    <span>{selectedEvent.event_id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type:</label>
                    <span>{selectedEvent.event_type}</span>
                  </div>
                  <div className="detail-item">
                    <label>Severity:</label>
                    <span 
                      className="severity-badge"
                      style={{ backgroundColor: getSeverityColor(selectedEvent.severity) }}
                    >
                      {selectedEvent.severity}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(selectedEvent.status) }}
                    >
                      {selectedEvent.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Triggered:</label>
                    <span>{formatTimestamp(selectedEvent.trigger_date)}</span>
                  </div>
                  {selectedEvent.acknowledged_date && (
                    <div className="detail-item">
                      <label>Acknowledged:</label>
                      <span>{formatTimestamp(selectedEvent.acknowledged_date)}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedEvent.model_name && (
                <div className="detail-section">
                  <h3>Model Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Model:</label>
                      <span>{selectedEvent.model_name}</span>
                    </div>
                    {selectedEvent.request_tokens && (
                      <div className="detail-item">
                        <label>Request Tokens:</label>
                        <span>{selectedEvent.request_tokens}</span>
                      </div>
                    )}
                    {selectedEvent.response_tokens && (
                      <div className="detail-item">
                        <label>Response Tokens:</label>
                        <span>{selectedEvent.response_tokens}</span>
                      </div>
                    )}
                    {selectedEvent.duration_ms && (
                      <div className="detail-item">
                        <label>Duration:</label>
                        <span>{selectedEvent.duration_ms}ms</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h3>Description</h3>
                <p>{selectedEvent.description}</p>
              </div>

              {eventViolations.length > 0 && (
                <div className="detail-section">
                  <h3>Associated Violations</h3>
                  <div className="violations-list">
                    {eventViolations.map((violation) => (
                      <div key={violation.id} className="violation-item">
                        <div className="violation-header">
                          <h4>{violation.title}</h4>
                          <span 
                            className="severity-badge"
                            style={{ backgroundColor: getSeverityColor(violation.severity) }}
                          >
                            {violation.severity}
                          </span>
                        </div>
                        <p>{violation.description}</p>
                        <div className="violation-meta">
                          <span>Confidence: {(violation.confidence_score * 100).toFixed(1)}%</span>
                          <span>Type: {violation.violation_type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
