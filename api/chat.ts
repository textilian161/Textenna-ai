import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured."
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Invalid messages array."
      });
    }

    const contents = messages.map((msg: any) => ({
      role:
        msg.role === "assistant" || msg.role === "model"
          ? "model"
          : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: `You are Textenna AI, an expert RF and wearable textile antenna assistant.`,
        temperature: 0.2
      }
    });

    res.status(200).json({
      reply: response.text || "No response received."
    });

  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      error: err.message || "Internal Server Error"
    });
  }
}