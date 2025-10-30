// src/api.js
// ✅ FINAL WORKING VERSION for RunPod + Render + Ollama backend
// Includes auto-ping, no proxy, correct /api/generate route

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://wlyxeu7erob0udp-33529.proxy.runpod.net"; // your RunPod proxy

const PING_INTERVAL_MS = 1000 * 60 * 2; // every 2 minutes

function buildUrl(path = "/") {
  return `${BACKEND_URL}${path}`;
}

// --- POST helper ---
async function postJson(url, body, extraHeaders = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// --- Send chat messages ---
export async function sendMessage(message) {
  const url = buildUrl("/api/generate"); // ✅ Correct endpoint
  const payload = {
    model: "mistral",
    prompt: message, // generate expects "prompt" not "messages"
  };
  try {
    const result = await postJson(url, payload);
    return result;
  } catch (err) {
    console.error("sendMessage error:", err);
    throw err;
  }
}

// --- Ping backend to keep alive ---
export async function pingBackend() {
  const url = buildUrl("/api/tags");
  try {
    const res = await fetch(url);
    if (res.ok) {
      console.info("✅ Backend alive");
      return true;
    } else {
      console.warn("⚠️ Backend returned:", res.status);
      return false;
    }
  } catch (e) {
    console.warn("⚠️ Ping failed:", e.message);
    return false;
  }
}

let _pingIntervalId = null;
export function startAutoPing(intervalMs = PING_INTERVAL_MS) {
  if (_pingIntervalId) return;
  _pingIntervalId = setInterval(pingBackend, intervalMs);
  console.info("Auto-ping started");
}

export function stopAutoPing() {
  if (_pingIntervalId) {
    clearInterval(_pingIntervalId);
    _pingIntervalId = null;
    console.info("Auto-ping stopped");
  }
}

export const sendToRuthless = sendMessage;
