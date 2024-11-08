import React, { useState } from 'react';
import { useSignup } from './hooks/useSignup';
import Navbar from './Navbar';
import loginUrl from './assets/medicin.jpg';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const { signup, isLoading, error } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, password, roomNumber);
  };

  return (
    <>
      <Navbar />
      {/* component */}
      <div className="bg-gray-100 flex justify-center items-center h-screen">
        {/* Right: Login Form */}
        <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
          <h1 className="text-2xl font-semibold text-gray-500 mb-4">
            Registrierung
          </h1>
          <form action="#" method="POST">
            {/* Username Input */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600">
                Benutzername
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600">
                Passwort
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="roomNumber" className="block text-gray-600">
                Behandlungszimmer Nr.
              </label>
              <select
                id="roomNumber"
                name="roomNumber"
                className="w-full border text-gray-600 border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                required
              >
                <option value="">-- Bitte wählen --</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">Lab</option>
                <option value="8">Anmeldung</option>
                <option value="9">Admin</option>
              </select>
            </div>
            {/* Login Button */}
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-md py-2 px-4 w-full"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Registrieren
            </button>
            {error && <div className="text-red-500 mt-4">{error}</div>}
          </form>
          {/* Sign up  Link */}
          <div className="mt-6 text-blue-500 text-center">
            <span className="mr-2 text-gray-600">
              Sie haben bereits ein Konto?
            </span>
            <a href="/login" className="hover:underline">
              melden Sie sich hier an.
            </a>
          </div>
        </div>
        {/* Left: Image */}
        <div className="w-1/2 h-screen hidden lg:block">
          <img
            src={loginUrl}
            alt="Placeholder Image"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      </div>
    </>
  );
}
