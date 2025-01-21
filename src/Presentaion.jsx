import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import questions from './quiz.json';

const Presentaion = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [timer, setTimer] = useState(25);
  const [showQuiz, setShowQuiz] = useState(false);

  const videoUrls = [
    'https://ik.imagekit.io/br3koz4p0/mvz-intro.mp4?updatedAt=1737404565151',
    'https://ik.imagekit.io/br3koz4p0/Infectious%20Disease.mp4?updatedAt=1737404282688',
    'https://ik.imagekit.io/br3koz4p0/Vaccines.mp4?updatedAt=1737404329761',
    'https://ik.imagekit.io/br3koz4p0/new-baby.mp4?updatedAt=1737404325248',
    'https://ik.imagekit.io/br3koz4p0/RSV.mp4?updatedAt=1737404326569',
    'https://ik.imagekit.io/br3koz4p0/COPD.mp4?updatedAt=1737404293974',
    'https://ik.imagekit.io/br3koz4p0/Infectious%20Disease%20de.mp4?updatedAt=1737404289210',
    'https://ik.imagekit.io/br3koz4p0/New-baby-de.mp4?updatedAt=1737404329859',
    'https://ik.imagekit.io/br3koz4p0/healthy-food-de_mp4.m4v/ik-video.mp4?updatedAt=1737404391856',
    'https://ik.imagekit.io/br3koz4p0/RSV.mp4?updatedAt=1737404326569',
    'https://ik.imagekit.io/br3koz4p0/COPD%20DE%20.mp4?updatedAt=1737404265162',
    'https://ik.imagekit.io/br3koz4p0/quiz.mp4?updatedAt=1737404240008',
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

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

  if (!showQuiz) {
    return (
      <div className="w-full h-[calc(100vh-4rem)]">
        <ReactPlayer
          url={videoUrls[currentVideoIndex]}
          playing={true}
          muted={true}
          height="100%"
          width="100%"
          onEnded={handleEnded}
        />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="w-full max-h-screen max-w-7xl mx-auto p-4 mt-16 mb-48">
      <h2 className="text-3xl text-cyan-300 font-bold mb-4">
        Medizinisches Quiz.
      </h2>
      <div className="mb-8">
        <p className="text-5xl font-bold">{currentQuestion.question}</p>
        <p
          className={`text-xl ${
            timer > 10 ? ' text-gray-100' : 'text-red-400 font-bold'
          } pt-8`}
        >
          Verbleibende Zeit: {timer} Sekunden
        </p>
      </div>
      <div className="space-y-2 flex flex-col">
        {currentQuestion.options.map((option, index) => (
          <div
            key={index}
            className={`w-full p-6 text-5xl font-semibold text-left rounded ${
              showCorrectAnswer && index === currentQuestion.correctAnswer
                ? 'bg-green-500 font-bold'
                : 'bg-cyan-600'
            }`}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Presentaion;
