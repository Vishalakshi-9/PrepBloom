"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { toast } from 'sonner';
import { GoogleGenerativeAI } from "@google/generative-ai"; // Fixed name
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import moment from 'moment';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

function RecordAnsSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const {
    error,
    results,
    isRecording,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  // Live update the user's spoken answer
  useEffect(() => {
    setUserAnswer(results.map(r => r.transcript).join(' '));
  }, [results]);

  // Auto submit after recording stops
  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      setUserAnswer('');
      setResults([]);
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    setLoading(true);

    const feedbackPrompt = `
    Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}
    User Answer: ${userAnswer}
    Based on the above, provide a rating (out of 5) and 2-3 lines of feedback for improvement in JSON format:
    {"rating": "x", "feedback": "..."}. Only respond with valid JSON.
    `;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(feedbackPrompt);
      const rawText = await result.response.text();

      const cleaned = rawText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleaned);

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: parsed?.feedback,
        rating: parsed?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-YYYY')
      });

      if (resp) {
        toast.success('Your answer and feedback were saved successfully!');
        setUserAnswer('');
        setResults([]);
      }

    } catch (err) {
      console.error(err);
      toast.error(' Failed to get feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      {/* Webcam Section */}
      <div className='relative flex flex-col mt-20 justify-center my-12 items-center bg-[#FFF9DB] rounded-xl border-4 border-[#FBB6CE] shadow-sm'>
        <Image
          src="/webcam.png"
          width={100}
          height={100}
          alt="Webcam illustration"
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 200,
            width: '100%',
            zIndex: 10,
            borderRadius: '1rem'
          }}
        />
      </div>

      {/* Record Button */}
      <Button
        disabled={loading}
        className='mt-4 bg-[#FBB6CE] text-white font-semibold hover:bg-[#F687B3] border border-[#F687B3] rounded-full px-6 py-2 transition flex items-center gap-2'
        onClick={StartStopRecording}
      >
        <Mic className={isRecording ? 'animate-pulse' : ''} />
        {isRecording ? 'Recording...' : ' Record Answer'}
      </Button>
    </div>
  );
}

export default RecordAnsSection;
