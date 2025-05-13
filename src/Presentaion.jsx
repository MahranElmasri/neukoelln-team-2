import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import questions from './quiz.json';
import './presentation.css';

const Presentation = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [timer, setTimer] = useState(25);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const playerRef = useRef(null);

  const videoUrls = [
    'https://ik.imagekit.io/br3koz4p0/mvz-intro.mp4',
    // 'https://ik.imagekit.io/wvpwf1oj9/mvz-elsharafi-app/Ramdan%20(1).mp4',
    'https://ik.imagekit.io/br3koz4p0/Gesundheits-Check-up-ar.mp4',
    'https://ik.imagekit.io/br3koz4p0/Gesundheits-Check-up-de.mp4',
    'https://ik.imagekit.io/br3koz4p0/Infectious%20Disease.mp4',
    'https://ik.imagekit.io/br3koz4p0/Infectious%20Disease%20de.mp4',
    // 'https://ik.imagekit.io/br3koz4p0/Vaccines.mp4',
    'https://ik.imagekit.io/br3koz4p0/RSV.mp4',
    'https://ik.imagekit.io/wvpwf1oj9/RSV-de.mp4?updatedAt=1734342153975',
    'https://ik.imagekit.io/br3koz4p0/Krebsfru%CC%88herkennung-ar.mp4',
    'https://ik.imagekit.io/br3koz4p0/Krebsfru%CC%88herkennung-de.mp4',
    'https://ik.imagekit.io/br3koz4p0/new-baby.mp4?updatedAt=1737404325248',
    'https://ik.imagekit.io/br3koz4p0/New-baby-de.mp4?updatedAt=1737404329859',
    'https://ik.imagekit.io/br3koz4p0/COPD.mp4',
    'https://ik.imagekit.io/br3koz4p0/COPD%20DE%20.mp4',
    'https://ik.imagekit.io/wvpwf1oj9/healthy-food.mp4/ik-video.mp4?updatedAt=1734456099146',
    'https://ik.imagekit.io/br3koz4p0/healthy-food-de_mp4.m4v/ik-video.mp4',
    'https://ik.imagekit.io/wvpwf1oj9/quiz.mp4?updatedAt=1734343028195',
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Update current time every minute
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timerId);
  }, []);

  // Quiz timer logic
  useEffect(() => {
    let timerId;

    if (showQuiz) {
      if (timer > 0) {
        timerId = setTimeout(() => setTimer(timer - 1), 1000);
      } else {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setShowCorrectAnswer(false);
          setTimer(25);
        } else {
          setCurrentQuestionIndex(0);
          setShowCorrectAnswer(false);
          setTimer(25);
          setShowQuiz(false);
        }
      }
    }

    return () => clearTimeout(timerId);
  }, [timer, showQuiz, currentQuestionIndex]);

  useEffect(() => {
    if (timer === 5 && !showCorrectAnswer) {
      setShowCorrectAnswer(true);
    }
  }, [timer, showCorrectAnswer]);

  // Reset video index when returning to videos
  useEffect(() => {
    if (!showQuiz) {
      setCurrentVideoIndex(0);
    }
  }, [showQuiz]);

  const handleEnded = () => {
    if (currentVideoIndex < videoUrls.length - 1) {
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Common header elements for both video and quiz modes
  const HeaderElements = () => (
    <>
      {/* Top left logo */}
      <div
        className="top-left-logo flex items-center bg-black/40 rounded-xl p-1"
        style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 100 }}
      >
        <img
          src="https://ik.imagekit.io/wvpwf1oj9/mvz-elsharafi-app/logo.png?updatedAt=1740468611559"
          alt="Clinic Logo"
          className="logo"
        />
        <div className="logo-text text-2xl -ml-4 font-bold">
          MVZ EL-SHARAFI NEUKÖLLN
        </div>
      </div>

      {/* Top right time */}
      <div
        className="top-right-time flex items-center gap-1 text-2xl bg-black/40 rounded-xl p-2"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 100,
        }}
      >
        <div className="clock-icon">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <line
              x1="12"
              y1="12"
              x2="12"
              y2="8"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="12"
              y1="12"
              x2="16"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="time text-4xl font-bold">{formatTime(currentTime)}</div>
      </div>
    </>
  );

  if (!showQuiz) {
    return (
      <div className="presentation-container">
        {/* Main video content */}
        <div className="video-container">
          <ReactPlayer
            ref={playerRef}
            url={videoUrls[currentVideoIndex]}
            playing={true}
            muted={true}
            height="100%"
            width="100%"
            onEnded={handleEnded}
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload',
                },
              },
            }}
          />
        </div>

        {/* Common header elements */}
        <HeaderElements />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div
      dir={currentQuestion.direction || 'ltr'}
      className="presentation-container quiz-mode"
    >
      {/* Quiz content */}
      <div className="quiz-container">
        <div className="question-container flex flex-col items-center justify-center">
          <p className="question-text text-6xl font-bold">
            {currentQuestion.question}
          </p>
          <p
            className={`timer ${timer > 10 ? 'timer-normal' : 'timer-warning'}`}
          >
            Verbleibende Zeit: {timer} Sekunden
          </p>
        </div>
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              dir={currentQuestion.direction || 'ltr'}
              className={`option ${
                showCorrectAnswer && index === currentQuestion.correctAnswer
                  ? 'option-correct'
                  : ''
              }`}
            >
              {option}
            </div>
          ))}
        </div>

        {/* Medical decoration elements */}
        <div className="medical-decoration top-left"></div>
        <div className="medical-decoration top-right"></div>
        <div className="medical-decoration bottom-left"></div>
        <div className="medical-decoration bottom-right"></div>
      </div>

      {/* Common header elements */}
      <HeaderElements />

      {/* Title overlay for quiz mode */}
      <div
        className="title-overlay quiz-title-overlay"
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
        }}
      >
        Medizinisches Quiz
      </div>
    </div>
  );
};

export default Presentation;
