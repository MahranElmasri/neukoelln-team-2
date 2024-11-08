import { useEffect, useRef, useState } from 'react';
import sound from '/src/ding.mp3';
import RoomCard from './RoomCard';
import { io } from 'socket.io-client';
import Header from './Header';
import NewsFeed from './NewsFeed';
import MedicalQuizSlider from './MedicalQuizSlider';

function RoomCardsPage({ rooms, fetchRooms }) {
  const audioRef = useRef(null);
  const socket = useRef(null);
  const prevRooms = useRef([]);

  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [announcementQueue, setAnnouncementQueue] = useState([]);
  const [speechSupported, setSpeechSupported] = useState(true);

  const reload = () => window.location.reload();

  useEffect(() => {
    const fetchVoices = () => {
      const voices = window.speechSynthesis?.getVoices();
      setVoices(voices);
    };
    fetchVoices();
  }, [fetchRooms]);

  useEffect(() => {
    socket.current = io('wss://fa-team-waitlist-2.onrender.com:443', {
      transports: ['websocket'],
      autoConnect: false,
      timeout: 10000,
    });
    socket.current.connect();

    socket.current.on('connect', () => {
      console.log('Connected to WebSocket server');
    });
    socket.current.on('ping', () => {
      console.log('Ping received from server');
      socket.current.emit('pong');
    });
    socket.current.on('connect_error', (error) => {
      console.error(`WebSocket connection error: ${error.message}`);
    });
    return () => {
      if (socket.current.readyState === 1) {
        socket.current.close();
      }
    };
  }, [fetchRooms]);

  useEffect(() => {
    const handleUpdateRooms = () => fetchRooms();
    socket.current.on('UPDATE_SPANDAU_ROOMS', handleUpdateRooms);

    return () => {
      socket.current.off('UPDATE_SPANDAU_ROOMS', handleUpdateRooms);
    };
  }, [fetchRooms]);

  useEffect(() => {
    if (!window.SpeechSynthesisUtterance || !window.speechSynthesis) {
      setSpeechSupported(false);
    }
  }, []);

  useEffect(() => {
    socket.current.on('RELOAD', reload);

    return () => {
      socket.current.off('RELOAD', reload);
    };
  }, [fetchRooms]);

  useEffect(() => {
    const newPatientAdded = rooms.findIndex(
      (room, index) =>
        room?.notificationLang !== prevRooms.current[index]?.notificationLang ||
        (room?.patientName &&
          room?.patientName !== prevRooms.current[index]?.patientName)
    );
    if (newPatientAdded !== -1) {
      const room = rooms[newPatientAdded];
      const announcement = generateAnnouncement(room);
      if (announcement) {
        setAnnouncementQueue((prevQueue) => [...prevQueue, announcement]);
      }
    }
    prevRooms.current = [...rooms];
  }, [rooms]);

  const generateAnnouncement = (room) => {
    console.log(room.roomId);
    try {
      if (!room || !room.patientName) return null;

      const notificationText = {
        'ar-SA':
          room.roomId === 7
            ? `${room?.patientName}  يرجى التوجه إلى، المختبر`
            : room.roomId === 8
            ? `${room?.patientName} يرجى التوجه إلى الاستقبال`
            : `${room?.patientName} يرجى التوجه إلى غرفة، رقم ${room.roomId}`,

        'en-GB':
          room.roomId === 7
            ? `${room?.patientName} Please go to, Laboratory`
            : room.roomId === 8
            ? `${room?.patientName} Please contact the reception`
            : `${room?.patientName} Please go to Room, Number ${room.roomId}`,

        'de-DE':
          room.roomId === 7
            ? `${room?.patientName} Bitte gehen Sie zu, Labor`
            : room.roomId === 8
            ? `${room?.patientName} Bitte wenden Sie sich an die Anmeldung`
            : `${room?.patientName} Bitte gehen Sie zur Zimmer, nummer ${room.roomId}`,

        'tr-TR':
          room.roomId === 7
            ? `${room?.patientName} Lütfen şu adrese gidin, Laboratuvar`
            : room.roomId === 8
            ? `${room?.patientName} Lütfen resepsiyona başvurun`
            : `${room?.patientName} Lütfen Oda'ya gidin, Numara ${room.roomId}`,

        'ru-RU':
          room.roomId === 7
            ? `${room?.patientName} Лаборатория`
            : room.roomId === 8
            ? `${room?.patientName} Пожалуйста, свяжитесь с администратором`
            : `${room?.patientName} Пожалуйста, пройдите в комнату, номер ${room.roomId}`,

        'pl-PL':
          room.roomId === 7
            ? `${room?.patientName} Laboratorium`
            : room.roomId === 8
            ? `${room?.patientName} Prosimy o kontakt z recepcjonistą`
            : `${room?.patientName} Przejdź do pokoju, numer ${room.roomId}`,
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
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-2/3">
          <MedicalQuizSlider />
        </div>
        <div className="w-full sm:w-1/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 col-span-2 gap-2">
            {rooms
              .filter((room) => room.id !== 9)
              .map((room, index) => (
                <RoomCard key={index} room={room} />
              ))}
          </div>
        </div>
      </div>

      {/* <NewsFeed /> */}
    </div>
  );
}

export default RoomCardsPage;
