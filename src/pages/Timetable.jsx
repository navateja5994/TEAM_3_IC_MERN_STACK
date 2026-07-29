import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Calendar, User, MapPin, AlertCircle, X, ShieldAlert, ArrowLeftRight } from 'lucide-react';

const Timetable = () => {
  const { user } = useAuth();
  
  const [weekSchedules, setWeekSchedules] = useState({}); // { 'YYYY-MM-DD': [slots] }
  const [weekDates, setWeekDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal States
  const [selectedSlot, setSelectedSlot] = useState(null); // template
  const [selectedDate, setSelectedDate] = useState('');
  const [actionType, setActionType] = useState(''); // cancel, reschedule, substitute
  
  // Teachers list for substitute assignment
  const [teachers, setTeachers] = useState([]);

  // Form states
  const [reason, setReason] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [subTeacherId, setSubTeacherId] = useState('');

  // Add slot states
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [classes, setClasses] = useState([]);
  const [addSubject, setAddSubject] = useState('');
  const [addRoom, setAddRoom] = useState('');
  const [addDayOfWeek, setAddDayOfWeek] = useState('1'); // Monday = 1
  const [addStartTime, setAddStartTime] = useState('09:00');
  const [addEndTime, setAddEndTime] = useState('10:30');
  const [addClassId, setAddClassId] = useState('');
  const [addSemesterStart, setAddSemesterStart] = useState(new Date().toISOString().split('T')[0]);
  const [addSemesterEnd, setAddSemesterEnd] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split('T')[0];
  });
  const [addTeacherId, setAddTeacherId] = useState(user?._id || user?.id || '');

  // Generate week dates (Monday to Friday)
  const calculateWeekDates = (date) => {
    const dates = [];
    const day = date.getDay();
    // Monday offset
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + mondayOffset);

    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    setWeekDates(dates);
  };

  useEffect(() => {
    calculateWeekDates(currentDate);
  }, [currentDate]);

  const fetchWeekTimetable = async () => {
    if (weekDates.length === 0) return;
    setLoading(true);
    try {
      const schedules = {};
      await Promise.all(
        weekDates.map(async (dt) => {
          const res = await api.get(`/api/timetables/date?date=${dt}`);
          schedules[dt] = res.data.schedule || [];
        })
      );
      setWeekSchedules(schedules);
    } catch (err) {
      console.error('Failed to load week timetable:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekTimetable();
  }, [weekDates]);

  // Load teachers for substitute dropdown
  const loadTeachers = async () => {
    try {
      const res = await api.get('/api/users/contacts');
      setTeachers(res.data.teachers || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.role === 'teacher' || user?.role === 'admin') {
      loadTeachers();
    }
  }, [user]);

  // Fetch classes list for creating slots
  useEffect(() => {
    if (isAddingSlot) {
      const fetchClasses = async () => {
        try {
          const res = await api.get('/api/classes');
          setClasses(res.data || []);
          if (res.data && res.data.length > 0) {
            setAddClassId(res.data[0]._id);
          }
        } catch (err) {
          console.error('Failed to load classes:', err);
        }
      };
      fetchClasses();
      
      if (user && !addTeacherId) {
        setAddTeacherId(user._id || user.id || '');
      }
    }
  }, [isAddingSlot, user, addTeacherId]);

  const handleAddSlotSubmit = async (e) => {
    e.preventDefault();
    if (!addSubject || !addRoom || !addClassId || !addStartTime || !addEndTime || !addSemesterStart || !addSemesterEnd) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      await api.post('/api/timetables', {
        teacherId: addTeacherId,
        subject: addSubject,
        room: addRoom,
        dayOfWeek: parseInt(addDayOfWeek, 10),
        startTime: addStartTime,
        endTime: addEndTime,
        classId: addClassId,
        semesterStart: addSemesterStart,
        semesterEnd: addSemesterEnd
      });

      alert('Timetable slot added successfully.');
      setIsAddingSlot(false);
      
      // Clear form
      setAddSubject('');
      setAddRoom('');
      
      // Reload calendar
      fetchWeekTimetable();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add timetable slot.');
    }
  };

  const handlePrevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(currentDate.getDate() - 7);
    setCurrentDate(d);
  };

  const handleNextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(currentDate.getDate() + 7);
    setCurrentDate(d);
  };

  const handleSlotClick = (slot, date) => {
    if (user?.role !== 'teacher' && user?.role !== 'admin') return;
    setSelectedSlot(slot);
    setSelectedDate(date);
    setActionType('');
    setReason('');
    setNewStartTime(slot.startTime);
    setNewEndTime(slot.endTime);
    setNewRoom(slot.room);
    setSubTeacherId('');
  };

  // Submit cancel request
  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/timetables/cancel', {
        timetableId: selectedSlot._id,
        date: selectedDate,
        reason
      });
      alert('Class cancelled. Students notified.');
      setSelectedSlot(null);
      fetchWeekTimetable();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel class.');
    }
  };

  // Submit reschedule request
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/timetables/reschedule', {
        timetableId: selectedSlot._id,
        date: selectedDate,
        newStartTime,
        newEndTime,
        newRoom,
        reason
      });
      alert('Class rescheduled. Students notified.');
      setSelectedSlot(null);
      fetchWeekTimetable();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reschedule class.');
    }
  };

  // Submit substitute teacher request
  const handleSubstituteSubmit = async (e) => {
    e.preventDefault();
    if (!subTeacherId) {
      alert('Please select a substitute teacher.');
      return;
    }
    try {
      await api.post('/api/timetables/substitute', {
        timetableId: selectedSlot._id,
        date: selectedDate,
        substituteTeacherId: subTeacherId,
        reason
      });
      alert('Substitute teacher assigned.');
      setSelectedSlot(null);
      fetchWeekTimetable();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to assign substitute.');
    }
  };

  const getDayName = (dateStr) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(dateStr).getDay()];
  };

  const getStatusStyle = (status) => {
    if (status === 'Cancelled') return { background: 'var(--danger-light)', color: 'var(--danger)' };
    if (status === 'Rescheduled') return { background: 'var(--info-light)', color: 'var(--info)' };
    if (status.startsWith('Substitute')) return { background: 'var(--warning-light)', color: 'var(--warning)' };
    return { background: 'var(--success-light)', color: 'var(--success)' };
  };

  return (
    <div className="fade-in">
      <div className="timetable-header">
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Academic Timetable</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Weekly timetable slots. {user?.role === 'teacher' ? 'Click on a card to apply overrides.' : ''}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={handlePrevWeek}>&larr; Prev Week</button>
          <button className="btn btn-secondary" onClick={handleNextWeek}>Next Week &rarr;</button>
          {(user?.role === 'teacher' || user?.role === 'admin') && (
            <button className="btn btn-primary" onClick={() => setIsAddingSlot(true)}>+ Add Class Slot</button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="card skeleton" style={{ height: '350px' }}></div>
      ) : (
        <div className="timetable-grid">
          {weekDates.map((dt) => {
            const dayName = getDayName(dt);
            const slots = weekSchedules[dt] || [];
            
            return (
              <div key={dt} className="timetable-column">
                <div className="day-header">
                  <div>{dayName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{dt}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px', flex: 1 }}>
                  {slots.length === 0 ? (
                    <div className="flex-center" style={{ flex: 1, color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
                      No classes
                    </div>
                  ) : (
                    slots.map((slot) => (
                      <div 
                        key={slot._id} 
                        className="class-card"
                        onClick={() => handleSlotClick(slot, dt)}
                      >
                        <span className="class-time">{slot.startTime} - {slot.endTime}</span>
                        <span className="class-subject">{slot.subject}</span>
                        
                        <div className="class-details">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} />
                            <span>Room: {slot.room}</span>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={12} />
                            <span>
                              {user?.role === 'teacher' 
                                ? (slot.class?.name || 'Class') 
                                : (slot.teacher?.name || 'Faculty')
                              }
                            </span>
                          </span>
                        </div>

                        <span 
                          className="class-status-badge"
                          style={getStatusStyle(slot.status)}
                        >
                          {slot.status}
                        </span>

                        {slot.reason && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '4px' }}>
                            Note: {slot.reason}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Override Actions Modal */}
      {selectedSlot && (
        <div className="modal-overlay" onClick={() => setSelectedSlot(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Class Adjustments ({selectedSlot.subject})</h3>
              <button className="btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => setSelectedSlot(null)}>
                <X size={14} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Apply modifications for the class on <strong>{selectedDate}</strong> at {selectedSlot.startTime}.
            </p>

            {actionType === '' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  className="btn btn-danger" 
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                  onClick={() => setActionType('cancel')}
                >
                  <X size={16} />
                  <span>Cancel Today's Class</span>
                </button>
                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--info)' }}
                  onClick={() => setActionType('reschedule')}
                >
                  <Calendar size={16} />
                  <span>Reschedule Room/Time</span>
                </button>
                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--warning)' }}
                  onClick={() => setActionType('substitute')}
                >
                  <ArrowLeftRight size={16} />
                  <span>Assign Substitute Faculty</span>
                </button>
              </div>
            )}

            {/* Cancel Form */}
            {actionType === 'cancel' && (
              <form onSubmit={handleCancelSubmit}>
                <div className="form-group">
                  <label className="form-label">Reason for Cancellation</label>
                  <textarea 
                    className="input-field" 
                    placeholder="Faculty unavailable..."
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setActionType('')}>Back</button>
                  <button type="submit" className="btn btn-danger">Confirm Cancellation</button>
                </div>
              </form>
            )}

            {/* Reschedule Form */}
            {actionType === 'reschedule' && (
              <form onSubmit={handleRescheduleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">New Start Time</label>
                    <input 
                      type="time" 
                      className="input-field" 
                      value={newStartTime}
                      onChange={e => setNewStartTime(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New End Time</label>
                    <input 
                      type="time" 
                      className="input-field" 
                      value={newEndTime}
                      onChange={e => setNewEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">New Classroom</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={newRoom}
                    onChange={e => setNewRoom(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Reason</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Lab rescheduling..."
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setActionType('')}>Back</button>
                  <button type="submit" className="btn btn-primary">Confirm Reschedule</button>
                </div>
              </form>
            )}

            {/* Substitute Form */}
            {actionType === 'substitute' && (
              <form onSubmit={handleSubstituteSubmit}>
                <div className="form-group">
                  <label className="form-label">Select Substitute Faculty</label>
                  <select 
                    className="input-field"
                    value={subTeacherId}
                    onChange={e => setSubTeacherId(e.target.value)}
                    required
                  >
                    <option value="">Choose Teacher</option>
                    {teachers.map(t => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Reason</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Faculty on leave..."
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setActionType('')}>Back</button>
                  <button type="submit" className="btn btn-primary" style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }}>Assign Substitute</button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Create Timetable Entry Modal */}
      {isAddingSlot && (
        <div className="modal-overlay" onClick={() => setIsAddingSlot(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Create Timetable Slot</h3>
              <button className="btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => setIsAddingSlot(false)}>
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleAddSlotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {user?.role === 'admin' && (
                <div className="form-group">
                  <label className="form-label">Assign Faculty Member</label>
                  <select 
                    className="input-field" 
                    value={addTeacherId} 
                    onChange={e => setAddTeacherId(e.target.value)}
                  >
                    <option value="">-- Select Teacher --</option>
                    {teachers.map(t => (
                      <option key={t._id} value={t._id}>{t.name} ({t.department?.name || 'No Dept'})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Subject / Course Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Advanced Machine Learning"
                  value={addSubject}
                  onChange={e => setAddSubject(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Classroom / Room</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Room 302"
                    value={addRoom}
                    onChange={e => setAddRoom(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Class Section</label>
                  <select 
                    className="input-field" 
                    value={addClassId} 
                    onChange={e => setAddClassId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Class --</option>
                    {classes.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Day of the Week</label>
                <select 
                  className="input-field" 
                  value={addDayOfWeek} 
                  onChange={e => setAddDayOfWeek(e.target.value)}
                  required
                >
                  <option value="1">Monday</option>
                  <option value="2">Tuesday</option>
                  <option value="3">Wednesday</option>
                  <option value="4">Thursday</option>
                  <option value="5">Friday</option>
                  <option value="6">Saturday</option>
                  <option value="0">Sunday</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input 
                    type="time" 
                    className="input-field" 
                    value={addStartTime}
                    onChange={e => setAddStartTime(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input 
                    type="time" 
                    className="input-field" 
                    value={addEndTime}
                    onChange={e => setAddEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Semester Start Date</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={addSemesterStart}
                    onChange={e => setAddSemesterStart(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Semester End Date</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={addSemesterEnd}
                    onChange={e => setAddSemesterEnd(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddingSlot(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Create Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Timetable;
