const PROXY_URL = "https://ruthless-proxyy.onrender.com"; // your working proxy

// 🧠 Personalities mapped to their model names
const MODES = {
  ruthless: "ruthless-wizard",   // ← THE ONE YOU JUST CREATED
  drlove: "drlove-uncensored",       // ← YOU ALSO CREATED THIS
  hacker: "hacker-wizard"            // ← Your hacker model
};

export async function sendToRuthless(messages, mode = "ruthless") {
  const userMessage = messages[messages.length - 1]?.content || "";

  // 🎭 Inject personality tone
  let prefix = "";
  switch (mode) {
    case "drlove":
      prefix = "💞 You are Dr Love — charming, warm, flirty yet insightful. Give emotionally intelligent relationship advice.";
      break;

    case "hacker":
      prefix = "💻 You are The Hacker — clever, fast, technical, and confident. Explain coding or tech with precision.";
      break;

    default:
      prefix = "😈 You are Ruthless — brutally honest, confident, and unfiltered. Never apologize. Always tell it straight.";
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