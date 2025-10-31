import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const OLLAMA_API = "https://wlxeu7erob0udp-11434.proxy.runpod.net";

/* 🔥 Health check endpoint */
app.get("/api/ping", async (req, res) => {
  try {
    const r = await fetch(`${OLLAMA_API}/api/tags`);
    res.json({ ok: r.ok });
  } catch (err) {
    res.status(503).json({ ok: false, error: err.message });
  }
});

/* 💬 Generate response */
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt?.trim()) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    const ollamaRes = await fetch(`${OLLAMA_API}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "ruthless:latest",
        prompt,
        stream: false,
      }),
    });

    if (!ollamaRes.ok) {
      return res.status(500).json({ error: "Model request failed" });
    }

    const data = await ollamaRes.json();
    res.json({ reply: data.response });

  } catch (err) {
    console.error("🔥 generate error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Server running on http://localhost:${PORT}`));
