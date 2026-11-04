import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { STEPS } from './constants';

export default function TopBar({ currentStep, onOpenPrivacy }) {
  const isNumber = typeof currentStep === 'number';
  const isReveal = currentStep === 'reveal';
  
  let stepText = '';
  let progress = 0;

  if (isNumber) {
    stepText = `0${currentStep + 1} / 0${STEPS.length}`.slice(-7);
    progress = ((currentStep + 1) / STEPS.length) * 100;
  } else if (isReveal) {
    stepText = 'DONE';
    progress = 100;
  }

  return (
    <>
      <div className="topbar">
        <span className="brand">WOWOS · Fast Track</span>
        <div className="topbar-actions">
          {currentStep === 'welcome' && onOpenPrivacy && (
            <button 
              type="button" 
              className="privacy-top-btn" 
              onClick={onOpenPrivacy}
              title="Read Privacy Policy"
            >
              <ShieldCheck size={12} />
              <span>Privacy Policy</span>
            </button>
          )}
          {stepText && <span className="stepcount">{stepText}</span>}
        </div>
      </div>
      <div className="progress">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
    </>
  );
}
