import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeImage = async (base64Image: string, language: string = 'en'): Promise<AnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const PROMPT = `
      Analyze this food image and provide a nutritional breakdown. 
      Identify all distinct food items, estimate their portion size based on visual cues, and calculate approximate calories and macronutrients (protein, carbs, fat).
      Also estimate key vitamins and minerals present.
      Provide the response in the language: "${language}".
      Also provide a brief, actionable health tip related to this meal in "${language}".
    `;

    // Clean the base64 string if it contains the header
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: PROMPT
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the food item" },
                  portion: { type: Type.STRING, description: "Estimated portion size" },
                  confidence: { type: Type.NUMBER, description: "Confidence score 0-1" },
                  macros: {
                    type: Type.OBJECT,
                    properties: {
                      calories: { type: Type.NUMBER },
                      protein: { type: Type.NUMBER },
                      carbs: { type: Type.NUMBER },
                      fat: { type: Type.NUMBER }
                    },
                    required: ["calories", "protein", "carbs", "fat"]
                  }
                },
                required: ["name", "portion", "macros", "confidence"]
              }
            },
            total: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fat: { type: Type.NUMBER }
              },
              required: ["calories", "protein", "carbs", "fat"]
            },
            micros: {
              type: Type.OBJECT,
              properties: {
                vitamins: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key vitamins found (e.g. Vitamin C)" },
                minerals: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key minerals found (e.g. Iron)" }
              },
              required: ["vitamins", "minerals"]
            },
            healthTip: { type: Type.STRING, description: "A short, positive health tip." }
          },
          required: ["items", "total"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response text from Gemini");
    }

    const result = JSON.parse(response.text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw error;
  }
};
