import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: message,
    });

    return Response.json({ reply: response.text });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
