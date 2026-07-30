import React from 'react';
import './LoadingSkeleton.css';

export default function LoadingSkeleton({ type = 'movie', count = 4 }) {
  const renderItems = () => {
    const items = [];
    for (let i = 0; i < count; i++) {
      if (type === 'movie') {
        items.push(
          <div className="skeleton-movie-card" key={i}>
            <div className="skeleton-image pulse" />
            <div className="skeleton-info">
              <div className="skeleton-line title pulse" />
              <div className="skeleton-line subtitle pulse" />
              <div className="skeleton-line button pulse" />
            </div>
          </div>
        );
      } else if (type === 'banner') {
        items.push(
          <div className="skeleton-banner" key={i}>
            <div className="skeleton-banner-content container">
              <div className="skeleton-line badge pulse" />
              <div className="skeleton-line heading pulse" />
              <div className="skeleton-line paragraph pulse" />
              <div className="skeleton-line paragraph pulse" />
              <div className="skeleton-line btn pulse" />
            </div>
          </div>
        );
      }
    }
    return items;
  };

  return <div className={`skeleton-grid ${type}`}>{renderItems()}</div>;
}
