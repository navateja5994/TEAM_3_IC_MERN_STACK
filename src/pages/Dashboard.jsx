import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  Calendar as CalendarIcon, 
  MessageSquare, 
  Clock, 
  Bell, 
  ArrowRight,
  User as UserIcon,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    schedule: [],
    scheduledCount: 0,
    unreadMessages: 0,
    unreadNotifications: 0,
    importantNotifications: [],
    conversations: [],
    notifications: []
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      
      // Concurrently fetch APIs
      const [scheduleRes, scheduledRes, convRes, notifRes] = await Promise.all([
        api.get(`/api/timetables/date?date=${todayStr}`),
        api.get('/api/scheduled'),
        api.get('/api/conversations'),
        api.get('/api/notifications')
      ]);

      const schedule = scheduleRes.data.schedule || [];
      const scheduledJobs = scheduledRes.data || [];
      const pendingScheduled = scheduledJobs.filter(j => j.status === 'scheduled').length;
      
      const conversations = convRes.data || [];
      // Calculate unread chats (would check receipts)
      let unreadMsgCount = 0; // Simple fallback
      
      const notifications = notifRes.data || [];
      const unreadNotif = notifications.filter(n => !n.isRead);
      const important = unreadNotif.filter(n => ['important', 'urgent', 'emergency'].includes(n.priority));

      setData({
        schedule,
        scheduledCount: pendingScheduled,
        unreadMessages: unreadMsgCount,
        unreadNotifications: unreadNotif.length,
        importantNotifications: important,
        conversations: conversations.slice(0, 3),
        notifications: notifications.slice(0, 4)
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="dashboard-grid">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="card skeleton" style={{ height: '110px' }}></div>
          ))}
        </div>
        <div className="dashboard-sections">
          <div className="card skeleton" style={{ height: '300px' }}></div>
          <div className="card skeleton" style={{ height: '300px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Welcome Message */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '8px' }}>
          Welcome back, {user?.name} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {user?.role === 'teacher' ? 'Manage your teaching timetable and class reminders' : 'Stay up to date with your class schedule and group chats'}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="dashboard-grid">
        <Link to="/timetable" className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <CalendarIcon size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{data.schedule.length}</h4>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Today's Classes</span>
          </div>
        </Link>

        <Link to="/scheduled" className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <Clock size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{data.scheduledCount}</h4>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pending Schedules</span>
          </div>
        </Link>

        <Link to="/messages" className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{data.unreadMessages}</h4>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Unread Messages</span>
          </div>
        </Link>

        <Link to="/notifications" className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <Bell size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{data.unreadNotifications}</h4>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Important Alerts</span>
          </div>
        </Link>
      </div>

      {/* Main Sections */}
      <div className="dashboard-sections">
        {/* Today's Schedule Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarDays size={20} color="var(--primary)" />
              <span>Today's Classes</span>
            </h3>
            <Link to="/timetable" style={{ fontSize: '0.85rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <span>View Full Week</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {data.schedule.length === 0 ? (
            <div className="flex-center" style={{ height: '180px', flexDirection: 'column', color: 'var(--text-secondary)', gap: '10px' }}>
              <span style={{ fontSize: '2rem' }}>🎉</span>
              <p>No classes scheduled for today.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.schedule.map((slot) => (
                <div key={slot._id} style={{
                  padding: '16px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ fontWeight: 600 }}>{slot.subject}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Room {slot.room} &bull; Teacher: {slot.teacher ? slot.teacher.name : 'Faculty'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {slot.startTime} - {slot.endTime}
                    </span>
                    <div style={{ marginTop: '4px' }}>
                      <span className={`badge ${slot.status === 'Cancelled' ? 'badge-emergency' : slot.status.startsWith('Substitute') ? 'badge-urgent' : slot.status === 'Rescheduled' ? 'badge-important' : 'badge-success'}`}>
                        {slot.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications and Conversations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Recent Notifications Widget */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="var(--primary)" />
              <span>Recent Alerts</span>
            </h3>

            {data.notifications.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
                No notifications received yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.notifications.map(n => (
                  <div key={n._id} style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    <span style={{ fontSize: '1.2rem', marginTop: '2px' }}>
                      {n.priority === 'emergency' || n.priority === 'urgent' ? '⚠️' : '🔔'}
                    </span>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{n.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                        {n.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Conversations Widget */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} color="var(--primary)" />
              <span>Recent Conversations</span>
            </h3>

            {data.conversations.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
                No active conversations yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.conversations.map(c => {
                  // Resolve display recipient name
                  const rec = c.isGroup 
                    ? { name: c.groupId.name, profileImage: c.groupId.groupImage }
                    : c.participants.find(p => p._id !== user?._id) || { name: 'Chat' };

                  return (
                    <Link to="/messages" key={c._id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)'
                    }}>
                      <div className="flex-center" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600 }}>
                        {rec.profileImage ? <img src={rec.profileImage} alt={rec.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : <UserIcon size={14} />}
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{rec.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                          {c.lastMessage ? c.lastMessage.text : 'Start chatting'}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
