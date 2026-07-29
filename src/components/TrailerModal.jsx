import React from 'react';
import { X } from 'lucide-react';

const TrailerModal = ({ trailerUrl, onClose }) => {
  if (!trailerUrl) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '850px', background: '#000000', padding: 0, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="video-container">
          <iframe
            src={trailerUrl}
            title="Movie Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
