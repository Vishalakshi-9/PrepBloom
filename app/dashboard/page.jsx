import { UserButton } from '@clerk/nextjs';
import React from 'react';
import AddNewInterview from './_components/AddNewInterview';
import InterviewList from './_components/InterviewList';

function DashBoard() {
  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#4B2E2E] px-6 py-10 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-[#4B2E2E]">🌸 Dashboard</h2>
          <p className="text-[#7D5A5A] text-lg">
            Prepare and Bloom in your Interview using <span className="font-semibold">PrepBloom</span>
          </p>
        </div>
      </div>

      {/* Add New Interview */}
      <div className="my-8">
        <div className=" border border-[#FFE0B2] p-6 rounded-2xl shadow-sm hover:border-0">
          <AddNewInterview />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#FBB6CE] my-10"></div>

      {/* Interview List */}
      <div className="bg-white border border-[#FBB6CE] p-6 rounded-2xl shadow-sm">
        <InterviewList />
      </div>
    </div>
  );
}

export default DashBoard;
