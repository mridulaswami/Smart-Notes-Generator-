import React, { useState } from 'react';
import './ApiKeyModal.css';

function ApiKeyModal({ onSave, onClose, hasExistingKey, existingKey }) {
  const [key, setKey] = useState(existingKey || '');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!key.trim()) {
      setError('Please enter your OpenAI API key.');
      return;
    }
    if (!key.trim().startsWith('gsk_')) {
      setError('Groq API key should start with "gsk_".');
      return;
    }
    onSave(key.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="API Key Setup">
        <div className="modal__header">
          <div className="modal__icon">🔑</div>
          <div>
            <h2 className="modal__title">Groq API Key</h2>
            <p className="modal__desc">Free — no credit card needed</p>
          </div>
        </div>

        <div className="modal__body">
          <div className="modal__info">
            <span className="modal__info-icon">ℹ</span>
            <span>Your key is stored locally in your browser. It is sent only to Groq's API — never to any other server. Groq is 100% free with no credit card required.</span>
          </div>

          <label className="modal__label" htmlFor="api-key-input">API Key</label>
          <div className="modal__input-wrap">
            <input
              id="api-key-input"
              type={show ? 'text' : 'password'}
              className="modal__input"
              placeholder="gsk_..."
              value={key}
              onChange={(e) => { setKey(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
            <button
              type="button"
              className="modal__toggle"
              onClick={() => setShow(!show)}
              aria-label={show ? 'Hide key' : 'Show key'}
            >
              {show ? '🙈' : '👁'}
            </button>
          </div>
          {error && <p className="modal__error">{error}</p>}

          <p className="modal__hint">
            Get your free key from{' '}
            <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer">
              console.groq.com/keys
            </a>{' '}— free, no credit card required.
          </p>
        </div>

        <div className="modal__footer">
          {hasExistingKey && (
            <button className="modal__btn modal__btn--ghost" onClick={onClose}>
              Cancel
            </button>
          )}
          <button className="modal__btn modal__btn--primary" onClick={handleSave}>
            {hasExistingKey ? 'Update Key' : 'Save & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyModal;
