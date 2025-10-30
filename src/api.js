// src/api.js

const getBaseURL = () => {
  // ✅ If running locally → connect to local Ollama/RunPod backend
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:11434"; // Your local Ollama API
  }

  // ✅ If deployed on Render → connect to your RunPod proxy URL
  return "https://wlxeu7erob0udp-11434.proxy.runpod.net"; // Replace if your RunPod proxy changes
};

const BASE_URL = getBaseURL();

// Main chat API function
export async function sendMessageToRuthless(prompt) {
  try {
    const response = await fetch(`${BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "ruthless", // your Ollama model name
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    const data = await response.json();

    return data.response || data.text || "No response from RuthlessAI.";
  } catch (error) {
    console.error("API Error:", error);
    return "⚠️ Unable to connect to RuthlessAI server.";
  }
}
