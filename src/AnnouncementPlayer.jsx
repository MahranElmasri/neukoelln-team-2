import React, { useState } from 'react';
import axios from 'axios';

const AnnouncementPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const startAnnouncement = async () => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, 110000);

    await axios.get(
      'https://fa-team-waitlist-2.onrender.com/announcements/vaccination/medicine/start'
    );
  };

  const stopAnnouncement = async () => {
    setIsPlaying(false);
    await axios.get(
      'https://fa-team-waitlist-2.onrender.com/announcements/vaccination/medicine/stop'
    );
  };

  return (
    <>
      {
        <div className="mt-6 p-4 rounded-lg shadow-md bg-gray-700 mx-8">
          <div className="flex justify-between cursor-pointer">
            <h3 className="text-lg md:text-xl font-bold">Ansagen</h3>
          </div>
          {
            <div className="mt-4 space-x-4">
              <button
                onClick={startAnnouncement}
                disabled={isPlaying}
                className={`${
                  isPlaying
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-700'
                } text-white px-4 py-2 rounded-md`}
              >
                Impf-Ansage starten
              </button>
              <button
                onClick={stopAnnouncement}
                disabled={!isPlaying}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Impf-Ansage stoppen
              </button>
              <button
                onClick={() =>
                  axios.get(`https://fa-team-waitlist-2.onrender.com/reset`)
                }
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Reset
              </button>
              <button
                onClick={() =>
                  axios.get(`https://fa-team-waitlist-2.onrender.com/refresh`)
                }
                className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded-md"
              >
                Reload
              </button>
              <div className="mt-4">
                <h5 className="text-base font-medium">
                  Wiederholung der Ansage
                </h5>
                <div className="flex flex-wrap gap-2">
                  {['30', '60', '180'].map((time) => (
                    <label key={time} className="flex items-center space-x-1">
                      <input
                        type="radio"
                        name="repeat"
                        value={time}
                        onChange={(e) =>
                          axios.get(
                            `https://fa-team-waitlist-2.onrender.com/announcements/vaccination/repeat?time=${e.target.value}`
                          )
                        }
                      />
                      <span>{`${time} Minuten`}</span>
                    </label>
                  ))}
                </div>
                <p className="text-red-300 text-sm mt-4">
                  * Beachten Sie, dass die Ansage automatisch endet, wenn der
                  Arzt den Patienten anruft.
                </p>
              </div>
            </div>
          }
        </div>
      }
    </>
  );
};

export default AnnouncementPlayer;
