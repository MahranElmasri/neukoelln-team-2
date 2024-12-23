import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { Trash2, RefreshCw } from 'lucide-react';

function DoctorPage({ doctor, rooms, updatePatientName }) {
  const [patientName, setPatientName] = useState('');
  const [language, setLanguage] = useState('de-DE');
  const [isPlaying, setIsPlaying] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, [rooms]);

  const handlePatientNameChange = (event) => {
    setPatientName(event.target.value);
  };
  const patientToRecall = async (roomId, patientName, language) => {
    await updatePatientName(roomId, patientName, language);
  };

  const deletePatient = (roomId) => {
    updatePatientName(roomId, '');
    setPatientName('');
  };

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
  };

  const addPatient = () => {
    if (!rooms || !patientName) {
      alert('Bitte geben Sie einen Patientennamen ein.');
      return;
    }

    const doctorRoom = rooms.find((room) => room && !room.patientName);
    if (!doctorRoom) {
      alert('Löschen Sie einen Patienten, bevor Sie einen neuen hinzufügen.');
      return;
    }

    updatePatientName(doctorRoom.id, patientName, language);
    setPatientName('');
    setTimeout(() => {
      deletePatient(doctorRoom.id);
    }, 180000);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addPatient();
    }
  };

  // Language display names
  const languageNames = {
    'de-DE': 'DE',
    'ar-SA': 'AR',
    'en-GB': 'EN',
    'tr-TR': 'TR',
    'ru-RU': 'RU',
    'pl-PL': 'PL',
  };

  const startAnnouncement = async () => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, 110000);

    await axios.get(
      'https://fa-team-waitlist-2.onrender.com/announcements/vaccination/start'
    );
  };

  const stopAnnouncement = async () => {
    setIsPlaying(false);
    await axios.get(
      'https://fa-team-waitlist-2.onrender.com/announcements/vaccination/stop'
    );
  };

  return (
    <div className="min-h-screen bg-cyan-650">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Room Number Header */}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">
          {`${
            doctor?.roomNumber === 9
              ? 'Labor'
              : doctor?.roomNumber === 10
              ? 'Anmeldung '
              : 'Wartezimmer: ' + doctor?.roomNumber
          }`}
        </h2>

        {/* Patient Input Section */}
        <div className="bg-cyan-600 shadow-md rounded-lg p-6 mb-6">
          <input
            type="text"
            placeholder="Wartenummer | Name eingeben + (↵ Enter) zu hinzufügen"
            className="
              w-full px-4 py-3 
              border-2 border-gray-300 rounded-md 
              text-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500
              mb-4
            "
            value={patientName}
            onChange={handlePatientNameChange}
            onKeyDown={handleKeyDown}
            required
            ref={inputRef}
          />

          {/* Language Selection */}
          <div className="mb-4">
            <div className="text-lg font-semibold mb-2 text-center">
              Ansagesprache
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.keys(languageNames).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`
                    px-4 py-2 rounded-md 
                    transition-colors duration-200
                    ${
                      language === lang
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  {languageNames[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* Add Patient Button */}
          <button
            onClick={addPatient}
            className="
              block mx-auto
              w-[50%] py-3 
              bg-green-500 hover:bg-green-600 
              text-white 
              rounded-md 
              text-lg font-bold
              transition-colors duration-300
              focus:outline-none focus:ring-2 focus:ring-green-400
            "
          >
            Hinzufügen
          </button>
          <div className="mt-4">
            {doctor?.roomNumber === 11 && (
              <div className="flex justify-between ">
                <button
                  disabled={isPlaying}
                  onClick={startAnnouncement}
                  className={`${
                    isPlaying
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-700'
                  } text-white text-lg font-bold px-4 py-2 rounded-md mr-2`}
                >
                  Start Ansage
                </button>
                <button
                  disabled={!isPlaying}
                  onClick={stopAnnouncement}
                  className=" mr-2 block mx-auto
              w-[200px] py-3 
              bg-red-500 hover:bg-red-600 
              text-white 
              rounded-md 
              text-lg font-bold
              transition-colors duration-300
              focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Stop Ansage
                </button>
                <button
                  onClick={() =>
                    axios.get(`https://fa-team-waitlist-2.onrender.com/reset`)
                  }
                  className="mr-2 block mx-auto
              w-[100px] py-3 
              bg-yellow-500 hover:bg-yellow-600 
              text-white 
              rounded-md 
              text-lg font-bold
              transition-colors duration-300
              focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {' '}
                  Reset
                </button>
                <button
                  onClick={() =>
                    axios.get(`https://fa-team-waitlist-2.onrender.com/refresh`)
                  }
                  className='"block mx-auto
              w-[100px] py-3 
              bg-blue-500 hover:bg-blue-600 
              text-white 
              rounded-md 
              text-lg font-bold
              transition-colors duration-300
              focus:outline-none focus:ring-2 focus:ring-yellow-400"'
                >
                  Reload
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Patient Waiting List */}
        <div>
          <div className="space-y-4">
            {rooms
              .filter((room) => room.patientName)
              .map(
                (room) =>
                  room.patientName && (
                    <div key={room.id}>
                      <div
                        className="
                      bg-cyan-600 p-4 rounded-lg 
                      shadow-sm flex flex-col md:flex-row 
                      justify-between items-center
                      transition-all duration-300
                      hover:shadow-md
                    "
                      >
                        <div className="text-4xl font-semibold mb-2 md:mb-0">
                          {room.patientName}
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              deletePatient(
                                room.id,
                                room.patientName,
                                language
                              );
                              setTimeout(() => {
                                patientToRecall(
                                  room.id,
                                  room.patientName,
                                  language
                                );
                              }, 2000);
                            }}
                            className="
                          bg-green-500 hover:bg-green-600
                          text-white 
                          px-4 py-2 
                          font-bold
                          rounded-md 
                          flex items-center 
                          transition-colors duration-300
                        "
                          >
                            <RefreshCw className="mr-2" size={18} />
                            Rückruf
                          </button>

                          <button
                            onClick={() => deletePatient(room.id)}
                            className="
                          bg-red-500 hover:bg-red-600 
                          text-white 
                          font-bold
                          px-4 py-2 
                          rounded-md 
                          flex items-center 
                          transition-colors duration-300
                        "
                          >
                            <Trash2 className="mr-2" size={18} />
                            Erledigt
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-300 font-bold text-[16px]">
                        * Die Wartenummer wird nach dem Besuch des Patienten
                        automatisch gelöscht.
                      </p>
                    </div>
                  )
              )}
          </div>
        </div>
      </div>
      <footer className="bg-gray-300 p-4 text-center text-sm text-gray-600 fixed bottom-0 left-0 w-full">
        <div>
          Für Support, Probleme oder Verbesserungsvorschläge wenden Sie sich
          bitte an das MVZ El-Sharafi Entwicklungsteam:&nbsp;
          <a
            className="underline font-bold"
            href="mailto:develop@mvz-elsharafi.de"
          >
            develop@mvz-elsharafi.de
          </a>
        </div>
      </footer>
    </div>
  );
}

export default DoctorPage;
