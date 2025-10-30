const OLLAMA_URL = "https://wlxeu7erob0udp-11434.proxy.runpod.net";

/**
 * Send conversation to RuthlessAI and get a reply.
 * @param {Array} messages - Array of { role: 'user'|'ai', content: string }
 * @returns {Promise<string>}
 */
export async function sendToRuthless(messages) {
  try {
    const formattedMessages = messages.map((msg) => ({
      role: msg.role === "ai" ? "assistant" : "user",
      content: msg.content,
    }));

    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "ruthless",
        messages: formattedMessages,
        stream: false,
      }),
    });

    if (!response.ok) throw new Error(`Ollama backend error: ${response.status}`);
    const data = await response.json();
    return data.message?.content?.trim() || "No response from RuthlessAI.";
  } catch (err) {
    console.error("🔥 Connection error:", err);
    return "⚠️ Failed to reach RuthlessAI backend.";
  }
}
