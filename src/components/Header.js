import React from 'react';
import './Header.css';

function Header({ onApiKeyClick, hasApiKey }) {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          <div className="header__logo" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.9"/>
              <rect x="16" y="2" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.5"/>
              <rect x="2" y="16" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.5"/>
              <rect x="16" y="16" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.9"/>
              <circle cx="14" cy="14" r="3" fill="var(--accent-warm)"/>
            </svg>
          </div>
          <div>
            <h1 className="header__title">Smart Notes</h1>
            <p className="header__subtitle">AI-Powered Generator</p>
          </div>
        </div>

        <nav className="header__nav">
          <a
            href="https://console.groq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="header__link"
          >
            Groq Console
          </a>
          <button
            className={`header__api-btn ${hasApiKey ? 'header__api-btn--connected' : ''}`}
            onClick={onApiKeyClick}
          >
            <span className={`header__api-dot ${hasApiKey ? 'header__api-dot--on' : 'header__api-dot--off'}`} />
            {hasApiKey ? 'API Connected' : 'Set API Key'}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
