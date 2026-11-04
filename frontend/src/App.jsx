import React, { useState, useEffect } from 'react';
import { STEPS, INITIAL_STATE } from './components/constants';
import "./App.css";

import TopBar from './components/TopBar';
import WelcomeScreen from './components/WelcomeScreen';
import StepScreen from './components/StepScreen';
import RevealScreen from './components/RevealScreen';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';

export default function App() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const [aiState, setAiState] = useState({ api: null, checked: false });

  // Show Privacy Policy when user lands on the page if not yet accepted
  useEffect(() => {
    try {
      const accepted = localStorage.getItem('spotlight_privacy_accepted');
      if (!accepted) {
        setShowPrivacyPolicy(true);
      }
    } catch (e) {
      setShowPrivacyPolicy(true);
    }
  }, []);

  // Initialize hypothetical window.claude API
  useEffect(() => {
    const initSample = async () => {
      try {
        if (window.claude && typeof window.claude.use === 'function') {
          const api = await window.claude.use('sample');
          setAiState({ api, checked: true });
        } else {
          setAiState({ api: null, checked: true });
        }
      } catch (e) {
        setAiState({ api: null, checked: true });
      }
    };
    initSample();
  }, []);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (typeof currentStep === 'number') {
      const isLast = currentStep === STEPS.length - 1;
      setCurrentStep(isLast ? 'reveal' : currentStep + 1);
    }
  };

  const handleBack = () => {
    if (typeof currentStep === 'number') {
      setCurrentStep(currentStep === 0 ? 'welcome' : currentStep - 1);
    }
  };

  const handleStartOver = () => {
    setFormData(INITIAL_STATE);
    setCurrentStep('welcome');
  };

  const handleAcceptPrivacy = () => {
    try {
      localStorage.setItem('spotlight_privacy_accepted', 'true');
    } catch (e) {}
    setShowPrivacyPolicy(false);
  };

  const handleClosePrivacy = () => {
    setShowPrivacyPolicy(false);
  };

  const handleOpenPrivacy = () => {
    setShowPrivacyPolicy(true);
  };

  const handleStart = () => {
    try {
      localStorage.setItem('spotlight_privacy_accepted', 'true');
    } catch (e) {}
    setCurrentStep(0);
  };

  return (
    <div id="app">
      <TopBar currentStep={currentStep} onOpenPrivacy={handleOpenPrivacy} />

      <div className="stage" id="stage">
        {currentStep === 'welcome' && (
          <WelcomeScreen onStart={handleStart} onOpenPrivacy={handleOpenPrivacy} />
        )}

        {typeof currentStep === 'number' && (
          <StepScreen
            step={STEPS[currentStep]}
            isFirst={currentStep === 0}
            isLast={currentStep === STEPS.length - 1}
            formData={formData}
            onChange={handleChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 'reveal' && (
          <RevealScreen
            formData={formData}
            aiApi={aiState.api}
            aiChecked={aiState.checked}
            onEdit={() => setCurrentStep(STEPS.length - 1)}
            onStartOver={handleStartOver}
          />
        )}
      </div>

      <PrivacyPolicyModal 
        isOpen={showPrivacyPolicy}
        onAccept={handleAcceptPrivacy}
        onClose={handleClosePrivacy}
      />
    </div>
  );
}
