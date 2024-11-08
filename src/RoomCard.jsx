import React, { useState, useEffect } from 'react';

function RoomCard({ room }) {
  const patientName = room.patientName || '';
  const [cardHeight, setCardHeight] = useState(getInitialCardHeight());
  const [fontSize, setFontSize] = useState('text-8xl');

  // Set the initial card height based on the screen size and number of rows
  function getInitialCardHeight() {
    const numRows = 9; // Number of rows to display
    return window.innerHeight / numRows;
  }

  // Calculate the font size based on the length of the patient name and card height
  function calculateFontSize(nameLength, height) {
    let fontSize = '';
    if (height < 50) {
      fontSize = 'text-3xl';
    } else if (height < 80) {
      fontSize = 'text-5xl';
    } else if (height < 100) {
      fontSize = 'text-7xl';
    } else if (height < 121) {
      fontSize = 'text-9xl';
    } else {
      fontSize = 'text-15xl';
    }
    if (nameLength > 5) {
      fontSize = 'text-xl';
    }
    return fontSize;
  }

  // Update the card height and font size when the window is resized
  useEffect(() => {
    function updateDimensions() {
      const height = getInitialCardHeight();
      setCardHeight(height);
      setFontSize(calculateFontSize(patientName.length, height));
    }
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('load', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('load', updateDimensions);
    };
  }, []);

  return (
    <div
      className={`flex flex-col md:flex-row w-full md:h-auto mx-4 ${
        room.patientName ? 'bg-sky-600 animate-blinkingBg' : 'bg-sky-900'
      }`}
      style={{ height: cardHeight }} // Set the card height dynamically
    >
      <div
        className={`${
          room.patientName ? 'bg-red-600 animate-blinkingBg' : ' bg-cyan-600'
        } flex justify-center items-center md:w-1/3 font-extrabold px-10`}
      >
        <h2
          className={`w-[150px] ${room.roomId > 6 ? 'text-6xl' : 'text-8xl'}`}
        >
          {room.id === 7 ? 'Lab' : room.id === 8 ? 'Anm' : `${room.id}`}
        </h2>
      </div>
      <div className="flex justify-center items-center w-full md:w-3/4 tracking-wider font-extrabold overflow-hidden whitespace-nowrap">
        <h2 className={patientName.length > 3 ? 'text-5xl' : 'text-9xl'}>
          {patientName}
        </h2>
      </div>
    </div>
  );
}

export default RoomCard;
