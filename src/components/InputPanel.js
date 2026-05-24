import React, { useState } from 'react';
import './InputPanel.css';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { generateNotes, countWords, estimateReadTime } from '../utils/openai';

const NOTE_STYLES = [
  { id: 'structured', label: 'Structured', icon: '◈', desc: 'Headings, bullets, sections' },
  { id: 'summary', label: 'Summary', icon: '◎', desc: 'Concise overview' },
  { id: 'bullets', label: 'Bullet Points', icon: '≡', desc: 'Quick scan format' },
  { id: 'cornell', label: 'Cornell', icon: '⊞', desc: 'Academic note style' },
];

function InputPanel({ apiKey, onNotesGenerated, isGenerating, setIsGenerating, onNeedApiKey }) {
  const [text, setText] = useState('');
  const [noteStyle, setNoteStyle] = useState('structured');
  const [inputMode, setInputMode] = useState('text'); // 'text' | 'audio'
  const [error, setError] = useState('');

  const {
    transcript,
    interimText,
    isRecording,
    isSupported: isSpeechSupported,
    error: speechError,
    startRecording,
    stopRecording,
    clearTranscript,
  } = useSpeechRecognition();

  const activeText = inputMode === 'audio' ? transcript : text;
  const words = countWords(activeText);
  const readTime = estimateReadTime(activeText);

  const handleGenerate = async () => {
    const input = activeText.trim();
    if (!input) { setError('Please enter or record some text first.'); return; }
    if (words < 20) { setError('Please enter at least 20 words for meaningful notes.'); return; }
    if (!apiKey) { onNeedApiKey(); return; }

    setError('');
    setIsGenerating(true);

    try {
      const notes = await generateNotes(apiKey, input, noteStyle);
      onNotesGenerated(notes);
    } catch (err) {
      setError(err.message || 'Failed to generate notes. Check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    if (inputMode === 'audio') {
      clearTranscript();
    } else {
      setText('');
    }
    setError('');
  };

  const handleUseTranscript = () => {
    setText(transcript);
    setInputMode('text');
  };

  return (
    <div className="input-panel">
      {/* Mode toggle */}
      <div className="input-panel__row">
        <div className="input-panel__mode-toggle">
          <button
            className={`ipm-btn ${inputMode === 'text' ? 'ipm-btn--active' : ''}`}
            onClick={() => setInputMode('text')}
          >
            ✦ Text Input
          </button>
          <button
            className={`ipm-btn ${inputMode === 'audio' ? 'ipm-btn--active' : ''}`}
            onClick={() => setInputMode('audio')}
          >
            ◉ Voice Input
            {!isSpeechSupported && <span className="ipm-unsupported">unavailable</span>}
          </button>
        </div>

        <div className="input-panel__stats">
          {words > 0 && (
            <>
              <span className="stat"><span className="stat__num">{words}</span> words</span>
              <span className="stat__sep">·</span>
              <span className="stat"><span className="stat__num">~{readTime}m</span> read</span>
            </>
          )}
        </div>
      </div>

      {/* Text area */}
      {inputMode === 'text' && (
        <div className="input-panel__text-area-wrap">
          <textarea
            className="input-panel__textarea"
            placeholder="Paste your lecture notes, article, meeting transcript, research paper, or any long-form text here...

The AI will convert it into structured, intelligent notes."
            value={text}
            onChange={(e) => { setText(e.target.value); setError(''); }}
            spellCheck={true}
          />
        </div>
      )}

      {/* Audio input */}
      {inputMode === 'audio' && (
        <div className="input-panel__audio">
          {!isSpeechSupported ? (
            <div className="audio-unsupported">
              <span className="audio-unsupported__icon">⚠</span>
              <p>Web Speech API is not supported in this browser.</p>
              <p className="audio-unsupported__hint">Try Google Chrome for live transcription support.</p>
            </div>
          ) : (
            <>
              <div className="audio-controls">
                <button
                  className={`audio-btn ${isRecording ? 'audio-btn--stop' : 'audio-btn--start'}`}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? (
                    <>
                      <span className="audio-btn__ring" />
                      <span className="audio-btn__dot audio-btn__dot--recording" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <span className="audio-btn__dot" />
                      Start Recording
                    </>
                  )}
                </button>

                {isRecording && (
                  <div className="waveform" aria-label="Recording in progress">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className="waveform__bar"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {speechError && <p className="audio-error">{speechError}</p>}

              <div className="audio-transcript">
                <div className="audio-transcript__header">
                  <span className="audio-transcript__label">
                    {isRecording ? 'Live Transcript' : 'Transcript'}
                  </span>
                  {transcript && (
                    <div className="audio-transcript__actions">
                      <button className="link-btn" onClick={handleUseTranscript}>
                        Use in text editor ↗
                      </button>
                      <button className="link-btn link-btn--danger" onClick={clearTranscript}>
                        Clear
                      </button>
                    </div>
                  )}
                </div>
                <div className="audio-transcript__body">
                  {transcript || interimText ? (
                    <p>
                      {transcript}
                      {interimText && (
                        <span className="interim-text">{interimText}</span>
                      )}
                    </p>
                  ) : (
                    <p className="audio-transcript__placeholder">
                      {isRecording
                        ? 'Speak now — your words will appear here...'
                        : 'Start recording to begin transcription.'}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Note style selector */}
      <div className="input-panel__section">
        <p className="input-panel__section-label">Note Style</p>
        <div className="note-styles">
          {NOTE_STYLES.map((style) => (
            <button
              key={style.id}
              className={`note-style-btn ${noteStyle === style.id ? 'note-style-btn--active' : ''}`}
              onClick={() => setNoteStyle(style.id)}
            >
              <span className="note-style-btn__icon">{style.icon}</span>
              <span className="note-style-btn__label">{style.label}</span>
              <span className="note-style-btn__desc">{style.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="input-panel__error">
          <span>⚠</span> {error}
        </div>
      )}

      {/* Generate button */}
      <div className="input-panel__footer">
        <button
          className="generate-btn"
          onClick={handleGenerate}
          disabled={isGenerating || !activeText.trim()}
        >
          {isGenerating ? (
            <>
              <span className="generate-btn__spinner" />
              Generating Notes...
            </>
          ) : (
            <>
              <span className="generate-btn__icon">✦</span>
              Generate Smart Notes
            </>
          )}
        </button>

        {activeText && (
          <button className="clear-btn" onClick={handleClear} disabled={isGenerating}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default InputPanel;
