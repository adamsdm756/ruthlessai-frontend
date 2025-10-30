// ✅ RuthlessAI API client (CORS-safe version)
// Connects frontend → RunPod backend + keep-alive ping

// 🔧 Hardcoded backend URL (temporary)
const OLLAMA_URL = "https://wlxeu7erob0udp-11434.proxy.runpod.net";

// 🌐 CORS-safe proxy (for testing only)
const PROXY = "https://api.allorigins.win/raw?url=";

// 🧠 Send message to backend
export async function sendToRuthless(message) {
  try {
    const url = `${PROXY}${encodeURIComponent(`${OLLAMA_URL}/api/chat`)}`;

    const response = await fetch(url, {
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
    return "⚠️ Failed to reach RuthlessAI backend (CORS issue).";
  }
}

// 🔄 Keep backend awake
export function startKeepAlive() {
  const PING_INTERVAL = 1000 * 60 * 2; // every 2 minutes
  const pingUrl = `${PROXY}${encodeURIComponent(`${OLLAMA_URL}/api/health`)}`;

  setInterval(async () => {
    try {
      const ping = await fetch(pingUrl, { method: "GET" });
      if (ping.ok) console.log("✅ Pinged backend to keep it awake");
      else console.warn("⚠️ Backend ping failed:", ping.status);
    } catch (err) {
      console.warn("⚠️ Keep-alive ping failed:", err.message);
    }
  }, PING_INTERVAL);
}

export { OLLAMA_URL };
