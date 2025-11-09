const PROXY_URL = "https://ruthless-proxyy.onrender.com"; // your working proxy

// 🧠 Personalities mapped to their model or style
const MODES = {
  ruthless: "ruthless-mistral", // Your default aggressive / no-filter model
  drlove: "ruthless-mistral",    // Reuses model, prompt tuned for romantic/advice
  hacker: "ruthless-mistral",    // Techie persona
  professor: "ruthless-mistral", // Smart, explanatory
  creator: "ruthless-mistral",   // Creative / idea mode
};

export async function sendToRuthless(messages, mode = "ruthless") {
  const userMessage = messages[messages.length - 1]?.content || "";

  // 🎭 Inject personality tone (so same model, different behavior)
  let prefix = "";
  switch (mode) {
    case "drlove":
      prefix = "💞 You are Dr. Love, a charming and empathetic AI who gives emotional, romantic, or relationship advice in a smooth, warm tone.";
      break;
    case "hacker":
      prefix = "💻 You are The Hacker, a witty and sharp AI who talks in cyberpunk, tech-savvy slang — confident, direct, and clever.";
      break;
    case "professor":
      prefix = "🎓 You are The Professor, an articulate and insightful teacher who explains with clarity and precision.";
      break;
    case "creator":
      prefix = "🎨 You are The Creator, full of imagination and creative energy — your answers should inspire and sound visionary.";
      break;
    default:
      prefix = "😈 You are RuthlessAI — direct, fearless, and raw. No filters, just truth.";
  }

  try {
    const response = await fetch(`${PROXY_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `${prefix}\n\nUser: ${userMessage}`,
        model: MODES[mode],
        stream: false,
      }),
    });

    const data = await response.json();

    if (data.response) return data.response;
    if (data.output?.length) return data.output.map(o => o.content).join(" ");
    if (data.message) return data.message;

    return "⚠️ No valid response from model.";
  } catch (error) {
    console.error("Error fetching from Ollama proxy:", error);
    return "❌ Failed to reach AI server.";
  }
}
