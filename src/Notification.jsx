import React, { useEffect, useRef, useState } from 'react';

const audio = new Audio('/src/ding.mp3'); // Create a single audio instance

function Notification({ rooms }) {
  const isMounted = useRef(true);
  const [prevRooms, setPrevRooms] = useState([]);

  useEffect(() => {
    return () => {
      isMounted.current = false; // Clean up on unmount
    };
  }, []);

  const playSound = () => {
    audio.pause(); // Pause any ongoing playback
    audio.currentTime = 0; // Reset the playback position
    audio.play();
  };

  useEffect(() => {
    if (!isMounted.current) {
      // Check if any room transitioned from having no patient to having a patient
      const newPatientAdded = rooms.some(
        (room, index) => room.patientName && !prevRooms[index]?.patientName
      );
      if (newPatientAdded) {
        playSound();
      }
    }
    // Update prevRooms after rooms update
    setPrevRooms(rooms);
    isMounted.current = false; // Set the component as mounted
  }, [rooms, prevRooms]);

  return null; // Notification component doesn't render anything visible
}

export default Notification;
