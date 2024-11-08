// AppContext.js
import React, { createContext, useContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [rooms, setRooms] = useState([
    { id: 1, roomNumber: 101, patientName: '', doctorId: 1, roomId: 1 },
    { id: 2, roomNumber: 102, patientName: '', doctorId: 2, roomId: 2 },
    { id: 3, roomNumber: 103, patientName: '', doctorId: 3, roomId: 3 },
    { id: 4, roomNumber: 104, patientName: '', doctorId: 4, roomId: 4 },
    // Add more rooms here
  ]);

  const updateRooms = (updatedRooms) => {
    setRooms(updatedRooms);
  };

  return (
    <AppContext.Provider value={{ rooms, updateRooms }}>
      {children}
    </AppContext.Provider>
  );
};
export const useAppContext = () => useContext(AppContext);
