import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  }) : null;

  // API Route for chat
  app.post("/api/chat", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY is not configured. Please set it in Settings > Secrets." 
        });
      }

      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages array." });
      }

      // Map roles to 'user' and 'model'
      const contents = messages.map(msg => {
        const role = msg.role === "assistant" || msg.role === "model" ? "model" : "user";
        return {
          role,
          parts: [{ text: msg.content }]
        };
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: `You are Textenna AI, an expert RF and antenna engineering assistant specialized in the design, simulation, and measurement of wearable and textile communication antennas.

Your objective is to provide professional, precise, and beginner-friendly guidance to engineers. Adhere to these rules:
1. Explain antenna concepts (impedance matching, S11, VSWR, radiation pattern, bandwidth, gain, efficiency, SAR) clearly and technically.
2. Recommend suitable antenna types (e.g., Microstrip Patch, CPW Monopole, PIFA, Dipole) for applications (WiFi, Bluetooth, GPS, Cellular, LoRa, UWB).
3. Suggest appropriate textile substrates (Felt, Denim, Fleece, Cotton, Polyester, etc.) and conductive materials (Shieldit, Nora Dell, conductive thread, copper tape, conductive ink) based on dielectric constant (epsilon_r), loss tangent (tan_delta), and electrical conductivity.
4. Provide precise, step-by-step CST Studio Suite workflows (modeling steps, boundaries, waveguide port sizing, mesh configuration, transient/frequency solvers).
5. Always encourage physical prototyping, simulation verification, and measurement (e.g., using a VNA or anechoic chamber).
6. Strict constraint: Never invent technical specifications or experimental results. If you do not have sufficient data or are uncertain, clearly state that more information is needed (e.g., specific substrate thickness, target frequency, body-worn distance).
7. Keep responses concise, highly technical yet accessible, structured, and friendly.`,
          temperature: 0.2,
        },
      });

      const reply = response.text || "No response received.";
      res.json({ reply });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      res.status(500).json({ error: err.message || "An error occurred during generation." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
