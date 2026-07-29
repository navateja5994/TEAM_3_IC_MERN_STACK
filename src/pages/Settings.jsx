import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Settings as SettingsIcon, Bell, Eye, Volume2, ShieldAlert, Save, Sun, Moon, Monitor } from 'lucide-react';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { user, reloadProfile } = useAuth();

  // Settings states
  const [reminderOffset, setReminderOffset] = useState(10);
  const [timetableReminders, setTimetableReminders] = useState(true);
  const [classAnnouncements, setClassAnnouncements] = useState(true);
  const [directMessages, setDirectMessages] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.notificationPreferences) {
      setReminderOffset(user.notificationPreferences.reminderOffsetMinutes || 10);
      setTimetableReminders(user.notificationPreferences.timetableReminders !== false);
      setClassAnnouncements(user.notificationPreferences.classAnnouncements !== false);
      setDirectMessages(user.notificationPreferences.directMessages !== false);
      setSoundEnabled(user.notificationPreferences.soundEnabled !== false);
    }
  }, [user]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.put('/api/auth/profile/update', {
        notificationPreferences: {
          reminderOffsetMinutes: parseInt(reminderOffset, 10),
          timetableReminders,
          classAnnouncements,
          directMessages,
          soundEnabled
        }
      });
      await reloadProfile();
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>System Settings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Configure notifications, sound properties, and visual themes</p>
      </div>

      {message && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem',
          fontWeight: 500,
          background: 'var(--success-light)',
          color: 'var(--success)',
          border: '1px solid var(--success)',
          marginBottom: '20px'
        }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Theme Settings card */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sun size={18} color="var(--primary)" />
            <span>Visual Theme</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <button 
              className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTheme('light')}
            >
              <Sun size={16} />
              <span>Light</span>
            </button>
            <button 
              className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTheme('dark')}
            >
              <Moon size={16} />
              <span>Dark</span>
            </button>
            <button 
              className={`btn ${theme === 'system' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTheme('system')}
            >
              <Monitor size={16} />
              <span>System</span>
            </button>
          </div>
        </div>

        {/* Notification preferences card */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="var(--primary)" />
            <span>Alert Preferences</span>
          </h3>

          <form onSubmit={handleSaveSettings}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Reminder Offset (Minutes Before Class)</label>
                <select 
                  className="input-field" 
                  value={reminderOffset}
                  onChange={e => setReminderOffset(e.target.value)}
                >
                  <option value="5">5 Minutes</option>
                  <option value="10">10 Minutes</option>
                  <option value="15">15 Minutes</option>
                  <option value="20">20 Minutes</option>
                  <option value="30">30 Minutes</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Timetable Reminders</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Receive warnings before classes start.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={timetableReminders}
                  onChange={e => setTimetableReminders(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Class Announcements</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Receive notifications for Cancellations/Reschedules.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={classAnnouncements}
                  onChange={e => setClassAnnouncements(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Direct Message Alerts</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Receive notifications for chat messages.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={directMessages}
                  onChange={e => setDirectMessages(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Notification Sounds</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Play chime on receiving new updates.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={soundEnabled}
                  onChange={e => setSoundEnabled(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '24px', gap: '8px' }}
              disabled={loading}
            >
              <Save size={16} />
              <span>{loading ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
