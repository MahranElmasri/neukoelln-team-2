import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import axios from 'axios';
import { Trash2, RefreshCw } from 'lucide-react';

// Constants
const API_BASE_URL = 'https://fa-team-waitlist-2.onrender.com';
const LANGUAGE_NAMES = {
  'ar-SA': 'AR',
  'de-DE': 'DE',
  'en-GB': 'EN',
  'tr-TR': 'TR',
  'ru-RU': 'RU',
  'pl-PL': 'PL',
};
const PATIENT_TIMEOUT = 120000;
const ANNOUNCEMENT_TIMEOUT = 110000;

// Common CSS classes
const buttonBaseClasses =
  'block mx-auto py-3 text-white rounded-md text-lg font-bold transition-colors duration-300 focus:outline-none';
const greenButtonClasses = `${buttonBaseClasses} bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-400`;
const redButtonClasses = `${buttonBaseClasses} bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-400`;

function DoctorPage({ doctor, rooms, updatePatientName }) {
  const [patientName, setPatientName] = useState('');
  const [language, setLanguage] = useState('ar-SA');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecalling, setIsRecalling] = useState(false);
  const inputRef = useRef(null);
  const patientTimersRef = useRef({});

  useEffect(() => {
    inputRef.current.focus();
  }, [rooms]);

  // Cleanup timer when announcement is playing
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setTimeout(() => {
        setIsPlaying(false);
      }, ANNOUNCEMENT_TIMEOUT);
    }
    return () => clearTimeout(timer);
  }, [isPlaying]);

  const handlePatientNameChange = useCallback((event) => {
    setPatientName(event.target.value);
  }, []);

  const patientToRecall = async (roomId, patientName, language) => {
    try {
      await updatePatientName(roomId, patientName, language);

      // Clear any existing timer for this room
      if (patientTimersRef.current[roomId]) {
        clearTimeout(patientTimersRef.current[roomId]);
      }

      // Set new timer for auto-deletion
      patientTimersRef.current[roomId] = setTimeout(() => {
        deletePatient(roomId);
      }, PATIENT_TIMEOUT);
    } catch (error) {
      console.error('Failed to recall patient:', error);
    }
  };

  const deletePatient = useCallback(
    (roomId) => {
      if (patientTimersRef.current[roomId]) {
        clearTimeout(patientTimersRef.current[roomId]);
        delete patientTimersRef.current[roomId];
      }
      updatePatientName(roomId, '');
      setPatientName('');
    },
    [updatePatientName]
  );

  const handleLanguageChange = useCallback((selectedLanguage) => {
    setLanguage(selectedLanguage);
  }, []);

  const addPatient = useCallback(() => {
    if (!rooms || !patientName) {
      alert('Bitte geben Sie einen Patientennamen ein.');
      return;
    }

    const doctorRoom = rooms.find((room) => room && !room.patientName);
    if (!doctorRoom) {
      alert('Löschen Sie einen Patienten, bevor Sie einen neuen hinzufügen.');
      return;
    }

    if (patientTimersRef.current[doctorRoom.id]) {
      clearTimeout(patientTimersRef.current[doctorRoom.id]);
    }

    updatePatientName(doctorRoom.id, patientName, language);
    setPatientName('');

    patientTimersRef.current[doctorRoom.id] = setTimeout(() => {
      deletePatient(doctorRoom.id);
    }, PATIENT_TIMEOUT);
  }, [rooms, patientName, language, updatePatientName, deletePatient]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addPatient();
      }
    },
    [addPatient]
  );

  const startAnnouncement = async () => {
    setIsLoading(true);
    try {
      setIsPlaying(true);
      await axios.get(
        `${API_BASE_URL}/announcements/vaccination/medicine/start`
      );
    } catch (error) {
      console.error('Failed to start announcement:', error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopAnnouncement = async () => {
    setIsLoading(true);
    try {
      setIsPlaying(false);
      await axios.get(
        `${API_BASE_URL}/announcements/vaccination/medicine/stop`
      );
    } catch (error) {
      console.error('Failed to stop announcement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activePatients = useMemo(
    () => rooms.filter((room) => room.patientName),
    [rooms]
  );

  useEffect(() => {
    return () => {
      Object.values(patientTimersRef.current).forEach(clearTimeout);
      patientTimersRef.current = {};
    };
  }, []);

  return (
    <div className="min-h-screen bg-cyan-650">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Room Number Header */}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">
          {doctor?.roomNumber === 9
            ? 'Labor'
            : doctor?.roomNumber === 10
            ? 'Anmendung'
            : `Wartezimmer: ${doctor?.roomNumber}`}
        </h2>

        {/* Patient Input Section */}
        <div className="bg-cyan-600 shadow-md rounded-lg p-6 mb-6">
          <input
            type="text"
            placeholder="Wartenummer | Name eingeben + (↵ Enter) zu hinzufügen"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
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
              {Object.entries(LANGUAGE_NAMES).map(([lang, name]) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    language === lang
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Add Patient Button */}
          <button
            onClick={addPatient}
            className={`${greenButtonClasses} w-[50%]`}
            disabled={isLoading}
          >
            Hinzufügen
          </button>

          {/* Control Buttons for Room 16 */}
          {doctor?.roomNumber === 16 && (
            <div className="mt-4 flex justify-between">
              <button
                disabled={isPlaying || isLoading}
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
                disabled={!isPlaying || isLoading}
                onClick={stopAnnouncement}
                className={`${redButtonClasses} w-[200px]`}
              >
                Stop Ansage
              </button>
              <button
                onClick={() => axios.get(`${API_BASE_URL}/reset`)}
                className="bg-yellow-500 hover:bg-yellow-600 w-[100px] py-3 text-white rounded-md text-lg font-bold"
                disabled={isLoading}
              >
                Reset
              </button>
              <button
                onClick={() => axios.get(`${API_BASE_URL}/refresh`)}
                className="bg-blue-500 hover:bg-blue-600 w-[100px] py-3 text-white rounded-md text-lg font-bold"
                disabled={isLoading}
              >
                Reload
              </button>
            </div>
          )}
        </div>

        {/* Patient Waiting List */}
        {isRecalling ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin mb-4">
              <RefreshCw size={32} className="text-gray-100" />
            </div>
            <p className="text-lg text-gray-100 font-semibold">
              Patient wird aufgerufen...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activePatients.map((room) => (
              <div
                key={room.id}
                className="bg-cyan-600 p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center transition-all duration-300 hover:shadow-md"
              >
                <div className="text-4xl font-semibold mb-2 md:mb-0">
                  {room.patientName}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setIsRecalling(true);
                      deletePatient(room.id);
                      setTimeout(() => {
                        patientToRecall(room.id, room.patientName, language);
                        setIsRecalling(false);
                      }, 2000);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 font-bold rounded-md flex items-center transition-colors duration-300"
                  >
                    <RefreshCw className="mr-2" size={18} />
                    Rückruf
                  </button>

                  <button
                    onClick={() => deletePatient(room.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-md flex items-center transition-colors duration-300"
                  >
                    <Trash2 className="mr-2" size={18} />
                    Erledigt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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

DoctorPage.propTypes = {
  doctor: PropTypes.shape({
    roomNumber: PropTypes.number.isRequired,
  }),
  rooms: PropTypes.array.isRequired,
  updatePatientName: PropTypes.func.isRequired,
};

export default DoctorPage;
