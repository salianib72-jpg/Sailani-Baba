
import { GoogleGenAI, Type } from "@google/genai";
import { VideoData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateVideoContent = async (title: string): Promise<VideoData> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Optimize this YouTube video title: "${title}". Generate a viral description, high-ranking hashtags, a virality score (1-100), and a brief analysis.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          optimizedTitle: { type: Type.STRING },
          description: { type: Type.STRING },
          hashtags: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          viralityScore: { type: Type.NUMBER },
          viralityAnalysis: { type: Type.STRING }
        },
        required: ["optimizedTitle", "description", "hashtags", "viralityScore", "viralityAnalysis"]
      }
    }
  });

  const data = JSON.parse(response.text);
  return {
    ...data,
    originalTitle: title
  };
};

export const generateThumbnail = async (base64Image: string, title: string): Promise<string> => {
  // We use gemini-2.5-flash-image for editing/generating images
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType: 'image/png'
          }
        },
        {
          text: `Create a professional 3D YouTube thumbnail. Use the person from this photo as the main subject. Add vibrant, glowing 3D text that says: "${title.toUpperCase()}". The background should be colorful, high-contrast, and ultra-high-definition cinematic style. Make it look viral and professional with lens flares and depth of field.`
        }
      ]
    }
  });

  let imageUrl = '';
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!imageUrl) throw new Error("Could not generate thumbnail image");
  return imageUrl;
};
