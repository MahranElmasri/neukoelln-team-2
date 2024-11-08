import React, { useState, useEffect } from 'react';
import './NewsTicker.css'; // Import the CSS file for styling

const NewsTicker = ({ arabicItems, englishItems, interval = 5000 }) => {
  const [isArabic, setIsArabic] = useState(true); // State to control the language and direction

  useEffect(() => {
    const toggleContent = setInterval(() => {
      setIsArabic((prev) => !prev); // Toggle between Arabic and English content
    }, interval);

    return () => clearInterval(toggleContent); // Cleanup on component unmount
  }, [interval]);

  const items = isArabic ? arabicItems : englishItems; // Select items based on the state
  const direction = isArabic ? 'rtl' : 'ltr'; // Set direction based on the state

  return (
    <div className={`ticker-wrapper ${direction}`}>
      <div className="ticker">
        {items.map((item, index) => (
          <div className="ticker-item" key={index}>
            {typeof item === 'string' ? (
              <span className="ticker-text">{item}</span>
            ) : (
              <img src={item.src} alt={item.alt} className="ticker-image" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
