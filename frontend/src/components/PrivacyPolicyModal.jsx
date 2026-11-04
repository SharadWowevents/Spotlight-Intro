import React, { useEffect } from 'react';
import { ShieldCheck, X, Lock, CheckCircle2, Bot, Database, UserCheck } from 'lucide-react';

export default function PrivacyPolicyModal({ isOpen, onClose, onAccept }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="privacy-overlay" 
      onClick={onClose}
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="privacy-modal-title"
    >
      <div 
        className="privacy-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="privacy-modal-header">
          <div className="privacy-modal-header-left">
            <div className="privacy-kicker">
              <ShieldCheck size={14} />
              <span>WOWOS · Data & AI Transparency</span>
            </div>
            <h2 id="privacy-modal-title" className="privacy-title">Privacy Policy</h2>
          </div>
          <button 
            type="button" 
            className="privacy-close-btn" 
            onClick={onClose} 
            aria-label="Close Privacy Policy"
          >
            <X size={18} />
          </button>
        </div>

        <div className="privacy-modal-body">
          <div className="privacy-intro-note">
            Welcome to <b>Spotlight Intro</b>. We are committed to protecting your privacy. This policy explains what information we collect, how it is used with AI, and how we keep it safe.
          </div>

          <div className="privacy-section">
            <div className="privacy-section-title">
              <UserCheck size={16} className="privacy-icon-accent" />
              <span>1. Information We Collect</span>
              <span className="badge">Inputs</span>
            </div>
            <p className="privacy-section-desc">
              When creating your introduction, you provide basic professional and business details:
            </p>
            <ul className="privacy-section-list">
              <li><b>Identity:</b> Your full name and designation.</li>
              <li><b>Business Details:</b> Company name, city, and team size.</li>
              <li><b>Pitch Context:</b> Your ideal customer (ICP), dream outcome, and big promise.</li>
            </ul>
          </div>

          <div className="privacy-section">
            <div className="privacy-section-title">
              <Bot size={16} className="privacy-icon-accent" />
              <span>2. AI & Third-Party Processing</span>
              <span className="badge">AI Safety</span>
            </div>
            <p className="privacy-section-desc">
              We use OpenAI API models to suggest numbers/methods and assemble your polished spoken introduction.
            </p>
            <ul className="privacy-section-list">
              <li><b>No Model Training:</b> Your data is transmitted via private API calls and is <b>never</b> used to train public AI models.</li>
              <li><b>No Sale of Data:</b> We never sell, monetize, or share your details with advertisers or data brokers.</li>
            </ul>
          </div>

          <div className="privacy-section">
            <div className="privacy-section-title">
              <Database size={16} className="privacy-icon-accent" />
              <span>3. How We Use & Store Data</span>
              <span className="badge">Storage</span>
            </div>
            <p className="privacy-section-desc">
              Your details are used solely to generate your elevator pitch, suggest compelling business phrasing, and manage your session state during the workshop.
            </p>
            <ul className="privacy-section-list">
              <li>Session data is stored securely in an encrypted database linked to an anonymous session ID.</li>
              <li>Data is retained only to allow you to review, edit, or regenerate your intro.</li>
            </ul>
          </div>

          <div className="privacy-section">
            <div className="privacy-section-title">
              <Lock size={16} className="privacy-icon-accent" />
              <span>4. Your Control & Choices</span>
              <span className="badge">Your Rights</span>
            </div>
            <p className="privacy-section-desc">
              You are always in control of your data. You may choose to use approximate figures or illustrative examples, restart the introduction builder anytime, or request deletion of your session.
            </p>
          </div>

          <div className="privacy-section">
            <div className="privacy-section-title">
              <CheckCircle2 size={16} className="privacy-icon-accent" />
              <span>5. Contact</span>
            </div>
            <p className="privacy-section-desc">
              If you have any questions about this Privacy Policy, please speak with your WOWOS workshop facilitator or contact us at <span className="privacy-contact-email">privacy@wowevents.in</span>.
            </p>
          </div>
        </div>

        <div className="privacy-modal-footer">
          <div className="privacy-modal-actions">
            <button 
              type="button" 
              className="btn btn-ghost" 
              onClick={onClose}
            >
              Close
            </button>
            <button 
              type="button" 
              className="btn btn-primary btn-wide" 
              onClick={onAccept}
            >
              Accept & Continue →
            </button>
          </div>
          <div className="privacy-modal-disclaimer">
            By clicking "Accept & Continue", you confirm that you have reviewed and agree to the Spotlight Intro Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}

