import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Send, Clock, Loader2 } from 'lucide-react';
import api from '../api/axios';

const VoiceRecorder = ({ onSend, onSchedule }) => {
  const [status, setStatus] = useState('idle'); // idle, recording, paused, stopped
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const audioPreviewRef = useRef(null);

  // Timer runner
  useEffect(() => {
    if (status === 'recording') {
      timerIntervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [status]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const options = { mimeType: 'audio/webm' };
      let recorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (e) {
        // Fallback if audio/webm is not supported
        recorder = new MediaRecorder(stream);
      }

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setStatus('stopped');
        
        // Stop all audio tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250); // Get chunks every 250ms
      setDuration(0);
      setStatus('recording');
    } catch (err) {
      console.error('Failed to start voice recording:', err);
      alert('Microphone access is required to record voice messages.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.pause();
      setStatus('paused');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && status === 'paused') {
      mediaRecorderRef.current.resume();
      setStatus('recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && (status === 'recording' || status === 'paused')) {
      mediaRecorderRef.current.stop();
    }
  };

  const deleteRecording = () => {
    setStatus('idle');
    setDuration(0);
    setAudioUrl('');
    setAudioBlob(null);
    setPreviewPlaying(false);
  };

  const uploadAudio = async () => {
    if (!audioBlob) return null;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('voice', audioBlob, 'voice-note.webm');
      
      const res = await api.post('/api/voice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data.mediaUrl;
    } catch (err) {
      console.error('Failed to upload audio:', err);
      alert('Failed to upload voice recording. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSend = async () => {
    const mediaUrl = await uploadAudio();
    if (mediaUrl) {
      onSend({ mediaUrl, duration });
      deleteRecording();
    }
  };

  const handleSchedule = async () => {
    const mediaUrl = await uploadAudio();
    if (mediaUrl) {
      onSchedule({ mediaUrl, duration });
      deleteRecording();
    }
  };

  const togglePreview = () => {
    if (!audioPreviewRef.current) return;
    
    if (previewPlaying) {
      audioPreviewRef.current.pause();
      setPreviewPlaying(false);
    } else {
      audioPreviewRef.current.play();
      setPreviewPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setPreviewPlaying(false);
  };

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 16px',
      background: 'var(--bg-tertiary)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      width: '100%'
    }}>
      {status === 'idle' && (
        <button 
          onClick={startRecording} 
          className="btn btn-secondary flex-center"
          style={{ gap: '8px', width: '100%' }}
        >
          <Mic size={18} color="var(--primary)" />
          <span>Record Voice Message</span>
        </button>
      )}

      {status === 'recording' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontWeight: 600 }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--danger)',
              animation: 'pulse 1s infinite alternate'
            }}></span>
            Recording ({formatTime(duration)})
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button className="btn-icon" onClick={pauseRecording} title="Pause"><Pause size={16} /></button>
            <button className="btn-icon" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }} onClick={stopRecording} title="Stop"><Square size={16} /></button>
          </div>
        </div>
      )}

      {status === 'paused' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
            Paused ({formatTime(duration)})
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button className="btn-icon" onClick={resumeRecording} title="Resume"><Mic size={16} color="var(--primary)" /></button>
            <button className="btn-icon" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }} onClick={stopRecording} title="Stop"><Square size={16} /></button>
          </div>
        </div>
      )}

      {status === 'stopped' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
          <button className="btn-icon" onClick={togglePreview}>
            {previewPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <audio ref={audioPreviewRef} src={audioUrl} onEnded={handleAudioEnded} style={{ display: 'none' }} />
          
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Preview Note ({formatTime(duration)})
          </span>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={deleteRecording} disabled={isUploading}>
              <Trash2 size={16} />
            </button>
            
            {onSchedule && (
              <button className="btn btn-secondary" onClick={handleSchedule} disabled={isUploading} style={{ padding: '8px 12px' }}>
                <Clock size={16} />
                <span>Schedule</span>
              </button>
            )}

            <button className="btn btn-primary" onClick={handleSend} disabled={isUploading} style={{ padding: '8px 12px' }}>
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              <span>Send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
