import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './Header';
import Presentation from './Presentaion';
import Toast from './Toast';

// Assets
import sound from '/src/ding.mp3';
import vaccineAnnouncement from '/src/vaccine_announcement.mp3';

// Constants
const SOCKET_URL = 'wss://fa-team-waitlist-2.onrender.com:443';
// const SOCKET_URL = 'localhost:3001';
const TOAST_DURATION = 120000;
const SPEECH_DELAY = 2500;

const SOCKET_CONFIG = {
  transports: ['websocket'],
  timeout: 20000,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  autoConnect: true,
  pingTimeout: 30000,
  pingInterval: 25000,
};

const NOTIFICATION_TEXTS = {
  'ar-SA': {
    lab: (name) => `${name} يرجى التوجه إلى، المختبر`,
    reception: (name) => `${name} يرجى التوجه إلى الاستقبال`,
    room: (name, roomId) => `${name} يرجى التوجه إلى غرفة، رقم ${roomId}`,
  },
  'en-GB': {
    lab: (name) => `${name} Please go to, Laboratory`,
    reception: (name) => `${name} Please contact the reception`,
    room: (name, roomId) => `${name} Please go to Room, Number ${roomId}`,
  },
  'de-DE': {
    lab: (name) => `${name} Bitte gehen Sie zu, Labor`,
    reception: (name) => `${name} Bitte wenden Sie sich an die Anmeldung`,
    room: (name, roomId) =>
      `${name} Bitte gehen Sie zur Zimmer, nummer ${roomId}`,
  },
  'tr-TR': {
    lab: (name) => `${name} Lütfen şu adrese gidin, Laboratuvar`,
    reception: (name) => `${name} Lütfen resepsiyona başvurun`,
    room: (name, roomId) => `${name} Lütfen Oda'ya gidin, Numara ${roomId}`,
  },
  'ru-RU': {
    lab: (name) => `${name} Лаборатория`,
    reception: (name) => `${name} Пожалуйста, свяжитесь с администратором`,
    room: (name, roomId) =>
      `${name} Пожалуйста, пройдите в комнату, номер ${roomId}`,
  },
  'pl-PL': {
    lab: (name) => `${name} Laboratorium`,
    reception: (name) => `${name} Prosimy o kontakt z recepcjonistą`,
    room: (name, roomId) => `${name} Przejdź do pokoju, numer  ${roomId}`,
  },
};

