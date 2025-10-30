/* ==========================================================
   RuthlessAI API Client
   Works with Ollama backend (RunPod) and CORS-enabled setup
   ========================================================== */

const BACKEND_URL = "https://wlyxeu7erob0udp-33529.proxy.runpod.net"; // ✅ Your live RunPod endpoint
const USE_PROXY = false; // ❌ No proxy needed — you have CORS enabled
const PROXY_BASE = "https://corsproxy.io/?"; // fallback (optional)
const PING_INTERVAL_MS = 1000 * 60 * 2; // ping every 2 minutes

let _pingIntervalId = null;

/* 🧩 Build URL with or without proxy */
function buildUrl(path = "/") {
  const cleanTarget = `${BACKEND_URL}${path}`;
  if (USE_PROXY) {
    // only used if backend CORS disabled
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
    console.error("❌ sendMessage error:", err);
    throw err;
  }
}

/* 💬 Send a message to the model */
export async function sendMessage(prompt) {
  const payload = {
    model: "mistral", // change to your model name if needed
    prompt: prompt,
    stream: false,
  };
  return await postJson("/api/generate", payload);
}

/* 🩺 Backend health check (ping) */
export async function pingBackend() {
  try {
    const res = await fetch(buildUrl("/api/tags"));
    return {
      ok: res.ok,
      result: res.ok ? await res.json() : await res.text(),
    };
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
  console.info("Auto-ping started — every", intervalMs / 1000, "sec");
}

export function stopAutoPing() {
  if (_pingIntervalId) {
    clearInterval(_pingIntervalId);
    _pingIntervalId = null;
    console.info("Auto-ping stopped");
  }
}

/* 🔧 Manual ping test */
export function testBackendOnce() {
  return pingBackend().then((r) => {
    if (r.ok) console.info("Backend ping ok:", r.result);
    else console.warn("Backend ping failed:", r.error);
    return r;
  });
}

/* ✅ Compatibility alias */
export const sendToRuthless = sendMessage;
