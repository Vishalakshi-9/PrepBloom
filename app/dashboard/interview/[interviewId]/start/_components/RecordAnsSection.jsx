"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { toast } from 'sonner';
import { GoogleGenAI } from "@google/genai";
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import moment from 'moment';

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

function RecordAnsSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  // Update userAnswer with the latest transcript
  useEffect(() => {
    setUserAnswer(results.map(r => r.transcript).join(' '));
  }, [results]);

  // Auto-submit after recording stops, only once per session
  useEffect(() => {
    if (!isRecording && userAnswer.length > 10 && !submitted) {
      setSubmitted(true);
      UpdateUserAnswer();
    }
    // eslint-disable-next-line
  }, [isRecording]);

  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      setUserAnswer('');
      setResults([]);
      setSubmitted(false); // Reset for new recording
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    if (!userAnswer || userAnswer.length < 10) {
      toast.error("Please record a longer answer.");
      return;
    }
    if (!user?.primaryEmailAddress?.emailAddress) {
      toast.error("User email is missing.");
      return;
    }
    setLoading(true);

    const feedbackPrompt = `
Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}
User Answer: ${userAnswer}
Based on the above, provide a rating (out of 5) and 2-3 lines of feedback for improvement in JSON format:
{ "rating": "x", "feedback": "..." }
Respond ONLY with valid JSON. No extra text.
`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: feedbackPrompt,
      });
      const rawText = response.text;
      const cleaned = rawText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      let JsonFeedbackResp;
      try {
        JsonFeedbackResp = JSON.parse(cleaned);
      } catch (err) {
        // Try to extract JSON substring if parsing fails
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (match) {
          JsonFeedbackResp = JSON.parse(match[0]);
        } else {
          toast.error("Could not parse AI feedback. Try again.");
          setLoading(false);
          return;
        }
      }

      // Validate required fields before insert
      if (!interviewData?.mockId || !mockInterviewQuestion[activeQuestionIndex]?.question || !user?.primaryEmailAddress?.emailAddress) {
        toast.error("Missing required data for saving answer.");
        setLoading(false);
        return;
      }

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData.mockId,
        question: mockInterviewQuestion[activeQuestionIndex].question,
        correctAns: mockInterviewQuestion[activeQuestionIndex].answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user.primaryEmailAddress.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
      });

      if (resp) {
        toast.success('User Answer recorded successfully!');
        setUserAnswer('');
        setResults([]);
      } else {
        toast.error('Failed to insert answer into database.');
      }
    } catch (err) {
      toast.error('Error getting feedback from AI or saving to DB');
      console.error(err);
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
