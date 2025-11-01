const PROXY_URL = "https://ruthless-proxy.onrender.com"; // your working proxy

export async function sendToRuthless(prompt) {
  try {
    const response = await fetch(`${PROXY_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistral",    // if you switch to llava, change here
        prompt: prompt,
        stream: false
      })
    });

    const data = await response.json();

    // Normalize response formats (works for all Ollama setups)
    return data.response || data.message?.content || data.output || "";
  } catch (err) {
    console.error("RUTHLESS ERROR:", err);
    return "Connection failed. Backend might be asleep or blocked.";
  }
}
