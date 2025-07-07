import React from 'react';
import Header from './_components/Header';

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#4B2E2E] font-sans">
      {/* Header */}
      <Header />

      {/* Main content area with soft padding */}
      <div className="mx-4 md:mx-16 lg:mx-32 py-10">
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
