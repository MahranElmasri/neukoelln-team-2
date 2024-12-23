const Toast = ({ room }) => {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#2269A1',
        animationDelay: '1s',
        animation: `${
          room?.patientName && 'blinkingBg 5s ease-in-out 4 alternate'
        }`,
      }}
    >
      <span
        className={`${
          room?.roomId === 9
            ? 'text-6xl w-[150px] py-4'
            : room?.roomId === 10
            ? 'text-6xl w-[200px] py-4'
            : 'text-7xl w-[100px]'
        }`}
        style={{
          fontWeight: 'bold',
          color: '#fff',
          backgroundColor: '#dc2627',
          marginRight: 20,
          paddingLeft: 20,
        }}
      >
        {room?.roomId === 9
          ? 'Lab'
          : room?.roomId === 10
          ? 'Anm'
          : `${room?.roomId}`}
      </span>
      <span
        className={`${room?.patientName.length > 3 ? 'text-5xl' : 'text-7xl'}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
          fontWeight: 'bold',
        }}
      >
        {room?.patientName}
      </span>
    </div>
  );
};

export default Toast;
