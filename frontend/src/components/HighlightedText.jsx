import React from 'react';

export default function HighlightedText({ text }) {
  if (!text) return null;
  // Splits by numbers/percentages and keeps the matched string in the array
  const parts = text.split(/(\d[\d,.]*\s?%?)/g);
  
  return (
    <>
      {parts.map((part, i) =>
        /(\d[\d,.]*\s?%?)/.test(part) ? (
          <span key={i} className="num">{part}</span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}