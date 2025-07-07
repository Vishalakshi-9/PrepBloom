// gemini-demo.js

// 1. Install dependencies before running:
//    npm install @google/genai mime

import { GoogleGenAI } from "@google/genai";

// 2. Set your Gemini API key as an environment variable before running this script:
//    export GEMINI_API_KEY=your_actual_gemini_api_key

async function main() {
  // Initialize Gemini client with your API key
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

  // Choose the Gemini model
  const model = "gemini-2.5-flash";

  // Build the prompt as a simple string (or use a more structured prompt if needed)
  const prompt = `Job position: full stack developer, Job Description: "node,react,mysql,nextjs", Years of Experience: "5", Depends on Job Position, Job Description & Years of Experience give us "5" Interview question along with Answer in JSON format, Give us question and answer field on JSON`;

  // Generate content (interview questions and answers)
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    // Optional config:
    // config: {
    //   maxOutputTokens: 1024,
    //   temperature: 0.7,
    // },
  });

  // Output the response text (should be a JSON string with questions and answers)
  console.log(response.text);
}

main().catch((err) => {
  console.error("Error running Gemini script:", err);
});
