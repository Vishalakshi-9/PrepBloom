"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [JobPosition, setJobPosition] = useState("");
  const [JobDesc, setJobDesc] = useState("");
  const [JobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const InputPrompt = `
Job position: ${JobPosition}
Job Description: ${JobDesc}
Years of Experience: ${JobExperience}
Based on the above, generate 2 interview questions with answers in JSON format.
Respond ONLY with a valid JSON array in this format: [{ "question": "...", "answer": "..." }]
No explanation, no markdown, no comments, no extra text.
`;

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key is missing.");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const result = await model.generateContent(InputPrompt);
      const rawText = await result.response.text();

      let cleaned = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const arrayMatch = cleaned.match(/\[\s*{[\s\S]*?}\s*\]/);
      let jsonString = arrayMatch ? arrayMatch[0] : cleaned;

      jsonString = jsonString
        .replace(/[\r\n]+/g, " ")
        .replace(/\\"/g, '"')
        .replace(/[“”]/g, '"')
        .replace(/,\s*([}\]])/g, "$1")
        .replace(/[\u0000-\u001F]+/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();

      const parsed = JSON.parse(jsonString);

      const resp = await db.insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(parsed),
          jobPosition: JobPosition,
          jobDesc: JobDesc,
          jobExperience: JobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY"),
        }).returning({ mockId: MockInterview.mockId });

      if (resp) {
        setOpenDialog(false);
        router.push("/dashboard/interview/" + resp[0]?.mockId);
      }

    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-8 border border-[#FBB6CE] rounded-xl bg-[#FFF9DB] hover:scale-105 hover:shadow-lg cursor-pointer transition-all text-center"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg font-semibold text-[#D94878]">+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl bg-[#FFF5F7] border border-[#FBB6CE]">
          <DialogHeader>
            <DialogTitle className="text-[#4B2E2E]">
              🌸 Ready to Bloom in Your Interview?
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div className="space-y-5 mt-4">
                  <div>
                    <label className="text-sm font-medium text-[#7D5A5A]">
                      Job Role / Position
                    </label>
                    <Input
                      placeholder="e.g., Full Stack Developer"
                      required
                      value={JobPosition}
                      onChange={(e) => setJobPosition(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#7D5A5A]">
                      Short Job Description / Tech Stack
                    </label>
                    <Textarea
                      placeholder="e.g., React, Node.js, MongoDB"
                      required
                      value={JobDesc}
                      onChange={(e) => setJobDesc(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#7D5A5A]">
                      Years of Experience
                    </label>
                    <Input
                      type="number"
                      placeholder="e.g., 0"
                      required
                      value={JobExperience}
                      onChange={(e) => setJobExperience(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#FBB6CE] text-white hover:bg-[#F687B3]"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
