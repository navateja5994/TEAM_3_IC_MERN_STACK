import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Clock, Edit, Trash2, Calendar, CheckCircle2, AlertOctagon, XCircle, X, Check } from 'lucide-react';

const ScheduledMessages = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Reschedule state
  const [editingJob, setEditingJob] = useState(null);
  const [newText, setNewText] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/scheduled');
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch scheduled jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled message?')) return;
    try {
      await api.delete(`/api/scheduled/${id}`);
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel job.');
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleDate || !rescheduleTime) {
      alert('Please fill in both Date and Time.');
      return;
    }

    const targetLocal = new Date(`${rescheduleDate}T${rescheduleTime}`);
    if (targetLocal <= new Date()) {
      alert('Rescheduled time must be in the future.');
      return;
    }

    try {
      // 1. Update text if changed
      if (newText !== editingJob.data.text) {
        await api.put(`/api/scheduled/${editingJob._id}`, { text: newText });
      }
      
      // 2. Reschedule timestamp
      await api.post(`/api/scheduled/${editingJob._id}/reschedule`, {
        newScheduledAt: targetLocal.toISOString()
      });

      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reschedule.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <span className="badge badge-important"><Clock size={12} /> Pending</span>;
      case 'completed':
        return <span className="badge badge-success"><CheckCircle2 size={12} /> Dispatched</span>;
      case 'failed':
        return <span className="badge badge-emergency"><AlertOctagon size={12} /> Failed</span>;
      case 'cancelled':
        return <span className="badge badge-normal"><XCircle size={12} /> Cancelled</span>;
      default:
        return <span className="badge badge-normal">{status}</span>;
    }
  };

  if (loading) {
    return <div className="card skeleton" style={{ height: '300px' }}></div>;
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Scheduled Messages</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track and manage your automated scheduled transmissions</p>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="card flex-center" style={{ height: '240px', flexDirection: 'column', color: 'var(--text-muted)' }}>
          <Clock size={40} style={{ marginBottom: '16px' }} />
          <h3>No Scheduled Messages</h3>
          <p style={{ marginTop: '8px' }}>You haven't scheduled any messages yet. Start one from the chat box!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {jobs.map(job => (
            <div key={job._id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={18} color="var(--primary)" />
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    {new Date(job.scheduledAt).toLocaleString()}
                  </span>
                </div>
                <div>{getStatusBadge(job.status)}</div>
              </div>

              <div style={{ background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                {job.data.messageType === 'voice' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <span>🎤 Voice Memo ({job.data.voiceDuration}s)</span>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{job.data.text}</p>
                )}
              </div>

              {job.status === 'scheduled' && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setEditingJob(job);
                      setNewText(job.data.text || '');
                      const dt = new Date(job.scheduledAt);
                      setRescheduleDate(dt.toISOString().split('T')[0]);
                      setRescheduleTime(dt.toTimeString().split(' ')[0].slice(0, 5));
                    }}
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    <Edit size={14} />
                    <span>Edit / Reschedule</span>
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleCancel(job._id)}
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    <Trash2 size={14} />
                    <span>Cancel Message</span>
                  </button>
                </div>
              )}

              {job.status === 'failed' && (
                <p style={{ color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 500 }}>
                  Error: {job.error} (Retry count: {job.retryCount}/3)
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Edit Modal */}
      {editingJob && (
        <div className="modal-overlay" onClick={() => setEditingJob(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Reschedule Message</h3>
              <button className="btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => setEditingJob(null)}>
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit}>
              {editingJob.data.messageType === 'text' && (
                <div className="form-group">
                  <label className="form-label">Message Content</label>
                  <textarea 
                    className="input-field" 
                    style={{ minHeight: '80px', resize: 'vertical' }}
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">New Date</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={rescheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Time</label>
                  <input 
                    type="time" 
                    className="input-field" 
                    value={rescheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingJob(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledMessages;
