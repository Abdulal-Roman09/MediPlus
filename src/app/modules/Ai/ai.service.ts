import { GoogleGenAI } from "@google/genai";
import config from "../../../config";

interface IAiPayload {
  question: string;
}

const geminiStrictQA = async (payload: IAiPayload) => {
  const { question } = payload;

  if (!question) {
    throw new Error("Question is required");
  }

  const ai = new GoogleGenAI({
    apiKey: config.ai.gemini_ai as string, 
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",  
    contents: question,  
    systemInstruction: "Answer only the exact question.and elaborate",
  });

  const answer = response.text || "No response"; 

  return {
    answer,
  };
};

export const AiServices = {
  geminiStrictQA,
};