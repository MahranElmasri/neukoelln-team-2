import { createContext, useContext, useReducer } from 'react';

export const RoomContext = createContext({});

export const roomContext = (state, action) => {
  switch (action.type) {
    case 'UPDATE_ROOMS':
      return { ...state, rooms: action.payload };
    default:
      return state;
  }
};

export const RoomContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(roomContext, {
    rooms: [],
    user: null,
  });

  return (
    <RoomContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomsContext = () => useContext(RoomContext);
