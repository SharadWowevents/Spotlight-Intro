import React, { useState } from 'react';
import HighlightedText from './HighlightedText';

export default function SuggestionBlock({ step, formData, onSelect }) {
  const [isThinking, setIsThinking] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSuggest = async () => {
    setIsThinking(true);
    setErrorMsg('');
    setSuggestions([]);

    try {
      // Retrieve existing session ID if the user has already interacted
      const sessionId = window.localStorage.getItem('spotlight_session_id') || undefined;

      const response = await fetch('/api/intro/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: step.suggestField, // 'dreamOutcome' or 'bigPromise'
          formData,
          sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      // Save the session ID to link future queries to the same Mongo document
      if (data.sessionId) {
        window.localStorage.setItem('spotlight_session_id', data.sessionId);
      }

      const safeList = Array.isArray(data.suggestions) ? data.suggestions : [];
      setSuggestions(safeList.slice(0, 3));
      
      if (safeList.length === 0) {
        setErrorMsg('No suggestions came back — try again, or write your own.');
      }
    } catch (err) {
      console.error('Suggestion fetch error:', err);
      setErrorMsg('Couldn’t fetch suggestions right now — try again, or write your own.');
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="suggest-row">
      <button 
        className="suggest-btn" 
        onClick={handleSuggest} 
        disabled={isThinking}
      >
        {isThinking ? 'Thinking…' : step.suggestLabel}
      </button>
      
      <div className="chips">
        {suggestions.map((s, idx) => {
          if (typeof s !== 'string' || !s.trim()) return null;
          return (
            <button 
              key={idx} 
              type="button" 
              className="chip" 
              onClick={() => onSelect(s.trim())}
            >
              <HighlightedText text={s.trim()} />
            </button>
          );
        })}
        {errorMsg && <div className="suggest-note">{errorMsg}</div>}
      </div>
    </div>
  );
}