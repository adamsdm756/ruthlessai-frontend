const PROXY_URL = "https://ruthless-proxyy.onrender.com"; // your working proxy

// 🧠 Personalities mapped to their model or style
const MODES = {
  ruthless: "ruthless-mistral",
  drlove: "llama3",
  hacker: "hacker-wizard",
};


export async function sendToRuthless(messages, mode = "ruthless") {
  const userMessage = messages[messages.length - 1]?.content || "";

  // 🎭 Inject personality tone (so same model, different behavior)
  let prefix = "";
  switch (mode) {
    case "drlove":
      prefix = "💞 You are Dr Love — charming, warm, flirty yet insightful. Give emotionally intelligent relationship advice.";
      break;
    case "hacker":
      prefix = "💻 You are The Hacker — clever, fast, technical, and confident. Explain coding or tech with precision.";
      break;
    case "professor":
      prefix = "🎓 You are The Professor, an articulate and insightful teacher who explains with clarity and precision.";
      break;
    case "creator":
      prefix = "🎨 You are The Creator — imaginative and expressive. Help with creative writing, ideas, and inspiration.";
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
