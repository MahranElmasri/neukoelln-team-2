import React, { useState, useEffect } from 'react';
import { useLogin } from './hooks/useLogin';
import Navbar from './Navbar';
import loginUrl from './assets/medicin.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useLogin();
  const [roomNumber, setRoomNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password, roomNumber);
  };
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
    const storedRoomNumber = localStorage.getItem('roomNumber');
    const storedRememberMe = localStorage.getItem('rememberMe');

    if (storedRememberMe === 'true') {
      setEmail(storedEmail || '');
      setPassword(storedPassword || '');
      setRoomNumber(storedRoomNumber || '');
      setRememberMe(true);
    }
  }, []);

  return (
    <>
      <Navbar />
      {/* component */}
      <div className="bg-gray-100 flex justify-center items-center h-full">
        {/* Left: Image */}
        <div className="w-1/2 h-screen hidden lg:block">
          <img
            src={loginUrl}
            alt="Placeholder Image"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
        {/* Right: Login Form */}
        <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
          <h1 className="text-2xl font-semibold mb-4 text-gray-600">
            Anmeldung
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
                onChange={(e) => {
                  setRoomNumber(e.target.value);
                }}
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
                {/* <option value="9">Admin</option> */}
              </select>
            </div>
            {/* Remember Me Checkbox */}
            <div className="flex items-center mb-4 ">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                className="mr-2"
                checked={rememberMe}
                onChange={(e) => {
                  setRememberMe(e.target.checked);
                  if (e.target.checked) {
                    localStorage.setItem('email', email);
                    localStorage.setItem('password', password);
                    localStorage.setItem('roomNumber', roomNumber);
                    localStorage.setItem('rememberMe', e.target.checked);
                  } else {
                    localStorage.removeItem('email');
                    localStorage.removeItem('password');
                    localStorage.removeItem('roomNumber');
                    localStorage.removeItem('rememberMe');
                  }
                }}
              />
              <label htmlFor="remember" className="text-gray-600 ml-2 mb-2">
                Erinnern Sie sich an mich
              </label>
            </div>
            {/* Login Button */}
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-md py-2 px-4 w-full"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Anmelden
            </button>
            {error && <div className="text-red-500 mt-4">{error}</div>}
          </form>
          {/* Sign up  Link */}
          <hr />
          <div className="mt-4 ">
            <div className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md py-2 px-4 w-full">
              <a
                href="/signup"
                className="w-full flex items-center justify-center"
              >
                Neues Konto erstellen
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
