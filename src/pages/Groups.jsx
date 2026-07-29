import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useSocket } from '../context/SocketContext';
import { Users, Plus, X, Search, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Groups = () => {
  const navigate = useNavigate();
  const socket = useSocket();

  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Creation state
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [groupsRes, contactsRes] = await Promise.all([
        api.get('/api/groups'),
        api.get('/api/users/contacts')
      ]);
      setGroups(groupsRes.data);
      
      // Combine students and teachers into contacts list
      const combined = [
        ...(contactsRes.data.teachers || []),
        ...(contactsRes.data.students || [])
      ];
      setContacts(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(prev => prev.filter(id => id !== userId));
    } else {
      setSelectedMembers(prev => [...prev, userId]);
    }
  };

  const handleCreateGroupSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Group name is required.');
      return;
    }

    try {
      const res = await api.post('/api/groups', {
        name,
        description,
        members: selectedMembers
      });

      // Notify socket server to join new room
      if (socket) {
        socket.emit('join_group_room', { groupId: res.data.group._id });
      }

      setIsCreating(false);
      setName('');
      setDescription('');
      setSelectedMembers([]);
      fetchData();
      
      // Navigate to chat
      navigate('/messages');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create group.');
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="card skeleton" style={{ height: '300px' }}></div>;
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>My Channels & Groups</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Communicate with study groups and institutional classes</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
          <Plus size={18} />
          <span>New Group</span>
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="card flex-center" style={{ height: '240px', flexDirection: 'column', color: 'var(--text-muted)' }}>
          <Users size={40} style={{ marginBottom: '16px' }} />
          <h3>No Channels Joined</h3>
          <p style={{ marginTop: '8px' }}>You are not enrolled in any study groups or class channels.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {groups.map(group => (
            <div key={group._id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{group.name}</h3>
                {group.isClassGroup ? (
                  <span className="badge badge-important">Class Channel</span>
                ) : (
                  <span className="badge badge-normal">Study Group</span>
                )}
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.4, minHeight: '40px' }}>
                {group.description || 'No description provided.'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Role: <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{group.role}</span>
                </span>
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => navigate('/messages')}>
                  Open Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      {isCreating && (
        <div className="modal-overlay" onClick={() => setIsCreating(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Create New Study Group</h3>
              <button className="btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => setIsCreating(false)}>
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit}>
              <div className="form-group">
                <label className="form-label">Group Name *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Java Study Team"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="input-field" 
                  placeholder="Study notes exchange and exam prep"
                  style={{ minHeight: '60px', resize: 'vertical' }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Add Members</label>
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Search directory..."
                    style={{ paddingLeft: '36px', paddingY: '8px' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '6px' }}>
                  {filteredContacts.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>No contacts found.</p>
                  ) : (
                    filteredContacts.map(c => {
                      const isSelected = selectedMembers.includes(c._id);
                      return (
                        <div 
                          key={c._id} 
                          style={{
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            padding: '8px', 
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            background: isSelected ? 'var(--primary-light)' : 'transparent'
                          }}
                          onClick={() => handleToggleMember(c._id)}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{c.name}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{c.role}</span>
                          </div>
                          {isSelected && <Check size={16} color="var(--primary)" />}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsCreating(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Group</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
