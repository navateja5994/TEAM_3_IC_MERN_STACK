import React from 'react';
import './LanguageFilter.css';

export default function LanguageFilter({ activeLanguage, onSelectLanguage }) {
  const languages = [
    "All Movies",
    "Telugu",
    "Tamil",
    "Hindi",
    "English",
    "Kannada",
    "Malayalam"
  ];

  return (
    <div className="language-filter-container">
      <div className="language-filter-scroll">
        {languages.map((lang) => (
          <button
            key={lang}
            className={`lang-pill ${activeLanguage === lang ? 'active' : ''}`}
            onClick={() => onSelectLanguage(lang)}
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  );
}
