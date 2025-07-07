import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {
  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert('Sorry, your browser does not support Text to Speech');
    }
  };

  return mockInterviewQuestion && (
    <div className="p-5 border-4 mt-20 rounded-xl border-[#FBB6CE] bg-[#FFF9DB] my-10">
      {/* Question navigation bubbles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockInterviewQuestion.map((_, index) => (
          <h2
            key={index}
            className={`p-2 border-2 rounded-full text-xs md:text-sm text-center transition-all cursor-pointer
              ${activeQuestionIndex === index
                ? 'bg-[#F687B3] text-white border-[#F687B3]'
                : 'bg-white text-[#4B2E2E] border-[#FBB6CE]'}`}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>

      {/* Active question */}
      <div className="mt-6 flex items-start gap-3">
        <h2 className="font-semibold text-[#4B2E2E] text-md md:text-lg max-w-4xl">
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>
        <Volume2
          className="text-[#F687B3] cursor-pointer hover:scale-110 transition"
          onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}
        />
      </div>

      {/* Note Box */}
      <div className="border-2 border-[#F687B3] rounded-xl p-5 bg-[#FBB6CE] mt-12 shadow-sm">
        <h2 className="flex gap-2 items-center text-white font-semibold text-md">
          <Lightbulb />
          Note
        </h2>
        <p className="text-white mt-2 text-sm leading-relaxed">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE}
        </p>
      </div>
    </div>
  );
}

export default QuestionsSection;
