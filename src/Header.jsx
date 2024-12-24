import { useState, useEffect } from 'react';

const Header = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      setCurrentDate(now.toLocaleDateString('de-DE', options));
      setCurrentTime(
        now.toLocaleTimeString('de-DE', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="bg-cyan-600 p-2 flex justify-between items-center flex-wrap px-6 py-4">
      <div className="flex items-center mb-2 sm:mb-0">
        <h1 className="text-white text-2xl sm:text-4xl font-bold ml-2 sm:ml-0">
          MVZ El-Sharafi Neukölln
        </h1>
      </div>
      <div className="text-white w-full flex flex-row sm:w-auto text-l sm:text-2xl mt-2 sm:mt-0">
        <p className="mb-2 pr-8">{currentDate}</p>
        <p className="font-bold mr-2">{currentTime}</p>
      </div>
    </header>
  );
};

export default Header;
