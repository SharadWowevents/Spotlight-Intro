import React, { useState, useEffect } from 'react';
import { assembleFallback } from './utils';
import HighlightedText from './HighlightedText';

export default function RevealScreen({ formData, onEdit, onStartOver }) {
  const [busy, setBusy] = useState(true);
  const [result, setResult] = useState({ full: '', short: '', source: '' });
  const [revealError, setRevealError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const runReveal = async () => {
    setBusy(true);
    setRevealError('');

    try {
      const sessionId = window.localStorage.getItem('spotlight_session_id') || undefined;

      // Pointing directly to your local Express server
      const response = await fetch('/api/intro/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, sessionId })
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      if (data.sessionId) window.localStorage.setItem('spotlight_session_id', data.sessionId);

      if (data && typeof data.full === 'string' && data.full.trim()) {
        setResult({
          full: data.full.trim(),
          short: (typeof data.short === 'string' && data.short.trim()) ? data.short.trim() : assembleFallback(formData).short,
          source: data.source || 'ai'
        });
      } else {
        setResult(assembleFallback(formData));
      }
    } catch (error) {
      console.error('Generation fetch error:', error);
      setResult(assembleFallback(formData));
      setRevealError('Used your exact words — AI polish wasn’t available just now.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    runReveal();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.full).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1600);
    }).catch(() => alert('Failed to copy to clipboard'));
  };

  return (
    <>
      <div className="reveal">
        <div className="reveal-body">
          {busy ? (
            <div className="reveal-loading"><span className="dot-pulse"></span> Crafting your intro…</div>
          ) : (
            <>
              <div className="full-line"><HighlightedText text={result.full} /></div>
              <div className="short-wrap">
                <div className="short-label">10-second version</div>
                <div className="short-line"><HighlightedText text={result.short} /></div>
              </div>
              {revealError && <div className="fallback-note">{revealError}</div>}
            </>
          )}
        </div>

        <div className="navbar">
          <button className="btn btn-ghost" onClick={onEdit}>← Edit</button>
          {!busy && result.full && (
            <>
              {result.source === 'ai' && (
                <button className="btn btn-ghost" onClick={runReveal}>↻ Regenerate</button>
              )}
              <button className="btn btn-primary" onClick={handleCopy}>Copy</button>
            </>
          )}
        </div>

        {!busy && result.full && (
          <button className="btn btn-ghost" style={{ marginTop: '-4px' }} onClick={onStartOver}>
            Start over with someone new
          </button>
        )}
      </div>
      <div className={`toast ${showToast ? 'show' : ''}`}>Copied to clipboard</div>
    </>
  );
}