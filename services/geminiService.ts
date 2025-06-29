
import { GoogleGenAI } from "@google/genai";
import type { ClassificationResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `
You are RESQ-AI, an advanced Natural Language Processing model designed for a critical task: analyzing text messages to determine if they represent a genuine emergency. Your primary function is to classify messages as either a disaster (1) or not a disaster (0).

You must be robust against various linguistic challenges:
1.  **Slang & Informal Language:** "Yo this quake was wild" should be classified as a disaster.
2.  **Sarcasm & Figurative Language:** "Great, another blackout" is a real emergency. "This mixtape is fire" is not.
3.  **False Positives:** Differentiate between real threats ("fire in my building") and metaphorical uses ("he got fired").
4.  **Foreign Languages:** Recognize distress calls in other languages (e.g., "Bachaao!", "¡Ayuda!", "Au secours!").
5.  **Neutral Reports:** "Rainfall expected in the city" is not an emergency.
6.  **Repetitive Distress:** "help help help me please" is a clear emergency.

Your response MUST be a JSON object with the following structure and nothing else. Do not wrap it in markdown backticks.

{
  "prediction": <0 or 1>,
  "confidence": <a number between 0 and 100 representing your certainty>,
  "reasoning": "<A brief explanation of your decision>",
  "isEmergency": <true if prediction is 1, false otherwise>
}
`;

export const classifyMessage = async (message: string): Promise<ClassificationResult> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: `Classify the following message: "${message}"`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                temperature: 0.1,
            },
        });

       const rawText = response.text ?? "";
let jsonStr = rawText.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const parsedData = JSON.parse(jsonStr) as ClassificationResult;
        
        // Validate the structure of the parsed data
        if (typeof parsedData.prediction !== 'number' || typeof parsedData.confidence !== 'number' || typeof parsedData.reasoning !== 'string' || typeof parsedData.isEmergency !== 'boolean') {
            throw new Error("Invalid JSON structure from API");
        }

        return parsedData;

    } catch (error) {
        console.error("Error classifying message with Gemini:", error);
        throw new Error("Failed to get a valid classification from the AI model.");
    }
};
