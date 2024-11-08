import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import questions from './quiz.json';

const MedicalQuizSlider = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [timer, setTimer] = useState(25);
  const [showQuiz, setShowQuiz] = useState(false);

  // Quiz timer logic
  useEffect(() => {
    let timerId;

    if (showQuiz) {
      if (timer > 0) {
        timerId = setTimeout(() => setTimer(timer - 1), 1000);
      } else {
        // Move to next question or reset after last question
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setShowCorrectAnswer(false);
          setTimer(25);
        } else {
          setCurrentQuestionIndex(0);
          setShowCorrectAnswer(false);
          setTimer(25);
          setShowQuiz(false); // Return to video if quiz restarts
        }
      }
    }

    return () => clearTimeout(timerId);
  }, [timer, showQuiz, currentQuestionIndex]);

  useEffect(() => {
    // Show correct answer briefly before moving to the next question
    if (timer === 5 && !showCorrectAnswer) {
      setShowCorrectAnswer(true);
    }
  }, [timer, showCorrectAnswer]);

  // Video URLs and playback handling
  const videoUrls = [
    'https://res.cloudinary.com/dokftel0w/video/upload/v1729699908/intro-2_tmuecj.mp4',
    // 'https://res.cloudinary.com/dokftel0w/video/upload/v1730449526/Infectious_Disease.mp4',
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleEnded = () => {
    if (currentVideoIndex < videoUrls.length - 1) {
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    } else {
      // If the last video has finished, show the quiz
      setShowQuiz(true);
    }
  };

  // Render video player or quiz based on showQuiz state
  if (!showQuiz) {
    return (
      <div className="w-fit ml-16 h-screen">
        <ReactPlayer
          url={videoUrls[currentVideoIndex]}
          playing={true}
          muted={true}
          height="95%"
          width="100%"
          onEnded={handleEnded}
        />
      </div>
    );
  }

  // Quiz display
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="w-full max-h-screen max-w-4xl mx-auto p-4 mt-16">
      <h2 className="text-3xl text-cyan-300 font-bold mb-4">
        Medizinisches Quiz.
      </h2>
      <div className="mb-8">
        <p className="text-4xl font-bold">{currentQuestion.question}</p>
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
            className={`w-full p-6 text-4xl font-semibold text-left rounded ${
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

export default MedicalQuizSlider;
