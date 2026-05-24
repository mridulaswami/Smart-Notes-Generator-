import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import ApiKeyModal from './components/ApiKeyModal';
import InputPanel from './components/InputPanel';
import NotesPanel from './components/NotesPanel';
import EmptyState from './components/EmptyState';

function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('groq_api_key') || '');
  const [showApiModal, setShowApiModal] = useState(!localStorage.getItem('groq_api_key'));
  const [notes, setNotes] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('input'); // 'input' | 'notes'

  const handleApiKeySave = (key) => {
    localStorage.setItem('groq_api_key', key);
    setApiKey(key);
    setShowApiModal(false);
  };

  const handleNotesGenerated = (notesData) => {
    setNotes(notesData);
    setActiveTab('notes');
  };

  return (
    <div className="app">
      {/* Background grid */}
      <div className="app__grid-bg" aria-hidden="true" />
      <div className="app__glow" aria-hidden="true" />

      <Header
        onApiKeyClick={() => setShowApiModal(true)}
        hasApiKey={!!apiKey}
      />

      <main className="app__main">
        <div className="app__tabs">
          <button
            className={`app__tab ${activeTab === 'input' ? 'app__tab--active' : ''}`}
            onClick={() => setActiveTab('input')}
          >
            <span className="app__tab-icon">✦</span> Input
          </button>
          <button
            className={`app__tab ${activeTab === 'notes' ? 'app__tab--active' : ''} ${!notes ? 'app__tab--disabled' : ''}`}
            onClick={() => notes && setActiveTab('notes')}
          >
            <span className="app__tab-icon">◈</span> Generated Notes
            {notes && <span className="app__tab-badge">1</span>}
          </button>
        </div>

        <div className="app__content">
          {activeTab === 'input' && (
            <InputPanel
              apiKey={apiKey}
              onNotesGenerated={handleNotesGenerated}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              onNeedApiKey={() => setShowApiModal(true)}
            />
          )}
          {activeTab === 'notes' && (
            notes
              ? <NotesPanel notes={notes} onReset={() => { setNotes(null); setActiveTab('input'); }} />
              : <EmptyState />
          )}
        </div>
      </main>

      {showApiModal && (
        <ApiKeyModal
          onSave={handleApiKeySave}
          onClose={() => setShowApiModal(false)}
          hasExistingKey={!!apiKey}
          existingKey={apiKey}
        />
      )}
    </div>
  );
}

export default App;
