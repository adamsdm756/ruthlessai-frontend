const PROXY_URL = "https://ruthless-proxyy.onrender.com";

export async function sendToRuthless(messages) {
  const userMessage = messages[messages.length - 1]?.content || "";

  const response = await fetch(`${PROXY_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: userMessage })
  });

  const data = await response.json();

  // Ollama returns `data.response` not `data.reply`
  return data.response || data.message || "No response from model.";
}
