const PROXY_URL = "https://ruthless-proxyy.onrender.com";

export async function sendToRuthless(messages) {
  const userMessage = messages[messages.length - 1]?.content || "";

  const response = await fetch(`${PROXY_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: userMessage, model: "ruthless-mistral" }),
  });

  const data = await response.json();

  if (data.response) return data.response;
  if (data.output?.length) return data.output.map((o) => o.content).join(" ");
  if (data.message) return data.message;

  return "⚠️ No valid response from model.";
}
