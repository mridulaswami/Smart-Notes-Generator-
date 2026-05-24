import React, { useState } from 'react';
import './NotesPanel.css';
import { exportToPDF } from '../utils/pdfExport';

function NotesPanel({ notes, onReset }) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const handleCopy = () => {
    const text = buildPlainText(notes);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      exportToPDF(notes);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setTimeout(() => setExporting(false), 1000);
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(notes.title || 'notes').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="notes-panel">
      {/* Top bar */}
      <div className="notes-panel__topbar">
        <div className="notes-panel__meta">
          {notes.wordCount && (
            <span className="meta-chip">
              <span className="meta-chip__icon">◎</span>
              {notes.wordCount} words input
            </span>
          )}
          {notes.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="meta-chip meta-chip--tag">#{tag}</span>
          ))}
        </div>

        <div className="notes-panel__actions">
          <button className="action-btn" onClick={handleCopy} title="Copy as plain text">
            {copied ? '✓ Copied!' : '⎘ Copy'}
          </button>
          <button className="action-btn" onClick={handleExportJSON} title="Export as JSON">
            { } JSON
          </button>
          <button
            className="action-btn action-btn--primary"
            onClick={handleExportPDF}
            disabled={exporting}
            title="Export as PDF"
          >
            {exporting ? (
              <><span className="action-btn__spinner" /> Exporting...</>
            ) : (
              '↓ Export PDF'
            )}
          </button>
          <button className="action-btn action-btn--ghost" onClick={onReset} title="Start over">
            ↺ New
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="notes-panel__title-block">
        <h2 className="notes-panel__title">{notes.title || 'Generated Notes'}</h2>
      </div>

      {/* Summary */}
      {notes.summary && (
        <div className="notes-card notes-card--summary">
          <div className="notes-card__header">
            <span className="notes-card__icon">◎</span>
            <span className="notes-card__heading">Summary</span>
          </div>
          <p className="notes-card__text">{notes.summary}</p>
        </div>
      )}

      {/* Key Points */}
      {notes.keyPoints?.length > 0 && (
        <div className="notes-card notes-card--key-points">
          <div className="notes-card__header">
            <span className="notes-card__icon">✦</span>
            <span className="notes-card__heading">Key Points</span>
            <span className="notes-card__count">{notes.keyPoints.length}</span>
          </div>
          <ul className="key-points-list">
            {notes.keyPoints.map((point, i) => (
              <li key={i} className="key-points-list__item" style={{ animationDelay: `${i * 0.06}s` }}>
                <span className="key-points-list__num">{String(i + 1).padStart(2, '0')}</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sections */}
      {notes.sections?.length > 0 && (
        <div className="notes-sections">
          <div className="notes-card__header" style={{ marginBottom: 12 }}>
            <span className="notes-card__icon">◈</span>
            <span className="notes-card__heading">Detailed Notes</span>
          </div>
          {notes.sections.map((section, i) => (
            <div
              key={i}
              className={`section-card ${activeSection === i ? 'section-card--open' : ''}`}
            >
              <button
                className="section-card__toggle"
                onClick={() => setActiveSection(activeSection === i ? null : i)}
              >
                <span className="section-card__heading">{section.heading}</span>
                <span className="section-card__chevron">{activeSection === i ? '▲' : '▼'}</span>
              </button>

              {activeSection === i && (
                <div className="section-card__body">
                  {section.content && (
                    <p className="section-card__content">{section.content}</p>
                  )}
                  {section.bullets?.length > 0 && (
                    <ul className="section-card__bullets">
                      {section.bullets.map((bullet, j) => (
                        <li key={j} className="section-card__bullet">{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action Items */}
      {notes.actionItems?.length > 0 && (
        <div className="notes-card notes-card--actions">
          <div className="notes-card__header">
            <span className="notes-card__icon">☐</span>
            <span className="notes-card__heading">Action Items</span>
          </div>
          <ul className="action-items-list">
            {notes.actionItems.map((item, i) => (
              <ActionItem key={i} item={item} />
            ))}
          </ul>
        </div>
      )}

      {/* All Tags */}
      {notes.tags?.length > 0 && (
        <div className="notes-panel__tags">
          {notes.tags.map((tag) => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionItem({ item }) {
  const [done, setDone] = useState(false);
  return (
    <li className={`action-item ${done ? 'action-item--done' : ''}`} onClick={() => setDone(!done)}>
      <span className="action-item__check">{done ? '✓' : '☐'}</span>
      <span className="action-item__text">{item}</span>
    </li>
  );
}

function buildPlainText(notes) {
  let out = '';
  if (notes.title) out += `# ${notes.title}\n\n`;
  if (notes.summary) out += `## Summary\n${notes.summary}\n\n`;
  if (notes.keyPoints?.length > 0) {
    out += `## Key Points\n`;
    notes.keyPoints.forEach((p, i) => { out += `${i + 1}. ${p}\n`; });
    out += '\n';
  }
  if (notes.sections?.length > 0) {
    notes.sections.forEach((s) => {
      out += `## ${s.heading}\n`;
      if (s.content) out += `${s.content}\n`;
      if (s.bullets?.length > 0) s.bullets.forEach((b) => { out += `• ${b}\n`; });
      out += '\n';
    });
  }
  if (notes.actionItems?.length > 0) {
    out += `## Action Items\n`;
    notes.actionItems.forEach((a) => { out += `☐ ${a}\n`; });
    out += '\n';
  }
  if (notes.tags?.length > 0) out += `Tags: ${notes.tags.map((t) => `#${t}`).join(' ')}\n`;
  return out;
}

export default NotesPanel;
