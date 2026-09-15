import React from 'react';
import SuggestionBlock from './SuggestionBlock';

export default function StepScreen({ 
  step, 
  isLast, 
  formData, 
  onChange, 
  onNext, 
  onBack 
}) {
  const isValid = step.fields.every((f) => (formData[f.key] || '').trim().length > 0);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isValid) {
      // Allow multi-line in textareas, prevent in inputs
      if (e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        onNext();
      }
    }
  };

  return (
    <div className="screen">
      <div>
        <div className="kicker">{step.kicker}</div>
        <div className="question">{step.question}</div>
      </div>

      <div className="field-group">
        {step.fields.map((f) => (
          <div className="field" key={f.key}>
            <label htmlFor={`field-${f.key}`}>{f.label}</label>
            {f.textarea ? (
              <textarea
                id={`field-${f.key}`}
                placeholder={f.placeholder}
                value={formData[f.key]}
                onChange={(e) => onChange(f.key, e.target.value)}
              />
            ) : (
              <input
                id={`field-${f.key}`}
                type="text"
                placeholder={f.placeholder}
                value={formData[f.key]}
                onChange={(e) => onChange(f.key, e.target.value)}
                onKeyDown={handleKeyDown}
              />
            )}
          </div>
        ))}
      </div>

      {step.hint && <div className="hint">{step.hint}</div>}

      {step.suggestField && (
        <SuggestionBlock 
          key={step.id} /* THIS FIXES THE BUG: Forces a fresh block on step change */
          step={step} 
          formData={formData} 
          onSelect={(val) => onChange(step.suggestField, val)} 
        />
      )}

      <div style={{ flex: 1 }}></div>

      <div className="navbar">
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" disabled={!isValid} onClick={onNext}>
          {isLast ? 'Generate my intro →' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}