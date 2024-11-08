// App.js
import React, { useState, useEffect, createContext } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import RoomCardsPage from './RoomCardsPage';
import MainPage from './MainPage';
import DoctorPage from './DoctorPage';
import axios from 'axios';
import Login from './Login';
import Signup from './Signup';
import { useAuthContext } from './hooks/useAuthContext';
import Loader from './Loader';

const doctors = [
  { id: 1, name: 'Dr. Rana Alttsheh', roomNumber: 1 },
  { id: 2, name: 'Dr. Khaled El-Sharafi', roomNumber: 2 },
  { id: 3, name: 'Dr. Thaer Mawed', roomNumber: 3 },
  { id: 4, name: 'Dr. Lee Mao', roomNumber: 4 },
];

export default function App() {
  const [rooms, setRooms] = useState([]);
  const { user } = useAuthContext();

  const fetchRooms = async () => {
    const response = await axios.get(
      `https://fa-team-waitlist-2.onrender.com/spandau-rooms`
    );
    setRooms(response.data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const updatePatientName = async (roomId, patientName, notificationLang) => {
    if (!roomId) {
      console.error('Invalid roomId provided');
      return;
    }

    try {
      const response = await axios.patch(
        `https://fa-team-waitlist-2.onrender.com/spandau/${roomId}`,
        {
          patientName,
          notificationLang,
        }
      );
      fetchRooms();

      if (!response || !response.data) {
        console.error('Error updating patient name: No response data');
        return;
      }

      const updatedRoom = response.data;
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === updatedRoom.id
            ? {
                ...room,
                patientName: updatedRoom.patientName,
                notificationLang: updatedRoom.notificationLang,
              }
            : room
        )
      );
    } catch (error) {
      console.error('Error updating patient name:', error);
    }
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainPage doctors={doctors} rooms={rooms} />,
    },
    {
      path: '/waiting-list',
      element:
        rooms?.length > 0 ? (
          <RoomCardsPage rooms={rooms} fetchRooms={fetchRooms} />
        ) : (
          <Loader />
        ),
    },
    {
      path: '/login',
      element: user ? (
        <Navigate to={`/doctor/${user.roomNumber}`} />
      ) : (
        <Login />
      ),
    },
    {
      path: '/signup',
      element: user ? (
        <Navigate to={`/doctor/${user.roomNumber}`} />
      ) : (
        <Signup />
      ),
    },
    ...rooms.map((doctor) => ({
      path: `/doctor/${doctor.id}`,
      element: user ? (
        <DoctorPage
          key={doctor.id}
          doctor={doctor}
          rooms={rooms.filter((room) => room.doctorId === doctor.id) || []} // Handle case where no rooms match
          updatePatientName={updatePatientName}
          fetchRooms={fetchRooms}
        />
      ) : (
        <Navigate to="/login" />
      ),
    })),
  ]);

  return (
    <div className="w-screen">
      <BrowserRouter>
        <Routes>
          {router.routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
}
