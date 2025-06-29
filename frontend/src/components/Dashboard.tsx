import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Shield, AlertTriangle, FileText, Activity, TrendingUp, Clock, Users, Zap, Brain, Cpu, Database, Network } from 'lucide-react';
import { apiService } from '../services/api';

interface DashboardStats {
  total_policies: number;
  active_policies: number;
  total_events: number;
  open_violations: number;
  events_last_24h: number;
  critical_violations: number;
}

interface TimelineData {
  date: string;
  total: number;
  severity_breakdown: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

interface RecentActivity {
  type: string;
  id: number;
  title: string;
  severity: string;
  timestamp: string;
  status: string;
}

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
    
    // Auto-refresh for real-time monitoring
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

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

  const pieData = [
    { name: 'Active Policies', value: stats?.active_policies || 0, color: '#16a34a' },
    { name: 'Inactive Policies', value: (stats?.total_policies || 0) - (stats?.active_policies || 0), color: '#6b7280' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>AI governance monitoring and policy management</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={28} />
          </div>
          <div className="stat-content">
            <h3>Policies</h3>
            <p className="stat-number">{stats?.total_policies || 0}</p>
            <span className="stat-label">{stats?.active_policies || 0} active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Activity size={28} />
          </div>
          <div className="stat-content">
            <h3>Events</h3>
            <p className="stat-number">{stats?.total_events || 0}</p>
            <span className="stat-label">{stats?.events_last_24h || 0} last 24h</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <AlertTriangle size={28} />
          </div>
          <div className="stat-content">
            <h3>Violations</h3>
            <p className="stat-number">{stats?.open_violations || 0}</p>
            <span className="stat-label">{stats?.critical_violations || 0} critical</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Shield size={28} />
          </div>
          <div className="stat-content">
            <h3>System Status</h3>
            <p className="stat-number">99.7%</p>
            <span className="stat-label">uptime</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Events Timeline (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Policy Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="activity-section">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {recentActivity.map((activity) => (
            <div key={`${activity.type}-${activity.id}`} className="activity-item">
              <div className="activity-icon">
                {activity.type === 'event' ? <Activity size={16} /> : <AlertTriangle size={16} />}
              </div>
              <div className="activity-content">
                <h4>{activity.title}</h4>
                <p>{formatTimestamp(activity.timestamp)}</p>
              </div>
              <div className="activity-badges">
                <span 
                  className="severity-badge" 
                  style={{ backgroundColor: getSeverityColor(activity.severity) }}
                >
                  {activity.severity}
                </span>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(activity.status) }}
                >
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
