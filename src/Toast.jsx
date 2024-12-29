import { memo } from 'react';
import PropTypes from 'prop-types';

const ROOM_TYPES = {
  LAB: 9,
  RECEPTION: 10,
};

const Toast = ({ room }) => {
  if (!room?.patientName) return null;

  // Get room display text
  const getRoomDisplay = (roomId) => {
    switch (roomId) {
      case ROOM_TYPES.LAB:
        return 'Lab';
      case ROOM_TYPES.RECEPTION:
        return 'Anm';
      default:
        return String(roomId).padStart(2, '0');
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex items-center w-full bg-[#2269A1] p-4 min-h-[140px] bg-opacity-60 rounded-lg "
      style={{
        animation: room.patientName
          ? 'blinkingBg 5s ease-in-out 4 alternate'
          : 'none',
      }}
    >
      {/* Room Number Container */}
      <div className="flex-shrink-0 bg-[#dc2627] bg-opacity-60 rounded-lg mr-6 min-w-[200px] h-[120px] flex items-center justify-center">
        <span className="text-white font-bold text-9xl px-2">
          {getRoomDisplay(room.roomId)}
        </span>
      </div>

      {/* Patient Name Container */}
      <div className="flex-1 overflow-hidden">
        <span
          className={`text-white font-bold capitalize text-center ${
            room.patientName.length > 8
              ? 'text-5xl'
              : room.patientName.length > 3
              ? 'text-6xl'
              : 'text-9xl'
          } break-words `}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word',
          }}
        >
          {room.patientName}
        </span>
      </div>
    </div>
  );
};

Toast.propTypes = {
  room: PropTypes.shape({
    roomId: PropTypes.number,
    patientName: PropTypes.string,
  }),
};

export default memo(Toast);
