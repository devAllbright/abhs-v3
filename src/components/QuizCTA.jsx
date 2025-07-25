import React from 'react'

export default function QuizCTA() {
  return (
    <div className="quiz-container">
      <div className="quiz">
        <div className="quiz__content">
          <div className="quiz__name">
            <p>QUIZ</p>
          </div>
          <div className="quiz__title">
            <p>Not sure about what to choose?</p>
          </div>
          <div className="quiz__description">
            <p>Allbright offers a wide range of services—from 
               deep cleans to ongoing maintenance—and this quick 
               quiz helps match you with the perfect bundle.</p>
          </div>
          <div className="quiz__cta">
            <a href="#" className="primary-cta">Take the Quiz</a>
          </div>
        </div>
        <div className="quiz__img">
          <img src="/quiz-girl.png" alt="Quiz Girl" />
        </div>
      </div>
    </div>
  )
}
