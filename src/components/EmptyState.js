import React from 'react';
import './EmptyState.css';

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state__graphic" aria-hidden="true">
        <div className="empty-state__ring empty-state__ring--1" />
        <div className="empty-state__ring empty-state__ring--2" />
        <div className="empty-state__ring empty-state__ring--3" />
        <div className="empty-state__icon">◈</div>
      </div>
      <h3 className="empty-state__title">No notes generated yet</h3>
      <p className="empty-state__desc">
        Go to the <strong>Input</strong> tab, paste your text or use voice recording,
        then click <strong>Generate Smart Notes</strong>.
      </p>
      <div className="empty-state__steps">
        <div className="empty-step">
          <span className="empty-step__num">01</span>
          <span className="empty-step__text">Paste text or record audio</span>
        </div>
        <div className="empty-step__arrow">→</div>
        <div className="empty-step">
          <span className="empty-step__num">02</span>
          <span className="empty-step__text">Pick a note style</span>
        </div>
        <div className="empty-step__arrow">→</div>
        <div className="empty-step">
          <span className="empty-step__num">03</span>
          <span className="empty-step__text">Export as PDF or copy</span>
        </div>
      </div>
    </div>
  );
}

export default EmptyState;