function RoomCardsPage({ rooms, fetchRooms }) {
  // Refs
  const audioRef = useRef(null);
  const vaccineAudioRef = useRef(null);
  const socket = useRef(null);
  const prevRooms = useRef([]);
  const toastId = useRef(null);

  // State
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [announcementQueue, setAnnouncementQueue] = useState([]);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [roomCard, setRoomCard] = useState({});

  // Audio Controls
  const playVaccineAnnouncement = useCallback(() => {
    const vaccineAudio = new Audio(vaccineAnnouncement);
    vaccineAudioRef.current = vaccineAudio;
    if (!isSpeaking && !announcementQueue.length) {
      vaccineAudioRef.current.play();
    }
  }, [isSpeaking, announcementQueue.length]);

  const stopVaccineAnnouncement = useCallback(() => {
    if (vaccineAudioRef.current) {
      vaccineAudioRef.current.pause();
      vaccineAudioRef.current.currentTime = 12;
    }
  }, []);

  const playSound = useCallback(() => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(sound);
      audio.oncanplaythrough = () => resolve(audio);
      audio.onended = () => resolve(audio);
      audio.onerror = (e) => reject(e);
      audio.play();
    });
  }, []);

  // Socket Setup
  useEffect(() => {
    socket.current = io(SOCKET_URL, SOCKET_CONFIG);

    const socketEvents = {
      disconnect: () => {
        console.log('Disconnected from server...');
        // Attempt to reconnect manually if auto-reconnect fails
        setTimeout(() => {
          if (!socket.current.connected) {
            socket.current.connect();
          }
        }, 5000);
      },
      connect: () => console.log('Connected to server'),
      reconnect: (attempts) =>
        console.log(`Reconnected after ${attempts} attempts`),
      reconnect_attempt: () => console.log('Attempting to reconnect...'),
      reconnect_failed: () => {
        console.error('Reconnection failed');
        // Attempt to reconnect manually
        setTimeout(() => socket.current.connect(), 5000);
      },
      connect_error: (error) => {
        console.error(`WebSocket error: ${error.message}`);
        // Attempt to reconnect on connection error
        setTimeout(() => socket.current.connect(), 5000);
      },
      UPDATE_NEUKOLLN2_ROOMS: fetchRooms,
      START_ANNOUNCE_MED: playVaccineAnnouncement,
      STOP_ANNOUNCE_MED: stopVaccineAnnouncement,
      RELOAD: () => window.location.reload(),
    };

    // Add ping/pong heartbeat
    socket.current.on('ping', () => {
      socket.current.emit('pong');
      console.log('Ping received from client');
    });

    // Register all socket events
    Object.entries(socketEvents).forEach(([event, handler]) => {
      socket.current.on(event, handler);
    });

    return () => {
      // Cleanup all socket events
      Object.keys(socketEvents).forEach((event) => {
        socket.current.off(event);
      });
      socket.current.close();
    };
  }, [fetchRooms, playVaccineAnnouncement, stopVaccineAnnouncement]);

  // Speech Synthesis
  const generateAnnouncement = useCallback((room) => {
    if (!room?.patientName) return null;

    try {
      const texts = NOTIFICATION_TEXTS[room.notificationLang];
      if (room.roomId === 9) return texts.lab(room.patientName);
      if (room.roomId === 10) return texts.reception(room.patientName);
      return texts.room(room.patientName, room.roomId);
    } catch (error) {
      console.error('Error generating announcement:', error);
      return null;
    }
  }, []);

  const speakAnnouncement = useCallback(
    async (announcement) => {
      if (!announcement) return;

      try {
        const room = rooms.find(
          (room) => generateAnnouncement(room) === announcement
        );
        if (!room) throw new Error('Room not found');

        const voice = voices.find((voice) =>
          voice.lang.startsWith(room.notificationLang.split('-')[0])
        );

        const utterance = new SpeechSynthesisUtterance(announcement);
        if (voice) {
          utterance.voice = voice;
          utterance.lang = room.notificationLang;
          utterance.volume = 1;
        }

        utterance.onend = () => {
          setIsSpeaking(false);
          setAnnouncementQueue((prev) => prev.slice(1));
        };

        await playSound();
        stopVaccineAnnouncement();
        setTimeout(() => speechSynthesis?.speak(utterance), SPEECH_DELAY);
      } catch (error) {
        console.error('Speech error:', error);
        setIsSpeaking(false);
        setAnnouncementQueue((prev) => prev.slice(1));
      }
    },
    [voices, rooms, generateAnnouncement, playSound, stopVaccineAnnouncement]
  );

  // Effects
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis?.getVoices() || [];
      setVoices(availableVoices);
    };

    loadVoices(); // Initial load

    // Handle dynamic voice loading
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    const newPatientAdded = rooms.findIndex(
      (room, index) =>
        room?.notificationLang !== prevRooms.current[index]?.notificationLang ||
        room?.patientName !== prevRooms.current[index]?.patientName
    );

    const patientDeleted = rooms.findIndex(
      (room, index) =>
        !room?.patientName && prevRooms.current[index]?.patientName
    );

    if (newPatientAdded !== -1) {
      const room = rooms[newPatientAdded];
      setRoomCard(room);
      const announcement = generateAnnouncement(room);
      if (announcement) {
        setAnnouncementQueue((prev) => [...prev, announcement]);
      }
    } else if (patientDeleted !== -1) {
      setRoomCard({ ...rooms[patientDeleted], patientName: undefined });
    } else {
      setRoomCard({});
    }

    prevRooms.current = [...rooms];
  }, [rooms, generateAnnouncement]);

  // Toast Management
  useEffect(() => {
    toastId.current = `${roomCard.roomId}`;

    if (roomCard?.patientName) {
      const toastOptions = {
        toastId: toastId.current,
        autoClose: TOAST_DURATION,
        hideProgressBar: true,
        newestOnTop: true,
        closeButton: false,
        pauseOnFocusLose: false,
      };

      if (toast.isActive(toastId.current)) {
        toast.update(toastId.current, {
          render: () => <Toast room={roomCard} />,
        });
      } else {
        toast(<Toast room={roomCard} />, toastOptions);
      }
    } else if (toast.isActive(toastId.current)) {
      toast.dismiss(toastId.current);
      toastId.current = null;
    }
  }, [roomCard?.patientName, roomCard?.roomId]);

  // Announcement Queue Processing
  useEffect(() => {
    if (announcementQueue.length > 0 && !isSpeaking) {
      setIsSpeaking(true);
      if (speechSupported) {
        speakAnnouncement(announcementQueue[0]);
      } else {
        playSound()
          .then(() => {
            setTimeout(() => {
              setAnnouncementQueue((prev) => prev.slice(1));
              setIsSpeaking(false);
            }, SPEECH_DELAY);
          })
          .catch((error) => {
            console.error('Sound error:', error);
            setIsSpeaking(false);
            setAnnouncementQueue((prev) => prev.slice(1));
          });
      }
    }
  }, [
    announcementQueue,
    isSpeaking,
    speechSupported,
    speakAnnouncement,
    playSound,
  ]);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <audio ref={audioRef} src={sound} preload="auto" />

      {/* Header with minimal height */}
      <Header className="flex-shrink-0" />

      {/* Toast container */}
      <ToastContainer className="toaster-container" position="top-right" />

      {/* Main content with flex-grow to take all available space */}
      <div className="flex-1 w-full relative">
        <div className="absolute inset-0">
          <Presentation className="w-full" />
        </div>
      </div>
    </div>
  );
}

export default RoomCardsPage;
