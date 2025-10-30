/* ==========================================================
   RuthlessAI Frontend → RunPod Ollama Backend API Client
   ========================================================== */

const BACKEND_URL = "https://wlxeu7erob0udp-11434.proxy.runpod.net"; // ✅ your RunPod Ollama endpoint
const USE_PROXY = false; // ❌ not needed — CORS is enabled on backend
const PROXY_BASE = "https://corsproxy.io/?"; // optional fallback
const PING_INTERVAL_MS = 1000 * 60 * 2; // ping every 2 minutes to keep pod awake

let _pingIntervalId = null;

/* 🧩 Build URL (optionally with proxy) */
function buildUrl(path = "/") {
  const target = `${BACKEND_URL}${path}`;
  return USE_PROXY ? `${PROXY_BASE}${encodeURIComponent(target)}` : target;
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
    console.error("❌ postJson error:", err);
    throw err;
  }
}

/* 💬 Send prompt to the model */
export async function sendMessage(prompt) {
  const payload = {
    model: "ruthless:latest", // ✅ your custom model
    prompt,
    stream: false, // no streaming for now
  };
  return await postJson("/api/generate", payload);
}

/* 🩺 Health check (ping backend) */
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

/* ♻️ Auto-ping to keep backend awake */
export function startAutoPing(intervalMs = PING_INTERVAL_MS) {
  if (_pingIntervalId) return;
  _pingIntervalId = setInterval(() => {
    pingBackend().then((r) =>
      console.info("Auto-ping:", r.ok ? "✅ ok" : "⚠️ fail")
    );
  }, intervalMs);
  console.info("Auto-ping started — every", intervalMs / 1000, "sec");
}

/* 🧹 Stop auto-ping */
export function stopAutoPing() {
  if (_pingIntervalId) {
    clearInterval(_pingIntervalId);
    _pingIntervalId = null;
    console.info("Auto-ping stopped");
  }
}

/* 🧪 Manual ping for debugging */
export function testBackendOnce() {
  return pingBackend().then((r) => {
    if (r.ok) console.info("Backend ping ok:", r.result);
    else console.warn("Backend ping failed:", r.error);
    return r;
  });
}

/* ✅ Alias for older imports */
export const sendToRuthless = sendMessage;
