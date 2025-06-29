import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Play, Pause, Search, Filter, FileText, AlertTriangle } from 'lucide-react';
import { apiService } from '../services/api';

interface Policy {
  id: number;
  name: string;
  definition: string;
  category: string;
  status: string;
  severity: string;
  performance_mode: string;
  intervention_type: string;
  intervention_config?: string;
  estimated_cost_per_event: number;
  estimated_latency_ms: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}

interface PolicyTemplate {
  id: number;
  name: string;
  category: string;
  description: string;
  template_code: string;
  default_severity: string;
  default_performance_mode: string;
  tags: string;
}

const Policies: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [templates, setTemplates] = useState<PolicyTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PolicyTemplate | null>(null);

  useEffect(() => {
    fetchPolicies();
    fetchTemplates();
  }, [statusFilter, categoryFilter]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      
      const data = await apiService.getPolicies(params);
      setPolicies(data);
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const data = await apiService.getPolicyTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleCreatePolicy = async (policyData: any) => {
    try {
      await apiService.createPolicy(policyData);
      fetchPolicies();
      setShowCreateModal(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Error creating policy:', error);
    }
  };

  const handleUpdatePolicy = async (policyId: number, policyData: any) => {
    try {
      await apiService.updatePolicy(policyId, policyData);
      fetchPolicies();
      setEditingPolicy(null);
    } catch (error) {
      console.error('Error updating policy:', error);
    }
  };

  const handleDeletePolicy = async (policyId: number) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        await apiService.deletePolicy(policyId);
        fetchPolicies();
      } catch (error) {
        console.error('Error deleting policy:', error);
      }
    }
  };

  const handleToggleStatus = async (policy: Policy) => {
    const newStatus = policy.status === 'open' ? 'acknowledged' : 'open';
    await handleUpdatePolicy(policy.id, { status: newStatus });
  };

  const filteredPolicies = policies.filter(policy =>
    policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.definition.toLowerCase().includes(searchTerm.toLowerCase())
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
      case 'open': return '#16a34a';
      case 'acknowledged': return '#d97706';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <div className="policies-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Policies</h1>
          <p>Define and manage governance policies for AI behavior</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowTemplateModal(true)}
          >
            <FileText size={16} />
            Templates
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} />
            Create Policy
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search policies..."
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
            <option value="acknowledged">Acknowledged</option>
            <option value="closed">Closed</option>
          </select>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="data_security">Data Security</option>
            <option value="privacy">Privacy</option>
            <option value="compliance">Compliance</option>
            <option value="governance">Governance</option>
            <option value="incident_detection">Incident Detection</option>
          </select>
        </div>
      </div>

      {/* Policies List */}
      <div className="policies-grid">
        {loading ? (
          <div className="loading-state">Loading policies...</div>
        ) : filteredPolicies.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <h3>No policies found</h3>
            <p>Create your first AI policy to get started</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              Create Policy
            </button>
          </div>
        ) : (
          filteredPolicies.map((policy) => (
            <div key={policy.id} className="policy-card">
              <div className="policy-header">
                <div className="policy-title">
                  <h3>{policy.name}</h3>
                  <div className="policy-badges">
                    <span 
                      className="severity-badge"
                      style={{ backgroundColor: getSeverityColor(policy.severity) }}
                    >
                      {policy.severity}
                    </span>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(policy.status) }}
                    >
                      {policy.status}
                    </span>
                  </div>
                </div>
                <div className="policy-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleToggleStatus(policy)}
                    title={policy.status === 'open' ? 'Pause Policy' : 'Activate Policy'}
                  >
                    {policy.status === 'open' ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => setEditingPolicy(policy)}
                    title="Edit Policy"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn-icon danger"
                    onClick={() => handleDeletePolicy(policy.id)}
                    title="Delete Policy"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="policy-content">
                <div className="policy-definition">
                  <strong>Definition:</strong>
                  <code>{policy.definition}</code>
                </div>
                
                <div className="policy-details">
                  <div className="detail-item">
                    <span>Category:</span>
                    <span>{policy.category.replace('_', ' ')}</span>
                  </div>
                  <div className="detail-item">
                    <span>Performance:</span>
                    <span>{policy.performance_mode}</span>
                  </div>
                  <div className="detail-item">
                    <span>Intervention:</span>
                    <span>{policy.intervention_type}</span>
                  </div>
                  <div className="detail-item">
                    <span>Cost/Event:</span>
                    <span>${policy.estimated_cost_per_event.toFixed(3)}</span>
                  </div>
                  <div className="detail-item">
                    <span>Latency:</span>
                    <span>{policy.estimated_latency_ms}ms</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Policy Modal */}
      {(showCreateModal || editingPolicy) && (
        <PolicyModal
          policy={editingPolicy}
          template={selectedTemplate}
          onSave={editingPolicy ? 
            (data) => handleUpdatePolicy(editingPolicy.id, data) : 
            handleCreatePolicy
          }
          onClose={() => {
            setShowCreateModal(false);
            setEditingPolicy(null);
            setSelectedTemplate(null);
          }}
        />
      )}

      {/* Templates Modal */}
      {showTemplateModal && (
        <TemplatesModal
          templates={templates}
          onSelectTemplate={(template) => {
            setSelectedTemplate(template);
            setShowTemplateModal(false);
            setShowCreateModal(true);
          }}
          onClose={() => setShowTemplateModal(false)}
        />
      )}
    </div>
  );
};

