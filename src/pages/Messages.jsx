import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../api/axios';
import VoiceRecorder from '../components/VoiceRecorder';
import { 
  Send, 
  Clock, 
  User as UserIcon, 
  Check, 
  CheckCheck,
  CheckSquare,
  AlertTriangle,
  Info,
  Calendar,
  X
} from 'lucide-react';

const Messages = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [acknowledgements, setAcknowledgements] = useState([]);
  const [inputText, setInputText] = useState('');
  
  // Tracking online status
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  
  // Scheduling States
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [requireAck, setRequireAck] = useState(false);

  // Stats Modal
  const [selectedMsgForStats, setSelectedMsgForStats] = useState(null);
  const [ackStats, setAckStats] = useState(null);

  // Typing state
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState({}); // { conversationId: [userNames] }

  const historyEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom helper
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch conversations list on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/api/conversations');
      setConversations(res.data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  // Fetch online users list on mount
  useEffect(() => {
    const fetchOnline = async () => {
      try {
        const res = await api.get('/api/users/online');
        setOnlineUserIds(res.data || []);
      } catch (err) {
        console.error('Failed to load online user list:', err);
      }
    };
    if (user) {
      fetchOnline();
    }
  }, [user]);

  // Handle location state redirect auto-selection
  useEffect(() => {
    if (location.state?.selectConversationId && conversations.length > 0) {
      const found = conversations.find(c => c._id === location.state.selectConversationId);
      if (found) {
        setActiveConv(found);
        // Clear history state to avoid selecting again on route changes
        window.history.replaceState({}, document.title);
      }
    }
  }, [conversations, location.state]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv._id);
    }
  }, [activeConv]);

  const fetchMessages = async (convId) => {
    try {
      const res = await api.get(`/api/messages/conversation/${convId}`);
      setMessages(res.data.messages || []);
      setReceipts(res.data.receipts || []);
      setAcknowledgements(res.data.acknowledgements || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  // Setup Socket Listeners
  useEffect(() => {
    if (socket) {
      const handleNewMessage = (data) => {
        // Refresh conversations list to update lastMessage
        fetchConversations();
        
        // If message is in the currently active conversation, append it
        if (activeConv && data.conversationId === activeConv._id) {
          setMessages(prev => [...prev, data.message]);
          // Auto send read receipt if received
          if (data.message.senderId && data.message.senderId._id !== user._id) {
            api.get(`/api/messages/conversation/${activeConv._id}`); // This marks messages as read
          }
        }
      };

      const handleMessagesRead = (data) => {
        if (activeConv && data.conversationId === activeConv._id) {
          // Re-fetch receipts
          fetchMessages(activeConv._id);
        }
      };

      const handleMessageAck = (data) => {
        if (activeConv) {
          setAcknowledgements(prev => [
            ...prev.filter(a => !(a.messageId === data.messageId && a.userId === data.userId)),
            { messageId: data.messageId, userId: data.userId, acknowledgedAt: data.acknowledgedAt }
          ]);
        }
      };

      const handleTyping = (data) => {
        if (data.conversationId) {
          setTypingUsers(prev => {
            const list = prev[data.conversationId] || [];
            if (data.isTyping) {
              // Add username or fetch name
              return { ...prev, [data.conversationId]: [...new Set([...list, 'Someone'])] };
            } else {
              return { ...prev, [data.conversationId]: list.filter(u => u !== 'Someone') };
            }
          });
        }
      };

      const handleUserStatus = (data) => {
        if (data.status === 'online') {
          setOnlineUserIds(prev => [...new Set([...prev, data.userId])]);
        } else {
          setOnlineUserIds(prev => prev.filter(id => id !== data.userId));
        }
      };

      const handleDetailsShared = (data) => {
        if (activeConv && data.conversationId === activeConv._id) {
          // Re-fetch conversation details to refresh masking
          api.get(`/api/conversations/${activeConv._id}`).then(res => {
            setActiveConv(res.data);
          });
        }
      };

      socket.on('new_message', handleNewMessage);
      socket.on('messages_read', handleMessagesRead);
      socket.on('message_acknowledged', handleMessageAck);
      socket.on('typing', handleTyping);
      socket.on('user_status', handleUserStatus);
      socket.on('details_shared', handleDetailsShared);

      return () => {
        socket.off('new_message', handleNewMessage);
        socket.off('messages_read', handleMessagesRead);
        socket.off('message_acknowledged', handleMessageAck);
        socket.off('typing', handleTyping);
        socket.off('user_status', handleUserStatus);
        socket.off('details_shared', handleDetailsShared);
      };
    }
  }, [socket, activeConv, user]);

  // Handle typing triggers
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    
    if (socket && activeConv) {
      if (!isTyping) {
        setIsTyping(true);
        socket.emit('typing', { conversationId: activeConv._id, isTyping: true });
      }

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit('typing', { conversationId: activeConv._id, isTyping: false });
      }, 2000);
    }
  };

  const handleShareDetails = async () => {
    try {
      await api.post(`/api/conversations/${activeConv._id}/share-details`);
      const res = await api.get(`/api/conversations/${activeConv._id}`);
      setActiveConv(res.data);
      alert('You have shared your contact details in this chat.');
      fetchConversations();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to share contact details.');
    }
  };

  const handleBlockUser = async () => {
    const otherUser = activeConv.participants.find(p => p._id !== user._id);
    if (!otherUser) return;
    if (!window.confirm(`Are you sure you want to block ${otherUser.name}?`)) return;

    try {
      await api.post('/api/users/block', { blockedUserId: otherUser._id });
      alert(`${otherUser.name} has been blocked.`);
      setActiveConv(null);
      fetchConversations();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to block user.');
    }
  };

  const handleReportUser = async () => {
    const otherUser = activeConv.participants.find(p => p._id !== user._id);
    if (!otherUser) return;
    const reasonText = window.prompt(`Enter reason for reporting ${otherUser.name}:`);
    if (!reasonText) return;

    try {
      await api.post('/api/users/report', { reportedUserId: otherUser._id, reason: reasonText });
      alert(`Report submitted successfully.`);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to report user.');
    }
  };

  // Send message NOW
  const handleSend = async (voicePayload = null) => {
    if (!inputText.trim() && !voicePayload) return;

    try {
      let payload = {};
      if (voicePayload) {
        payload = {
          conversationId: activeConv._id,
          messageType: 'voice',
          mediaUrl: voicePayload.mediaUrl,
          voiceDuration: voicePayload.duration,
          requireAcknowledgement: requireAck
        };
      } else {
        payload = {
          conversationId: activeConv._id,
          messageType: 'text',
          text: inputText,
          requireAcknowledgement: requireAck
        };
      }

      const res = await api.post('/api/messages', payload);
      setMessages(prev => [...prev, res.data]);
      setInputText('');
      setRequireAck(false);
      fetchConversations();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send message.');
    }
  };

  // Schedule message for LATER
  const handleScheduleMessage = async (voicePayload = null) => {
    if (!scheduleDate || !scheduleTime) {
      alert('Please select both date and time to schedule.');
      return;
    }

    // Convert local selection to Date object
    const targetLocal = new Date(`${scheduleDate}T${scheduleTime}`);
    if (targetLocal <= new Date()) {
      alert('Scheduled time must be in the future.');
      return;
    }

    try {
      let payload = {
        conversationId: activeConv._id,
        scheduledAt: targetLocal.toISOString(),
        requireAcknowledgement: requireAck
      };

      if (voicePayload) {
        payload.messageType = 'voice';
        payload.mediaUrl = voicePayload.mediaUrl;
        payload.voiceDuration = voicePayload.duration;
      } else {
        payload.messageType = 'text';
        payload.text = inputText;
      }

      await api.post('/api/scheduled', payload);
      alert('Message scheduled successfully.');
      
      setInputText('');
      setScheduleDate('');
      setScheduleTime('');
      setIsScheduling(false);
      setRequireAck(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to schedule message.');
    }
  };

  // Acknowledge received message
  const handleAcknowledge = async (messageId) => {
    try {
      const res = await api.post(`/api/messages/acknowledge/${messageId}`);
      setAcknowledgements(prev => [...prev, { messageId, userId: user._id, acknowledgedAt: res.data.acknowledgement.acknowledgedAt }]);
    } catch (err) {
      console.error('Failed to acknowledge message:', err);
    }
  };

  // Fetch acknowledgement stats
  const fetchAckStats = async (msgId) => {
    try {
      const res = await api.get(`/api/messages/acknowledgements/${msgId}`);
      setAckStats(res.data);
      setSelectedMsgForStats(msgId);
    } catch (err) {
      console.error(err);
    }
  };

  // Helpers to resolve metadata
  const getChatDisplayName = (conv) => {
    if (conv.isGroup) return conv.groupId.name;
    const recipient = conv.participants.find(p => p._id !== user?._id);
    return recipient ? recipient.name : 'Unknown User';
  };

  const getChatSubText = (conv) => {
    if (typingUsers[conv._id]?.length > 0) {
      return <span style={{ color: 'var(--success)', fontWeight: 600 }}>Typing...</span>;
    }
    return conv.lastMessage ? conv.lastMessage.text : 'No messages yet';
  };

  const isMessageAcknowledged = (msgId) => {
    return acknowledgements.some(a => a.messageId === msgId && a.userId === user._id);
  };

  const countAcks = (msgId) => {
    return acknowledgements.filter(a => a.messageId === msgId).length;
  };

  const otherParticipant = activeConv && !activeConv.isGroup 
    ? activeConv.participants.find(p => p._id !== user._id) 
    : null;
  const isOnline = otherParticipant && onlineUserIds.includes(otherParticipant._id);

  return (
    <div className="chat-container fade-in" style={{ height: 'calc(100vh - 130px)' }}>
      {/* Sidebar - Chats List */}
      <div className="chat-sidebar">
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.1rem' }}>My Conversations</h3>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '24px' }}>
              No chats active. Search a contact to message.
            </p>
          ) : (
            conversations.map(conv => (
              <div 
                key={conv._id} 
                className={`sidebar-item ${activeConv?._id === conv._id ? 'active' : ''}`}
                style={{ borderRadius: 0, borderBottom: '1px solid var(--border-color)', padding: '16px' }}
                onClick={() => setActiveConv(conv)}
              >
                <div className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, position: 'relative' }}>
                  {conv.isGroup && conv.groupId.groupImage ? (
                    <img src={conv.groupId.groupImage} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <UserIcon size={18} />
                  )}
                  {!conv.isGroup && (
                    (() => {
                      const partner = conv.participants.find(p => p._id !== user._id);
                      const isPartnerOnline = partner && onlineUserIds.includes(partner._id);
                      return isPartnerOnline ? (
                        <span style={{
                          position: 'absolute',
                          bottom: '0',
                          right: '0',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: 'var(--success)',
                          border: '2px solid var(--bg-secondary)'
                        }}></span>
                      ) : null;
                    })()
                  )}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{getChatDisplayName(conv)}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {conv.lastMessage ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: '2px' }}>
                    {getChatSubText(conv)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Room Window */}
      <div className="chat-room">
        {activeConv ? (
          <>
            {/* Header */}
            <div className="navbar glass" style={{ borderBottom: '1px solid var(--border-color)', height: '60px', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="flex-center" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, position: 'relative' }}>
                  <UserIcon size={16} />
                  {isOnline && (
                    <span style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: 'var(--success)',
                      border: '2px solid var(--bg-secondary)'
                    }}></span>
                  )}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{getChatDisplayName(activeConv)}</h4>
                  {typingUsers[activeConv._id]?.length > 0 ? (
                    <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>typing...</span>
                  ) : activeConv.isGroup ? (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Class Channel</span>
                  ) : (
                    <span style={{ fontSize: '0.7rem', color: isOnline ? 'var(--success)' : 'var(--text-muted)', fontWeight: isOnline ? 600 : 400 }}>
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              {!activeConv.isGroup && otherParticipant && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  {!activeConv.iHaveShared ? (
                    <button 
                      className="btn btn-secondary" 
                      onClick={handleShareDetails}
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      Share Info
                    </button>
                  ) : (
                    <span className="badge badge-success" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', height: '28px', padding: '0 8px', borderRadius: '4px', background: 'var(--success-light)', color: 'var(--success)', border: '1px solid var(--success)' }}>
                      Info Shared
                    </span>
                  )}

                  <button 
                    className="btn btn-danger" 
                    onClick={handleBlockUser}
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  >
                    Block
                  </button>

                  <button 
                    className="btn btn-secondary" 
                    onClick={handleReportUser}
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  >
                    Report
                  </button>
                </div>
              )}
            </div>

            {/* Messages Body */}
            <div className="chat-history">
              {!activeConv.isGroup && otherParticipant && (
                <div style={{
                  margin: '10px 20px 15px 20px',
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div>
                    <strong>Contact Details:</strong>{' '}
                    <span>Phone: {otherParticipant.phoneNumber}</span> &bull;{' '}
                    <span>Email: {otherParticipant.email || 'None'}</span>
                  </div>
                  {!activeConv.partnerHasShared && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      (Details are masked. Share contact info to request unmasking.)
                    </span>
                  )}
                </div>
              )}
              {messages.length === 0 ? (
                <div className="flex-center" style={{ height: '100%', flexDirection: 'column', color: 'var(--text-muted)' }}>
                  <span>✉</span>
                  <p>Send a message to start the conversation.</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isSentByMe = msg.senderId?._id === user?._id;
                  
                  // Resolve delivery / read states
                  const msgReceipts = receipts.filter(r => r.messageId === msg._id);
                  const isRead = msgReceipts.length > 0 && msgReceipts.every(r => r.status === 'read');
                  const isDelivered = msgReceipts.length > 0;

                  return (
                    <div 
                      key={msg._id || index}
                      className={`chat-bubble ${isSentByMe ? 'sent' : 'received'}`}
                    >
                      {activeConv.isGroup && !isSentByMe && msg.senderId && (
                        <span className="chat-bubble-sender">{msg.senderId.name}</span>
                      )}

                      {/* Message Content */}
                      {msg.messageType === 'voice' ? (
                        <div className="voice-message-player">
                          <audio src={msg.mediaUrl} controls style={{ maxWidth: '240px', height: '36px' }} />
                        </div>
                      ) : (
                        <p>{msg.text}</p>
                      )}

                      {/* Important Acknowledgements Badge */}
                      {msg.requireAcknowledgement && (
                        <div style={{
                          marginTop: '8px',
                          padding: '8px',
                          background: isSentByMe ? 'rgba(255,255,255,0.1)' : 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid ' + (isSentByMe ? 'rgba(255,255,255,0.2)' : 'var(--border-color)'),
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                            <AlertTriangle size={14} color="#f59e0b" />
                            <span>Important Announcement</span>
                          </div>
                          
                          {isSentByMe ? (
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', gap: '4px' }}
                              onClick={() => fetchAckStats(msg._id)}
                            >
                              <Info size={12} />
                              <span>{countAcks(msg._id)} Acknowledged</span>
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary"
                              disabled={isMessageAcknowledged(msg._id)}
                              onClick={() => handleAcknowledge(msg._id)}
                              style={{ padding: '6px 12px', fontSize: '0.75rem', background: isMessageAcknowledged(msg._id) ? 'var(--success)' : 'var(--primary)' }}
                            >
                              {isMessageAcknowledged(msg._id) ? 'Acknowledged ✓' : 'Acknowledge Received'}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Meta information */}
                      <div className="chat-meta">
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isSentByMe && (
                          <span>
                            {isRead ? <CheckCheck size={14} color="#34d399" /> : isDelivered ? <CheckCheck size={14} /> : <Check size={14} />}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={historyEndRef} />
            </div>

            {/* Message Controls Form */}
            <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {isScheduling && (
                <div style={{
                  padding: '12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} />
                    <span>Schedule Message</span>
                  </span>
                  
                  <input 
                    type="date" 
                    className="input-field" 
                    style={{ width: '150px', padding: '6px' }}
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                  <input 
                    type="time" 
                    className="input-field" 
                    style={{ width: '120px', padding: '6px' }}
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />

                  <button className="btn-icon" onClick={() => setIsScheduling(false)} style={{ width: '32px', height: '32px', marginLeft: 'auto' }}>
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Text / Input box */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder={isScheduling ? "Type scheduled message..." : "Type a message..."}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && !isScheduling && handleSend()}
                />

                {/* Important Tag trigger */}
                {user?.role === 'teacher' && (
                  <button 
                    className="btn-icon" 
                    title="Require Acknowledgement" 
                    onClick={() => setRequireAck(!requireAck)}
                    style={{ background: requireAck ? 'var(--warning-light)' : 'var(--bg-tertiary)', color: requireAck ? 'var(--warning)' : 'var(--text-primary)' }}
                  >
                    <CheckSquare size={18} />
                  </button>
                )}

                {/* Schedule clock trigger */}
                <button 
                  className="btn-icon" 
                  title="Schedule Message"
                  onClick={() => setIsScheduling(!isScheduling)}
                  style={{ background: isScheduling ? 'var(--primary-light)' : 'var(--bg-tertiary)', color: isScheduling ? 'var(--primary)' : 'var(--text-primary)' }}
                >
                  <Clock size={18} />
                </button>

                {isScheduling ? (
                  <button className="btn btn-primary" onClick={() => handleScheduleMessage()} style={{ padding: '12px' }}>
                    <Calendar size={18} />
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={() => handleSend()} style={{ padding: '12px' }} disabled={!inputText.trim()}>
                    <Send size={18} />
                  </button>
                )}
              </div>

              {/* Voice Recorder Widgets */}
              <VoiceRecorder 
                onSend={(voice) => handleSend(voice)}
                onSchedule={isScheduling ? (voice) => handleScheduleMessage(voice) : null}
              />
            </div>
          </>
        ) : (
          <div className="flex-center" style={{ height: '100%', flexDirection: 'column', color: 'var(--text-secondary)', gap: '16px' }}>
            <span style={{ fontSize: '3rem' }}>💬</span>
            <h3>Select a Conversation</h3>
            <p>Pick an active contact or group chat to begin communicating.</p>
          </div>
        )}
      </div>

      {/* Acknowledgment Stats Modal */}
      {selectedMsgForStats && ackStats && (
        <div className="modal-overlay" onClick={() => setSelectedMsgForStats(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Acknowledgement Stats</h3>
              <button className="btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => setSelectedMsgForStats(null)}>
                <X size={14} />
              </button>
            </div>
            
            <p style={{ fontSize: '1.25rem', fontWeight: 700, textAlign: 'center', color: 'var(--primary)', margin: '12px 0' }}>
              {ackStats.acknowledgedCount} / {ackStats.totalRecipients} Acknowledged
            </p>

            <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              {ackStats.acknowledgedUsers.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>No receipts recorded yet.</p>
              ) : (
                ackStats.acknowledgedUsers.map(u => (
                  <div key={u.userId} style={{ display: 'flex', justify: 'space-between', fontSize: '0.85rem', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span>{u.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {new Date(u.acknowledgedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Messages;
