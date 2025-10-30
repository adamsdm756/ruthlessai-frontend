// ✅ RuthlessAI API client
// Connects frontend to the RunPod backend + keep-alive ping

const OLLAMA_URL = import.meta.env.VITE_API_URL || "https://wlxeu7erob0udp-11434.proxy.runpod.net";

// 🧩 Send chat message to backend
export async function sendToRuthless(message) {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return data.reply || "⚠️ No response from RuthlessAI.";
  } catch (error) {
    console.error("❌ API error:", error);
    return "⚠️ Failed to reach RuthlessAI backend.";
  }
}

// 🔄 Keep-alive ping to prevent pod sleep
export function startKeepAlive() {
  const PING_INTERVAL = 1000 * 60 * 2; // every 2 minutes

  setInterval(async () => {
    try {
      const ping = await fetch(`${OLLAMA_URL}/api/health`, { method: "GET" });
      if (ping.ok) console.log("✅ Pinged backend to keep it awake");
      else console.warn("⚠️ Backend ping failed:", ping.status);
    } catch (err) {
      console.warn("⚠️ Keep-alive ping failed:", err.message);
    }
  }, PING_INTERVAL);
}

export { OLLAMA_URL };
