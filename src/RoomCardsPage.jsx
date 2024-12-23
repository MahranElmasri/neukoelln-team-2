import { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import sound from '/src/ding.mp3'; // Import the vaccine announcement
import RoomCard from './RoomCard';
import { io } from 'socket.io-client';
import Header from './Header';
import NewsFeed from './NewsFeed';
import Presentation from './Presentaion';
import Toast from './Toast';

function RoomCardsPage({ rooms, fetchRooms }) {
  const audioRef = useRef(null);
  const socket = useRef(null);
  const prevRooms = useRef([]);

  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [announcementQueue, setAnnouncementQueue] = useState([]);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [roomCard, setRoomCard] = useState({});
  const toastId = useRef(null);

  useEffect(() => {
    const fetchVoices = () => {
      const voices = window.speechSynthesis?.getVoices();
      setVoices(voices);
    };
    fetchVoices();
  }, [fetchRooms]);

  const reload = () => window.location.reload();

  useEffect(() => {
    socket.current = io('wss://fa-team-waitlist-2.onrender.com:443', {
      transports: ['websocket'],
      timeout: 15000,
      reconnection: true, // Enable reconnection
      reconnectionAttempts: 5, // Max attempts to reconnect
      reconnectionDelay: 1000, // Initial delay between reconnections
      reconnectionDelayMax: 5000, // Max delay between reconnections
    });

    socket.current.connect(); // Connect immediately

    socket.current.on('disconnect', () => {
      console.log('Disconnected from the server, attempting to0-reconnect...');
    });

    socket.current.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected after ${attemptNumber} attempts`);
    });

    socket.current.on('reconnect_failed', () => {
      console.error('Reconnection failed');
    });

    socket.current.on('connect_error', (error) => {
      console.error(`WebSocket connection error: ${error.message}`);
    });

    return () => {
      socket.current.close(); // Close socket on component unmount
    };
  }, [fetchRooms]); // Ensure dependency is appropriate
  // Use fetchRooms as a dependency if necessary

  useEffect(() => {
    const handleUpdateRooms = () => fetchRooms();
    socket.current.on('UPDATE_NEUKOLLN2_ROOMS', handleUpdateRooms);

    return () => {
      socket.current.off('UPDATE_NEUKOLLN2_ROOMS', handleUpdateRooms);
    };
  }, [fetchRooms]);

  useEffect(() => {
    socket.current.on('RELOAD', reload);

    return () => {
      socket.current.off('RELOAD', reload);
    };
  }, [fetchRooms]);

  useEffect(() => {
    if (!window.SpeechSynthesisUtterance || !window.speechSynthesis) {
      setSpeechSupported(false);
    }
  }, []);

  useEffect(() => {
    // Detect new patient additions
    const newPatientAdded = rooms.findIndex(
      (room, index) =>
        room?.notificationLang !== prevRooms.current[index]?.notificationLang ||
        room?.patientName !== prevRooms.current[index]?.patientName
    );

    // Detect patient deletions
    const patientDeleted = rooms.findIndex(
      (room, index) =>
        !room?.patientName && prevRooms.current[index]?.patientName
    );

    if (newPatientAdded !== -1) {
      const room = rooms[newPatientAdded];
      setRoomCard(room); // Update `roomCard` with the new patient data
      const announcement = generateAnnouncement(room);
      if (announcement) {
        setAnnouncementQueue((prevQueue) => [...prevQueue, announcement]);
      }
    } else if (patientDeleted !== -1) {
      const room = rooms[patientDeleted];
      setRoomCard({ ...room, patientName: undefined }); // Clear patient data
    } else {
      // Fallback: Clear roomCard when there are no changes
      setRoomCard({});
    }

    prevRooms.current = [...rooms]; // Update the previous rooms reference
  }, [rooms]);

  const generateAnnouncement = (room) => {
    console.log(room.roomId);
    try {
      if (!room || !room.patientName) return null;

      const notificationText = {
        'ar-SA':
          room.roomId === 9
            ? `${room?.patientName} يرجى التوجه إلى، المختبر`
            : room.roomId === 10
            ? `${room?.patientName} يرجى التوجه إلى الاستقبال`
            : `${room?.patientName} يرجى التوجه إلى غرفة، رقم ${room.roomId}`,

        'en-GB':
          room.roomId === 9
            ? `${room?.patientName} Please go to, Laboratory`
            : room.roomId === 10
            ? `${room?.patientName} Please contact the reception`
            : `${room?.patientName} Please go to Room, Number ${room.roomId}`,

        'de-DE':
          room.roomId === 9
            ? `${room?.patientName} Bitte gehen Sie zu, Labor`
            : room.roomId === 10
            ? `${room?.patientName} Bitte wenden Sie sich an die Anmeldung`
            : `${room?.patientName} Bitte gehen Sie zur Zimmer, nummer ${room.roomId}`,

        'tr-TR':
          room.roomId === 9
            ? `${room?.patientName} Lütfen şu adrese gidin, Laboratuvar`
            : room.roomId === 10
            ? `${room?.patientName} Lütfen resepsiyona başvurun`
            : `${room?.patientName} Lütfen Oda'ya gidin, Numara ${room.roomId}`,
      };

      const language = room.notificationLang;
      return notificationText[language];
    } catch (error) {
      console.error('Error in generateAnnouncement:', error);
      throw error;
    }
  };

  const speakAnnouncement = (announcement) => {
    try {
      if (!announcement) {
        throw new Error('No announcement provided');
      }

      const room = rooms.find(
        (room) => generateAnnouncement(room) === announcement
      );
      if (!room) {
        throw new Error('Room not found for announcement');
      }

      const voice = voices.find(
        (voice) => voice.lang === room?.notificationLang
      );

      console.log('Announcement voice:', voice);
      const utterance = new SpeechSynthesisUtterance(announcement);
      if (voice) {
        utterance.voice = voice;
        utterance.volume = 1;
        utterance.rate = 0.9;
        utterance.pitch = 1;
      }

      utterance.onend = () => {
        console.log('Announcement finished');
        setIsSpeaking(false);
        setAnnouncementQueue((prevQueue) => prevQueue.slice(1));
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
        setAnnouncementQueue((prevQueue) => prevQueue.slice(1));
      };

      // Play sound and then speak
      playSound()
        .then(() => {
          console.log('Ding sound played, now speaking');
          setTimeout(() => {
            speechSynthesis?.speak(utterance);
          }, 2500); // Adjust this delay if needed
        })
        .catch((error) => {
          console.error('Error playing sound:', error);
          setIsSpeaking(false);
          setAnnouncementQueue((prevQueue) => prevQueue.slice(1));
        });
    } catch (error) {
      console.error('Error in speakAnnouncement:', error);
      setIsSpeaking(false);
      setAnnouncementQueue((prevQueue) => prevQueue.slice(1));
    }
  };

  const playSound = () => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(sound);
      audio.oncanplaythrough = () => resolve(audio);
      audio.onended = () => resolve(audio);
      audio.onerror = (e) => reject(e);
      audio.play();
    });
  };

  useEffect(() => {
    toastId.current = `${roomCard.roomId}`;
    if (roomCard?.patientName) {
      const toastOptions = {
        toastId: toastId.current,
        autoClose: 240000,
        hideProgressBar: true,
        newestOnTop: true,
        closeButton: false,
        pauseOnFocusLose: false,
      };

      if (toast.isActive(toastId.current)) {
        // Update the toast if it's already active and `patientName` has changed
        toast.update(toastId.current, {
          render: () => <Toast room={roomCard} />,
        });
      } else {
        // Show the toast for the first time if it is not active
        toast(<Toast room={roomCard} />, toastOptions);
      }
    } else {
      // Dismiss the toast if `patientName` is deleted
      if (toast.isActive(toastId.current)) {
        toast.dismiss(toastId.current);
        toastId.current = null;
      }
    }
  }, [roomCard?.patientName, roomCard?.roomId, toastId.current]);

  useEffect(() => {
    // Check if there is an announcement in the queue
    if (announcementQueue.length > 0 && !isSpeaking) {
      setIsSpeaking(true);
      const announcement = announcementQueue[0];
      if (speechSupported) {
        speakAnnouncement(announcement);
      } else {
        playSound()
          .then(() => {
            console.log('Ding sound played, now playing speech');
            setTimeout(() => {
              dequeueAnnouncement();
              setIsSpeaking(false);
            }, 2500); // Adjust this delay if needed
          })
          .catch((error) => {
            console.error('Error playing sound:', error);
            setIsSpeaking(false);
            dequeueAnnouncement();
          });
      }
    }
  }, [announcementQueue, isSpeaking, speechSupported]);

  const dequeueAnnouncement = () => {
    setAnnouncementQueue((prevQueue) => prevQueue.slice(1));
  };

  return (
    <div className="w-full">
      <audio ref={audioRef} src={sound} preload="auto" />
      <Header />
      <ToastContainer
        style={{ width: '450px' }}
        className="toaster-container"
        position="top-right"
      />
      <div className="w-full sm:w-[80vw] max-h-screen ml-16">
        <Presentation />
      </div>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 bg-slate-600">
        {rooms.map((room, index) => (
          <RoomCard key={index} room={room} />
        ))}
      </div>
      <NewsFeed /> */}
    </div>
  );
}

export default RoomCardsPage;
