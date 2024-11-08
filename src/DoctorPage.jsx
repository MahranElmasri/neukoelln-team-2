import React, { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import AnnouncementPlayer from './AnnouncementPlayer';

function DoctorPage({ doctor, rooms, updatePatientName, fetchRooms }) {
  const [patientName, setPatientName] = useState('');
  const [language, setLanguage] = useState('ar-SA');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handlePatientNameChange = (event) => {
    setPatientName(event.target.value);
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
      alert(
        'Löschen Sie einen Patienten, bevor Sie einen neuen Patienten hinzufügen.'
      );
      return;
    }

    updatePatientName(doctorRoom.id, patientName, language);
    setPatientName('');
  };

  const patientToRecall = async (roomId, patientName, language) => {
    await updatePatientName(roomId, patientName, language);
  };

  const deletePatient = (roomId) => {
    updatePatientName(roomId, '');
    setPatientName('');
  };

  const languageButtonClasses = (selectedLang) =>
    `flex items-center px-6 py-2 border border-gray-200 text-xl rounded ${
      language === selectedLang
        ? 'bg-red-600 text-white'
        : 'bg-gray-100 text-gray-900'
    } dark:border-gray-700 ml-4`;

  return (
    <>
      <Navbar />
      {doctor?.roomNumber !== 9 ? (
        <div className="flex flex-col items-center bg-gradient-to-b from-[#007490] to-[#004060] text-white p-2 md:p-8 w-full min-h-screen">
          <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-center">
            {`Behandlungszimmer Nr: ${
              doctor?.roomNumber === 9 ? 'Anmeldung' : doctor?.roomNumber
            }`}
          </h2>
          <input
            type="text"
            placeholder="Patientennummer | Name eingeben"
            className="border-2 border-white rounded-md px-2 md:px-4 py-1 md:py-2 text-base md:text-lg shadow-sm placeholder-gray-400 w-11/12 md:w-[420px]"
            value={patientName}
            onChange={handlePatientNameChange}
            required
            ref={inputRef}
          />
          <div className="flex flex-col items-center justify-center my-4">
            <div className="text-lg md:text-2xl mb-2 md:mb-4 text-center">
              Wählen Sie die Ansagesprache
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {['ar-SA', 'de-DE', 'en-GB', 'tr-TR', 'ru-RU', 'pl-PL'].map(
                (lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`flex items-center justify-center w-[100px] ${languageButtonClasses(
                      lang
                    )}`}
                  >
                    {lang === 'ar-SA'
                      ? 'Arabisch'
                      : lang === 'de-DE'
                      ? 'Deutsch'
                      : lang === 'en-GB'
                      ? 'English'
                      : lang === 'tr-TR'
                      ? 'Turkish'
                      : lang === 'ru-RU'
                      ? 'Russisch'
                      : 'Polnisch'}
                  </button>
                )
              )}
            </div>
          </div>
          <div className="flex flex-col items-center mt-2 md:mt-4">
            <button
              onClick={addPatient}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-lg font-bold text-base md:text-lg transition-all duration-300"
            >
              Patient hinzufügen
            </button>
          </div>
          <hr className="w-full my-4" />
          <div className="flex flex-col items-center mt-4 md:mt-8 w-full px-4">
            <h3 className="text-lg md:text-xl font-bold text-center">
              Patienten warten liste
            </h3>
            <ul className="w-full mt-2 md:mt-4">
              {rooms.map((room) => (
                <li
                  key={room.id}
                  className="mt-2 md:mt-4 flex flex-col items-center space-y-2 w-full"
                >
                  {room.patientName && (
                    <div className="w-full flex flex-col md:flex-row items-center space-y-2 md:space-y-0 bg-cyan-800 p-4 md:p-6 border border-white rounded-md">
                      <div className="flex flex-col md:flex-row text-base md:text-4xl font-bold w-full justify-between items-center">
                        <span className="text-center md:text-left">
                          Wartende Nummer Patient:
                        </span>
                        <span className="text-center md:text-left w-1/2">
                          {room.patientName}
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0">
                        <button
                          onClick={() => {
                            deletePatient(room.id);
                            setTimeout(() => {
                              patientToRecall(
                                room.id,
                                room.patientName,
                                language
                              );
                            }, 1000);
                          }}
                          className="bg-sky-500 hover:bg-sky-700 text-white px-4 py-2 rounded-md font-bold text-base md:text-lg transition-all duration-300"
                        >
                          Rückruf
                        </button>
                        <button
                          onClick={() => deletePatient(room.id)}
                          className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md font-bold text-base md:text-lg transition-all duration-300"
                        >
                          Erledigt
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <AnnouncementPlayer />
      )}
    </>
  );
}

export default DoctorPage;
