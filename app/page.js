// import { Button } from "@/components/ui/button";
// import Image from "next/image";

// export default function Home() {
//   return (
//     <div>
//       <h2> My Nextjs project!!</h2>
//       <Button>Like it!</Button>
//     </div>
//   );
// }

"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-[#FFF5F7] text-[#4B2E2E] overflow-x-hidden font-sans">

      {/* Floating pastel blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-[#FBB6CE] opacity-30 rounded-full blur-3xl animate-slow-float" />
      <div className="absolute bottom-16 right-16 w-72 h-72 bg-[#FFE0B2] opacity-30 rounded-full blur-3xl animate-slow-float" />

      {/* Hero Section */}
      <header className="w-full py-16 px-6 flex flex-col items-center bg-gradient-to-b from-[#FFF9DB] to-[#FFF5F7] shadow-md z-10 relative rounded-b-[2rem] border-b border-[#FBB6CE]">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={90}
          height={90}
          className="mb-4"
        />
        <h1 className="text-5xl md:text-6xl font-extrabold mb-3 text-center text-[#4B2E2E] leading-tight drop-shadow-sm">
          PrepBloom 🌸
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-5 text-center text-[#7D5A5A]">
          Your Personal AI Interview Coach
        </h2>
        <p className="text-lg text-[#7D5A5A] mb-6 text-center max-w-xl">
          Practice real interview questions and get instant feedback — in a soft, supportive environment.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/dashboard">
            <button className="px-6 py-2 bg-[#FBB6CE] text-white rounded-full font-semibold hover:bg-[#F687B3] transition shadow-md cursor-pointer">
              🌸 Get Started
            </button>
          </Link>
          <a href="#about" scroll={false}>
            <button className="px-6 py-2 bg-white text-[#4B2E2E] border border-[#FBB6CE] rounded-full font-semibold hover:bg-[#FFF9DB] transition shadow-sm cursor-pointer">
              💡 Learn More
            </button>
          </a>
        </div>
      </header>

      {/* Feature Highlights */}
      <section className="w-full bg-white py-16 px-6 flex flex-col items-center gap-10 text-center">
        <h2 className="text-3xl font-bold text-[#4B2E2E]">Why You'll Love PrepBloom</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl">
          {[
           { title: "Cozy & Friendly Vibes", bg: "#FBB6CE" },
{ title: "Completely Free to Use", bg: "#FFE0B2" },
{ title: "Simple & Intuitive UI", bg: "#FFF9DB" },
{ title: "Real-Time AI Feedback", bg: "#D8B4FE" },

          ].map(({ title, bg }, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 text-lg font-semibold shadow-sm"
              style={{ backgroundColor: bg, color: "#4B2E2E" }}
            >
              {title}
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="about" className="w-full bg-[#FFF5F7] py-20 px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-6 text-[#4B2E2E]">How It Works</h2>
        <p className="text-[#7D5A5A] mb-12 max-w-xl mx-auto">
          Just 3 easy steps to prep like a pro 💼✨
        </p>
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-10 max-w-5xl mx-auto">
          {[
            { icon: "📝", title: "Write Prompt", desc: "Choose your job role or skills" },
            { icon: "✏️", title: "Customize", desc: "Edit mock questions to fit your need and unlimited attempts" },
            { icon: "🔗", title: "Practice & Share", desc: "Get AI feedback and keep growing" },
          ].map(({ icon, title, desc }, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md p-6 w-full max-w-xs hover:shadow-xl transition border border-[#FBB6CE]">
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-xl font-semibold text-[#4B2E2E] mb-2">{title}</h3>
              <p className="text-sm text-[#7D5A5A]">{desc}</p>
            </div>
          ))}
        </div>
        <Link href="/dashboard">
          <button className="mt-10 px-8 py-3 bg-[#FBB6CE] text-white font-bold rounded-full hover:bg-[#F687B3] transition shadow-lg cursor-pointer">
            🌸 Start Practicing Now
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gradient-to-t from-[#FFF9DB] to-[#FFF5F7] text-center py-10 px-6">
        <p className="text-[#7D5A5A] mb-2">Made with 🌷 by Vishalakshi</p>
        <p className="text-sm text-[#B08989]">© 2025 PrepBloom. All rights reserved.</p>
      </footer>
    </main>
  );
}
