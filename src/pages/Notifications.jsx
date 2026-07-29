import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Bell, Eye, CheckSquare, Trash, AlertTriangle, Layers, Calendar, MessageSquare } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); // All, Today, Classes, Messages, Important

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/api/notifications/mark-all-read');
      // Refresh list
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkSingleRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      // Update state
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const getFilteredNotifications = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    switch (activeTab) {
      case 'Today':
        return notifications.filter(n => n.createdAt.startsWith(todayStr));
      case 'Classes':
        return notifications.filter(n => n.type === 'timetable');
      case 'Messages':
        return notifications.filter(n => n.type === 'message');
      case 'Important':
        return notifications.filter(n => ['important', 'urgent', 'emergency'].includes(n.priority));
      default:
        return notifications;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'emergency':
        return <span className="badge badge-emergency">Emergency</span>;
      case 'urgent':
        return <span className="badge badge-emergency">Urgent</span>;
      case 'important':
        return <span className="badge badge-urgent">Important</span>;
      default:
        return <span className="badge badge-normal">Normal</span>;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'timetable':
        return <Calendar size={18} color="var(--primary)" />;
      case 'message':
        return <MessageSquare size={18} color="#3b82f6" />;
      case 'announcement':
        return <AlertTriangle size={18} color="#f59e0b" />;
      default:
        return <Bell size={18} color="var(--text-muted)" />;
    }
  };

  const filtered = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return <div className="card skeleton" style={{ height: '300px' }}></div>;
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Notification Center</h2>
          <p style={{ color: 'var(--text-secondary)' }}>You have {unreadCount} unread notification(s)</p>
        </div>

        {unreadCount > 0 && (
          <button className="btn btn-secondary" onClick={handleMarkAllRead}>
            <CheckSquare size={16} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '12px',
        marginBottom: '20px',
        overflowX: 'auto'
      }}>
        {['All', 'Today', 'Classes', 'Messages', 'Important'].map(tab => (
          <button 
            key={tab} 
            className="btn"
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '6px 12px', 
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === tab ? 'var(--primary)' : 'var(--bg-tertiary)',
              color: activeTab === tab ? '#ffffff' : 'var(--text-primary)',
              border: activeTab === tab ? 'none' : '1px solid var(--border-color)'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Feed list */}
      {filtered.length === 0 ? (
        <div className="card flex-center" style={{ height: '200px', flexDirection: 'column', color: 'var(--text-muted)' }}>
          <Bell size={32} style={{ marginBottom: '12px' }} />
          <h3>No Notifications</h3>
          <p style={{ marginTop: '4px', fontSize: '0.9rem' }}>No alerts in this category.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(n => (
            <div 
              key={n._id} 
              className="card"
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: n.isRead ? 'var(--bg-secondary)' : 'var(--primary-light)',
                borderColor: n.isRead ? 'var(--border-color)' : 'var(--primary-glow)'
              }}
            >
              <div className="flex-center" style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)'
              }}>
                {getNotificationIcon(n.type)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{n.title}</h4>
                  {getPriorityBadge(n.priority)}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                  {n.body}
                </p>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>

              {!n.isRead && (
                <button 
                  className="btn-icon" 
                  title="Mark as read"
                  onClick={() => handleMarkSingleRead(n._id)}
                  style={{ width: '32px', height: '32px' }}
                >
                  <Eye size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
