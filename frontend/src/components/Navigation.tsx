import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, BarChart3, FileText, AlertTriangle, Moon, Sun, Menu, X, Activity, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ darkMode, toggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Command Center', icon: BarChart3, description: 'System Overview' },
    { path: '/policies', label: 'Neural Policies', icon: FileText, description: 'AI Governance Rules' },
    { path: '/events', label: 'Data Streams', icon: Activity, description: 'Real-time Events' },
    { path: '/violations', label: 'Threat Matrix', icon: AlertTriangle, description: 'Security Violations' },
  ];

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-toggle"
        onClick={toggleNav}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 2000,
          background: 'var(--bg-glass)',
          backdropFilter: 'var(--glass-backdrop)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '0.75rem',
          color: 'var(--neon-cyan)',
          cursor: 'pointer',
          transition: 'var(--transition-smooth)',
          display: 'none'
        }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={`navigation ${isOpen ? 'open' : ''}`}>
        <div className="nav-header">
          <div className="nav-logo">
            <Shield className="logo-icon" size={28} />
            <div>
              <span className="logo-text">SENTINEL</span>
              <div style={{ 
                fontSize: '0.7rem', 
                color: 'var(--neon-green)', 
                letterSpacing: '2px',
                textShadow: '0 0 10px var(--neon-green)'
              }}>
                AI NEXUS
              </div>
            </div>
          </div>
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        
        {/* System Status Indicator */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: 'var(--neon-green)',
            borderRadius: '50%',
            boxShadow: 'var(--glow-green)',
            animation: 'activePulse 1.5s ease-in-out infinite'
          }}></div>
          <span style={{
            fontSize: '0.85rem',
            color: 'var(--neon-green)',
            textShadow: '0 0 10px var(--neon-green)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            SYSTEM ONLINE
          </span>
        </div>
        
        <ul className="nav-menu">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                            (location.pathname === '/' && item.path === '/dashboard');
            
            return (
              <li key={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
                <Link 
                  to={item.path} 
                  className="nav-link"
                  onClick={() => setIsOpen(false)}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <Icon size={22} />
                  <div>
                    <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{item.label}</span>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--text-muted)',
                      marginTop: '2px'
                    }}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        
        {/* Quick Stats */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--glass-border)',
          borderBottom: '1px solid var(--glass-border)'
        }}>
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: '600'
          }}>
            NEURAL ACTIVITY
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CPU Load</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)' }}>23%</span>
          </div>
          <div style={{
            height: '4px',
            background: 'var(--bg-tertiary)',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '0.75rem'
          }}>
            <div style={{
              width: '23%',
              height: '100%',
              background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))',
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Threats Blocked</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--neon-green)' }}>1,247</span>
          </div>
        </div>
        
        <div className="nav-footer">
          <div className="user-info">
            <div className="user-avatar">
              <User size={18} />
            </div>
            <div className="user-details">
              <span className="user-name">{user?.username.toUpperCase() || 'USER'}</span>
              <span className="user-role">{user?.role.toUpperCase() || 'OPERATOR'}</span>
            </div>
            <button 
              className="logout-button"
              onClick={handleLogout}
              title="Logout"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '8px',
                transition: 'var(--transition-smooth)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            zIndex: 999,
            display: 'none'
          }}
        />
      )}
    </>
  );
};

export default Navigation;
