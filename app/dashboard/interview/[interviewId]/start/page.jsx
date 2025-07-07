"use client";
import React, { useEffect, useState } from "react";
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnsSection from "./_components/RecordAnsSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function StartInterview({ params }) {
  const [interviewId, setInterviewId] = useState(null);
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    async function unwrapParams() {
      const resolved = await params;
      setInterviewId(resolved.interviewId);
    }
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!interviewId) return;
    const getInterviewDetails = async (id) => {
      const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, id));
      if (result && result.length > 0 && result[0].jsonMockResp) {
        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
      } else {
        console.warn('No interview data found or jsonMockResp missing.');
      }
    };
    getInterviewDetails(interviewId);
  }, [interviewId]);

  return (
    <div className="p-6 md:p-10 bg-[#FFF5F7] min-h-screen text-[#4B2E2E] font-sans">
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
        {/* Questions Section */}
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        {/* Record Answer Section */}
        <RecordAnsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-4 justify-center md:justify-end mt-10">
        {activeQuestionIndex > 0 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
            className="bg-[#FFF9DB] text-[#4B2E2E] border border-[#FBB6CE] hover:bg-[#FEEBCB] rounded-full px-6 py-2 shadow-sm"
          >
            ← Previous Question
          </Button>
        )}

        {activeQuestionIndex === mockInterviewQuestion?.length - 1 && (
          <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
            <Button className="bg-[#FBB6CE] text-white hover:bg-[#F687B3] rounded-full px-6 py-2 shadow-md">
              🌸 End Interview
            </Button>
          </Link>
        )}

        {activeQuestionIndex !== mockInterviewQuestion?.length - 1 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
            className="bg-[#FFF9DB] text-[#4B2E2E] border border-[#FBB6CE] hover:bg-[#FEEBCB] rounded-full px-6 py-2 shadow-sm"
          >
            Next Question →
          </Button>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
