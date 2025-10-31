export async function sendToRuthless(messages) {
  try {
    const lastMessage = messages[messages.length - 1].content;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: lastMessage }),
    });

    const data = await res.json();
    return data.reply || "No response.";
  } catch (err) {
    console.error("🔥 API error:", err);
    return "Connection failed to Ruthless Core.";
  }
}
