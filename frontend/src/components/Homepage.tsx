import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, AlertTriangle, Lock, CheckCircle, Users, BarChart3, Zap } from 'lucide-react';

const Homepage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Secure Your AI Applications with Enterprise-Grade Governance</h1>
            <p className="hero-subtitle">
              SentinelAI provides real-time monitoring, automated policy enforcement, and comprehensive 
              security controls to protect your business from AI-related risks and ensure compliance.
            </p>
            <button className="cta-button" onClick={handleLoginClick}>
              <Lock size={20} />
              Access Dashboard
            </button>
          </div>
          <div className="hero-visual">
            <div className="security-badge">
              <Shield size={80} />
              <span>Enterprise Security</span>
            </div>
          </div>
        </div>
      </section>

      {/* Security Benefits */}
      <section className="benefits">
        <div className="container">
          <h2>How SentinelAI Secures Your Business</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <AlertTriangle className="benefit-icon" />
              <h3>Threat Detection</h3>
              <p>Automatically detect and prevent prompt injection attacks, data leakage, and malicious AI interactions before they impact your business.</p>
            </div>
            <div className="benefit-card">
              <Eye className="benefit-icon" />
              <h3>Real-Time Monitoring</h3>
              <p>Monitor all AI interactions in real-time with comprehensive logging, alerting, and intervention capabilities across your entire AI infrastructure.</p>
            </div>
            <div className="benefit-card">
              <CheckCircle className="benefit-icon" />
              <h3>Compliance Assurance</h3>
              <p>Ensure regulatory compliance with automated policy enforcement, audit trails, and comprehensive reporting for GDPR, HIPAA, and industry standards.</p>
            </div>
            <div className="benefit-card">
              <Users className="benefit-icon" />
              <h3>Access Control</h3>
              <p>Implement role-based access controls and user management to ensure only authorized personnel can access sensitive AI systems and data.</p>
            </div>
            <div className="benefit-card">
              <BarChart3 className="benefit-icon" />
              <h3>Analytics & Insights</h3>
              <p>Gain deep insights into AI usage patterns, security incidents, and compliance metrics with comprehensive dashboards and reporting.</p>
            </div>
            <div className="benefit-card">
              <Zap className="benefit-icon" />
              <h3>Automated Response</h3>
              <p>Configure automated responses to security threats including blocking, redacting, or alerting based on your organization's security policies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="use-cases">
        <div className="container">
          <h2>Why Businesses Choose SentinelAI</h2>
          <div className="use-cases-grid">
            <div className="use-case">
              <h3>Financial Services</h3>
              <p>Protect sensitive financial data and ensure regulatory compliance while leveraging AI for customer service and fraud detection.</p>
            </div>
            <div className="use-case">
              <h3>Healthcare</h3>
              <p>Safeguard patient information and maintain HIPAA compliance while using AI for diagnostics and patient care optimization.</p>
            </div>
            <div className="use-case">
              <h3>Enterprise SaaS</h3>
              <p>Secure customer data and intellectual property while providing AI-powered features and maintaining customer trust.</p>
            </div>
            <div className="use-case">
              <h3>Government & Defense</h3>
              <p>Ensure national security and classified information protection while leveraging AI for intelligence and operational efficiency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="security-features">
        <div className="container">
          <h2>Enterprise-Grade Security Features</h2>
          <div className="features-list">
            <div className="feature">
              <Shield className="feature-icon" />
              <div>
                <h4>Advanced Threat Protection</h4>
                <p>Multi-layered security including prompt injection prevention, data loss prevention, and malicious content detection.</p>
              </div>
            </div>
            <div className="feature">
              <Lock className="feature-icon" />
              <div>
                <h4>Zero-Trust Architecture</h4>
                <p>Every AI interaction is verified and validated against your security policies before execution.</p>
              </div>
            </div>
            <div className="feature">
              <Eye className="feature-icon" />
              <div>
                <h4>Complete Audit Trail</h4>
                <p>Comprehensive logging and monitoring of all AI interactions for compliance and forensic analysis.</p>
              </div>
            </div>
            <div className="feature">
              <CheckCircle className="feature-icon" />
              <div>
                <h4>Policy Enforcement</h4>
                <p>Automated enforcement of custom security policies with configurable responses and interventions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Homepage;
