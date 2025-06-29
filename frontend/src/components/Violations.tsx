import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, AlertTriangle, Shield, TrendingUp, BarChart3 } from 'lucide-react';
import { apiService } from '../services/api';

interface Violation {
  id: number;
  violation_type: string;
  severity: string;
  status: string;
  title: string;
  description: string;
  details: string;
  confidence_score: number;
  event_id: number;
  policy_id: number;
  acknowledged_by: number | null;
  acknowledged_date: string | null;
  legal_advice_score?: number;
  controversial_topics_score?: number;
  code_prompt_score?: number;
  safe_prompt_score?: number;
  created_at: string;
  updated_at: string;
}

const Violations: React.FC = () => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);

  useEffect(() => {
    fetchViolations();
  }, [statusFilter, severityFilter]);

  const fetchViolations = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (severityFilter) params.severity = severityFilter;
      
      const data = await apiService.getViolations(params);
      setViolations(data);
    } catch (error) {
      console.error('Error fetching violations:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleResolveViolation = async (violationId: number) => {
    try {
      await apiService.updateViolation(violationId, { 
        status: 'resolved',
        acknowledged_by: 1 // TODO: Get from authenticated user
      });
      fetchViolations();
    } catch (error) {
      console.error('Error resolving violation:', error);
    }
  };

  const filteredViolations = violations.filter(violation => {
    const matchesSearch = violation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         violation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         violation.violation_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !typeFilter || violation.violation_type === typeFilter;
    
    return matchesSearch && matchesType;
  });

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
      case 'detected': return '#dc2626';
      case 'investigating': return '#d97706';
      case 'acknowledged': return '#2563eb';
      case 'resolved': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getViolationTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'data_leakage': return <Shield size={16} />;
      case 'prompt_injection': return <AlertTriangle size={16} />;
      case 'policy_violation': return <Shield size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getConfidenceLevel = (score: number) => {
    if (score >= 0.8) return { level: 'High', color: '#16a34a' };
    if (score >= 0.6) return { level: 'Medium', color: '#d97706' };
    return { level: 'Low', color: '#dc2626' };
  };

  // Calculate violation statistics
  const violationStats = {
    total: violations.length,
    open: violations.filter(v => v.status === 'detected').length,
    investigating: violations.filter(v => v.status === 'investigating').length,
    resolved: violations.filter(v => v.status === 'resolved').length,
    critical: violations.filter(v => v.severity === 'critical').length,
  };

  return (
    <div className="violations-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Policy Violations</h1>
          <p>Monitor and manage AI policy violations and interventions</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{violationStats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{violationStats.open}</span>
            <span className="stat-label">Open</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{violationStats.critical}</span>
            <span className="stat-label">Critical</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search violations..."
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
            <option value="detected">Detected</option>
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

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="data_leakage">Data Leakage</option>
            <option value="prompt_injection">Prompt Injection</option>
            <option value="policy_violation">Policy Violation</option>
            <option value="compliance_breach">Compliance Breach</option>
          </select>
        </div>
      </div>

      {/* Violations List */}
      <div className="violations-container">
        <div className="violations-list">
          {loading ? (
            <div className="loading-state">Loading violations...</div>
          ) : filteredViolations.length === 0 ? (
            <div className="empty-state">
              <Shield size={48} />
              <h3>No violations found</h3>
              <p>Policy violations will appear here when detected</p>
            </div>
          ) : (
            filteredViolations.map((violation) => {
              const confidence = getConfidenceLevel(violation.confidence_score);
              
              return (
                <div key={violation.id} className="violation-card">
                  <div className="violation-header">
                    <div className="violation-info">
                      <div className="violation-title">
                        {getViolationTypeIcon(violation.violation_type)}
                        <h3>{violation.title}</h3>
                      </div>
                      <p className="violation-type">{violation.violation_type.replace('_', ' ')}</p>
                    </div>
                    <div className="violation-badges">
                      <span 
                        className="severity-badge"
                        style={{ backgroundColor: getSeverityColor(violation.severity) }}
                      >
                        {violation.severity}
                      </span>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(violation.status) }}
                      >
                        {violation.status}
                      </span>
                      <span 
                        className="confidence-badge"
                        style={{ backgroundColor: confidence.color }}
                      >
                        {confidence.level} Confidence
                      </span>
                    </div>
                  </div>
                  
                  <div className="violation-content">
                    <p>{violation.description}</p>
                    
                    <div className="violation-metadata">
                      <div className="metadata-item">
                        <span>Confidence: {(violation.confidence_score * 100).toFixed(1)}%</span>
                      </div>
                      <div className="metadata-item">
                        <span>Event ID: {violation.event_id}</span>
                      </div>
                      <div className="metadata-item">
                        <span>Policy ID: {violation.policy_id}</span>
                      </div>
                      <div className="metadata-item">
                        <span>Detected: {formatTimestamp(violation.created_at)}</span>
                      </div>
                    </div>

                    {/* Risk Scores */}
                    {(violation.legal_advice_score || violation.controversial_topics_score || 
                      violation.code_prompt_score || violation.safe_prompt_score) && (
                      <div className="risk-scores">
                        <h4>Risk Analysis</h4>
                        <div className="scores-grid">
                          {violation.legal_advice_score !== undefined && (
                            <div className="score-item">
                              <span>Legal Advice</span>
                              <div className="score-bar">
                                <div 
                                  className="score-fill"
                                  style={{ 
                                    width: `${violation.legal_advice_score * 100}%`,
                                    backgroundColor: violation.legal_advice_score > 0.7 ? '#dc2626' : 
                                                   violation.legal_advice_score > 0.4 ? '#d97706' : '#16a34a'
                                  }}
                                />
                              </div>
                              <span>{(violation.legal_advice_score * 100).toFixed(0)}%</span>
                            </div>
                          )}
                          {violation.controversial_topics_score !== undefined && (
                            <div className="score-item">
                              <span>Controversial</span>
                              <div className="score-bar">
                                <div 
                                  className="score-fill"
                                  style={{ 
                                    width: `${violation.controversial_topics_score * 100}%`,
                                    backgroundColor: violation.controversial_topics_score > 0.7 ? '#dc2626' : 
                                                   violation.controversial_topics_score > 0.4 ? '#d97706' : '#16a34a'
                                  }}
                                />
                              </div>
                              <span>{(violation.controversial_topics_score * 100).toFixed(0)}%</span>
                            </div>
                          )}
                          {violation.code_prompt_score !== undefined && (
                            <div className="score-item">
                              <span>Code Prompt</span>
                              <div className="score-bar">
                                <div 
                                  className="score-fill"
                                  style={{ 
                                    width: `${violation.code_prompt_score * 100}%`,
                                    backgroundColor: violation.code_prompt_score > 0.7 ? '#dc2626' : 
                                                   violation.code_prompt_score > 0.4 ? '#d97706' : '#16a34a'
                                  }}
                                />
                              </div>
                              <span>{(violation.code_prompt_score * 100).toFixed(0)}%</span>
                            </div>
                          )}
                          {violation.safe_prompt_score !== undefined && (
                            <div className="score-item">
                              <span>Safe Prompt</span>
                              <div className="score-bar">
                                <div 
                                  className="score-fill"
                                  style={{ 
                                    width: `${violation.safe_prompt_score * 100}%`,
                                    backgroundColor: violation.safe_prompt_score > 0.7 ? '#16a34a' : 
                                                   violation.safe_prompt_score > 0.4 ? '#d97706' : '#dc2626'
                                  }}
                                />
                              </div>
                              <span>{(violation.safe_prompt_score * 100).toFixed(0)}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="violation-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedViolation(violation)}
                    >
                      <Eye size={14} />
                      View Details
                    </button>
                    {violation.status === 'detected' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAcknowledgeViolation(violation.id)}
                      >
                        <CheckCircle size={14} />
                        Acknowledge
                      </button>
                    )}
                    {(violation.status === 'detected' || violation.status === 'acknowledged') && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleResolveViolation(violation.id)}
                      >
                        <CheckCircle size={14} />
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Violation Details Panel */}
        {selectedViolation && (
          <div className="violation-details-panel">
            <div className="panel-header">
              <h2>Violation Details</h2>
              <button 
                className="btn-close"
                onClick={() => setSelectedViolation(null)}
              >
                ×
              </button>
            </div>
            
            <div className="panel-content">
              <div className="detail-section">
                <h3>Basic Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>ID:</label>
                    <span>{selectedViolation.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type:</label>
                    <span>{selectedViolation.violation_type.replace('_', ' ')}</span>
                  </div>
                  <div className="detail-item">
                    <label>Severity:</label>
                    <span 
                      className="severity-badge"
                      style={{ backgroundColor: getSeverityColor(selectedViolation.severity) }}
                    >
                      {selectedViolation.severity}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(selectedViolation.status) }}
                    >
                      {selectedViolation.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Confidence:</label>
                    <span>{(selectedViolation.confidence_score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="detail-item">
                    <label>Detected:</label>
                    <span>{formatTimestamp(selectedViolation.created_at)}</span>
                  </div>
                  {selectedViolation.acknowledged_date && (
                    <div className="detail-item">
                      <label>Acknowledged:</label>
                      <span>{formatTimestamp(selectedViolation.acknowledged_date)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h3>Description</h3>
                <p>{selectedViolation.description}</p>
              </div>

              {selectedViolation.details && (
                <div className="detail-section">
                  <h3>Additional Details</h3>
                  <p>{selectedViolation.details}</p>
                </div>
              )}

              <div className="detail-section">
                <h3>Associated Records</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Event ID:</label>
                    <span>{selectedViolation.event_id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Policy ID:</label>
                    <span>{selectedViolation.policy_id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Violations;
