/* src/api.js
   Full client-side API module with working CORS + proxy fallback
   Replace BACKEND_URL below with your RunPod Ollama proxy URL if needed.
*/

const BACKEND_URL = "https://wlyxeu7erob0udp-33529.proxy.runpod.net"; // ✅ your real backend
const USE_PROXY = true; // set to false after enabling CORS on backend
const PROXY_BASE = "https://corsproxy.io/?"; // temporary proxy
const PING_INTERVAL_MS = 1000 * 60 * 2; // every 2 min auto ping

let _pingIntervalId = null;

/* 🧠 Build full URL for backend or proxy */
function buildUrl(path = "/") {
  const cleanTarget = `${BACKEND_URL}${path}`;
  if (USE_PROXY) {
    // corsproxy.io requires the target URL to be fully encoded
    return `${PROXY_BASE}${encodeURIComponent(cleanTarget)}`;
  }
  return cleanTarget;
}

/* 🚀 Generic POST helper */
async function postJson(path, body) {
  const url = buildUrl(path);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("sendMessage error:", err);
    throw err;
  }
}

/* 💬 Send message to RuthlessAI */
export async function sendMessage(prompt) {
  const payload = {
    model: "mistral",
    prompt: prompt,
    stream: false,
  };
  return await postJson("/api/generate", payload);
}

/* 🩺 Backend health check (ping) */
export async function pingBackend() {
  try {
    const res = await fetch(buildUrl("/api/tags"));
    return { ok: res.ok, result: res.ok ? await res.json() : await res.text() };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/* ♻️ Auto ping to keep backend awake */
export function startAutoPing(intervalMs = PING_INTERVAL_MS) {
  if (_pingIntervalId) return;
  _pingIntervalId = setInterval(() => {
    pingBackend().then((r) =>
      console.info("Auto-ping:", r.ok ? "✅ ok" : "⚠️ fail")
    );
  }, intervalMs);
  console.info("Auto-ping started, every", intervalMs / 1000, "sec");
}

export function stopAutoPing() {
  if (_pingIntervalId) {
    clearInterval(_pingIntervalId);
    _pingIntervalId = null;
    console.info("Auto-ping stopped");
  }
}

/* 🔧 Manual one-time ping (for debug) */
export function testBackendOnce() {
  return pingBackend().then((r) => {
    if (r.ok) console.info("Backend ping ok:", r.result);
    else console.warn("Backend ping failed:", r.error);
    return r;
  });
}

/* ✅ Export alias for compatibility */
export const sendToRuthless = sendMessage;