// Policy Modal Component
interface PolicyModalProps {
  policy?: Policy | null;
  template?: PolicyTemplate | null;
  onSave: (data: any) => void;
  onClose: () => void;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ policy, template, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: policy?.name || template?.name || '',
    definition: policy?.definition || template?.template_code || '',
    category: policy?.category || template?.category || 'data_security',
    severity: policy?.severity || template?.default_severity || 'medium',
    performance_mode: policy?.performance_mode || template?.default_performance_mode || 'balanced',
    intervention_type: policy?.intervention_type || 'notification',
    intervention_config: policy?.intervention_config || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{policy ? 'Edit Policy' : 'Create New Policy'}</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Definition</label>
            <textarea
              value={formData.definition}
              onChange={(e) => setFormData({...formData, definition: e.target.value})}
              rows={4}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="data_security">Data Security</option>
                <option value="privacy">Privacy</option>
                <option value="compliance">Compliance</option>
                <option value="governance">Governance</option>
                <option value="incident_detection">Incident Detection</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({...formData, severity: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Performance Mode</label>
              <select
                value={formData.performance_mode}
                onChange={(e) => setFormData({...formData, performance_mode: e.target.value})}
              >
                <option value="fast">Fast</option>
                <option value="balanced">Balanced</option>
                <option value="robust">Robust</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Intervention Type</label>
              <select
                value={formData.intervention_type}
                onChange={(e) => setFormData({...formData, intervention_type: e.target.value})}
              >
                <option value="notification">Notification</option>
                <option value="block">Block</option>
                <option value="redact">Redact</option>
              </select>
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {policy ? 'Update' : 'Create'} Policy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Templates Modal Component
interface TemplatesModalProps {
  templates: PolicyTemplate[];
  onSelectTemplate: (template: PolicyTemplate) => void;
  onClose: () => void;
}

const TemplatesModal: React.FC<TemplatesModalProps> = ({ templates, onSelectTemplate, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Policy Templates</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="templates-grid">
            {templates.map((template) => (
              <div key={template.id} className="template-card">
                <h3>{template.name}</h3>
                <p>{template.description}</p>
                <div className="template-details">
                  <span className="template-category">{template.category}</span>
                  <span className="template-severity">{template.default_severity}</span>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => onSelectTemplate(template)}
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies;
