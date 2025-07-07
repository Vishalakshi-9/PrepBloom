"use client";
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon, Mic, MicOff } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';

function Interview({ params }) {
    const [interviewId, setInterviewId] = useState(null);
    const [interviewData, setInterviewData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [webcamEnabled, setWebcamEnabled] = useState(false);
    const [micEnabled, setMicEnabled] = useState(false);
    const [micStream, setMicStream] = useState(null);

    const webcamRef = useRef(null);

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
            setLoading(true);
            setError(null);
            try {
                const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, id));
                result && result[0] ? setInterviewData(result[0]) : setError("No interview data found.");
            } catch {
                setError("Failed to fetch interview data.");
            } finally {
                setLoading(false);
            }
        };
        getInterviewDetails(interviewId);
    }, [interviewId]);

    const handleWebcamToggle = () => {
        setWebcamEnabled(prev => !prev);
    };

    const handleMicToggle = async () => {
        if (micEnabled) {
            micStream?.getTracks().forEach(track => track.stop());
            setMicEnabled(false);
            setMicStream(null);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setMicStream(stream);
                setMicEnabled(true);
            } catch {
                alert("Microphone access denied or not available.");
            }
        }
    };

    return (
        <div className="my-10 flex flex-col items-center bg-[#FFF5F7] px-4">
            <h2 className="font-extrabold text-3xl mb-10 text-[#4B2E2E]">🌸 Let’s Get You Interview Ready!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
                {/* Info Card */}
                <div className="flex flex-col gap-5 p-6 rounded-2xl border-2 border-[#FBB6CE] bg-white shadow-md">
                    <div className="p-6 rounded-xl bg-[#FFF9DB] border border-[#FBB6CE]">
                        {loading ? (
                            <div className="text-[#D94878]">Loading your interview...</div>
                        ) : error ? (
                            <div className="text-red-500">{error}</div>
                        ) : (
                            <>
                                <h3 className="text-md font-semibold text-[#4B2E2E]"><strong>Job Role:</strong> {interviewData?.jobPosition}</h3>
                                <h3 className="text-md font-semibold text-[#4B2E2E]"><strong>Tech Stack:</strong> {interviewData?.jobDesc}</h3>
                                <h3 className="text-md font-semibold text-[#4B2E2E]"><strong>Experience:</strong> {interviewData?.jobExperience} year(s)</h3>
                            </>
                        )}
                    </div>

                    <div className="p-5 bg-[#FBB6CE] rounded-xl border border-[#F687B3] text-black shadow-sm">
                        <h2 className="flex items-center gap-2 font-semibold mb-1">
                            <Lightbulb /> Tips & Info
                        </h2>
                        <p className="text-sm">{process.env.NEXT_PUBLIC_INFORMATION}</p>
                    </div>
                </div>

                {/* Webcam & Mic */}
                <div className="flex flex-col items-center justify-center gap-6 mt-4">
                    {webcamEnabled ? (
                        <Webcam
                            ref={webcamRef}
                            mirrored
                            style={{
                                height: 280,
                                width: 280,
                                borderRadius: "1rem",
                                border: "4px solid #FBB6CE",
                            }}
                        />
                    ) : (
                        <WebcamIcon className="h-40 w-40 p-6  bg-[#FFF9DB] border-4 border-[#FBB6CE] rounded-xl" />
                    )}
                    <Button
                        onClick={handleWebcamToggle}
                        className="bg-[#FBB6CE] text-white hover:bg-[#F687B3] px-6 py-3 rounded-full shadow-md transition"
                    >
                        {webcamEnabled ? "Disable Webcam" : "Enable Webcam"}
                    </Button>

                    <div className="flex flex-col items-center gap-3">
                        {micEnabled ? (
                            <Mic className="h-7 w-7 text-[#F687B3] border-2 rounded-full border-[#FBB6CE] p-1" />
                        ) : (
                            <MicOff className="h-7 w-7 text-gray-400 border-2 rounded-full border-gray-300 p-1" />
                        )}
                        <Button
                            onClick={handleMicToggle}
                            className="bg-[#FFF9DB] text-[#4B2E2E] border border-[#FBB6CE] hover:bg-[#FFF1F4] px-6 py-2 rounded-full"
                        >
                            {micEnabled ? "Disable Mic" : "Enable Mic"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Start Interview */}
            <div className="mt-10 w-full max-w-5xl flex justify-end">
                <Link href={`/dashboard/interview/${interviewId}/start`}>
                    <Button className="bg-[#FBB6CE] text-white hover:bg-[#F687B3] rounded-full px-6 py-3 shadow-lg cursor-pointer">
                        Start Interview
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default Interview;
