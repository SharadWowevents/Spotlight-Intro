import React from 'react';
import { STEPS } from './constants';

export default function TopBar({ currentStep }) {
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
        <span className="brand">WOW OS · FastTrack</span>
        <span className="stepcount">{stepText}</span>
      </div>
      <div className="progress">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
    </>
  );
}