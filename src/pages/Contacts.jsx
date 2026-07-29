import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, User, MessageSquare, Phone, ShieldAlert, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Contacts = () => {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState({ teachers: [], students: [], recent: [] });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('Teachers'); // Teachers, Students, Recent

  // Phone Lookup states
  const [searchPhone, setSearchPhone] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/users/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error('Failed to load contacts directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handlePhoneSearch = async (e) => {
    e.preventDefault();
    setSearchError('');
    setSearchResult(null);

    if (!searchPhone.trim()) {
      setSearchError('Please enter a phone number.');
      return;
    }

    setSearchLoading(true);
    try {
      const res = await api.get(`/api/users/search?phone=${encodeURIComponent(searchPhone)}`);
      setSearchResult(res.data);
    } catch (err) {
      setSearchError(err.response?.data?.error || 'User not found or rate limit hit.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleStartChat = async (userId) => {
    try {
      const res = await api.post('/api/conversations/direct', { recipientId: userId });
      // Redirect to messages page with state to auto-select chat
      navigate('/messages', { state: { selectConversationId: res.data._id } });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to start chat.');
    }
  };

  const getSectionData = () => {
    if (activeSection === 'Teachers') return contacts.teachers || [];
    if (activeSection === 'Students') return contacts.students || [];
    return contacts.recent || [];
  };

  const list = getSectionData();

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Phone number lookup widget */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={18} color="var(--primary)" />
          <span>Find Contact by Phone</span>
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Enter the exact E.164 mobile number to search registered users securely.
        </p>

        <form onSubmit={handlePhoneSearch} style={{ display: 'flex', gap: '12px' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <div style={{ position: 'relative' }}>
              <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input 
                type="text" 
                className="input-field"
                placeholder="+919876543210"
                style={{ paddingLeft: '38px', paddingY: '10px' }}
                value={searchPhone}
                onChange={e => setSearchPhone(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={searchLoading} style={{ padding: '0 24px' }}>
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {searchError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 500 }}>
            <ShieldAlert size={16} />
            <span>{searchError}</span>
          </div>
        )}

        {searchResult && (
          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ fontWeight: 600 }}>{searchResult.name}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Role: <span style={{ textTransform: 'capitalize' }}>{searchResult.role}</span> &bull; Phone: {searchResult.phoneNumberMasked}
              </p>
              {searchResult.department && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Dept: {searchResult.department}
                </p>
              )}
            </div>
            <button className="btn btn-primary" onClick={() => handleStartChat(searchResult._id)}>
              <MessageSquare size={16} />
              <span>Message</span>
            </button>
          </div>
        )}
      </div>

      {/* Directory List */}
      <div>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
          {['Teachers', 'Students', 'Recent'].map(sec => (
            <button 
              key={sec} 
              className="btn"
              onClick={() => setActiveSection(sec)}
              style={{
                padding: '6px 12px', 
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: activeSection === sec ? 'var(--primary)' : 'var(--bg-tertiary)',
                color: activeSection === sec ? '#ffffff' : 'var(--text-primary)',
                border: activeSection === sec ? 'none' : '1px solid var(--border-color)'
              }}
            >
              {sec}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="card skeleton" style={{ height: '200px' }}></div>
        ) : list.length === 0 ? (
          <div className="card flex-center" style={{ height: '150px', flexDirection: 'column', color: 'var(--text-secondary)' }}>
            <p>No contacts found in this section.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {list.map(contact => (
              <div key={contact._id} className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>{contact.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', textTransform: 'capitalize' }}>
                    {contact.role} {contact.department ? `(${contact.department.code || contact.department.name})` : ''}
                  </p>
                  {contact.year && (
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Year {contact.year} &bull; Section {contact.section}
                    </p>
                  )}
                </div>
                <button className="btn-icon" onClick={() => handleStartChat(contact._id)} title="Send Message">
                  <MessageSquare size={16} color="var(--primary)" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Contacts;
