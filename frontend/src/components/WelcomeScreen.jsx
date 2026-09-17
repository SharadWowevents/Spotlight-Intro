import React from 'react';

export default function WelcomeScreen({ onStart }) {
  return (
    <div className="welcome">
      <div className="kicker">Introduction Builder</div>
      <h1>Build your<br /><span>Spotlight</span> intro</h1>
      <p>Five quick questions, then a tight, sayable-in-one-breath introduction — built around real numbers, not filler.</p>
      <div className="template">
        I am <b>[Name]</b>, <b>[Designation]</b> of <b>[Company]</b>, <b>[City]</b>, with a team of <b>[Size]</b>.<br />
        We help <b>[ICP]</b> <b>[Dream Outcome]</b> by <b>[Big Promise]</b>.
      </div>
      <div className="navbar">
        <button className="btn btn-primary btn-wide" onClick={onStart}>
          Start →
        </button>
      </div>
    </div>
  );
}