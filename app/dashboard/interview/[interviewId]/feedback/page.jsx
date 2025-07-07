"use client";
import React, { useEffect, useState } from 'react';
import { eq } from 'drizzle-orm';
import { db } from '@/utils/db';
import { userAnswer } from '@/utils/schema';
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function Feedback({ params }) {
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState([]);

  // Fetch feedback on mount
  useEffect(() => {
    const GetFeedback = async () => {
      const result = await db.select()
        .from(userAnswer)
        .where(eq(userAnswer.mockIdRef, params.interviewId))
        .orderBy(userAnswer.id);
      setFeedbackList(result);
    };

    GetFeedback();
  }, [params.interviewId]);

  // Calculate average rating
  const ratings = feedbackList
    .map(item => Number(item.rating))
    .filter(r => !isNaN(r));

  const overallRating =
    ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
      : "NA";

  return (
    <div className="min-h-screen bg-[#FFF5F7] px-6 md:px-20 py-12 text-[#4B2E2E] font-sans">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-red-400">Congratulations!</h2>
        <p className="text-2xl font-semibold text-[#F687B3] mt-2">Here's your interview feedback:</p>
        <p className="text-lg text-[#4B2E2E] mt-4">
          <strong>Your Overall Rating:</strong> <span className="text-pink-600">{overallRating}/10</span>
        </p>
        <p className="text-sm text-[#7D5A5A] mt-2">Scroll below to see all questions, your answers, correct responses, and improvement tips!</p>
      </div>

      <div className="space-y-6">
        {feedbackList.map((item, index) => (
          <Collapsible key={index} className="border border-[#FBB6CE] rounded-xl shadow-sm bg-white">
            <CollapsibleTrigger className="w-full p-4 flex justify-between items-center text-left font-semibold text-[#4B2E2E] bg-[#FBB6CE] rounded-t-xl hover:bg-[#F687B3] transition">
              {item.question}
              <ChevronDown />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 bg-[#FFF9DB] rounded-b-xl space-y-3">
              <p><strong className="text-[#7D5A5A]">⭐ Rating:</strong> {item.rating}/10</p>
              <p><strong className="text-[#7D5A5A]">Your Answer:</strong> {item.userAns}</p>
              <p><strong className="text-[#7D5A5A]">Correct Answer:</strong> {item.correctAns}</p>
              <p><strong className="text-[#7D5A5A]">Feedback:</strong> {item.feedback}</p>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 bg-[#FBB6CE] text-white rounded-full font-semibold hover:bg-[#F687B3] transition shadow-md"
        >
          ⬅ Go Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

export default Feedback;
