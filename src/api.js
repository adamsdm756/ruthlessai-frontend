/* src/api.js
   Full client-side API module with keep-alive ping.
   Replace BACKEND_URL with your RunPod/ollama proxy URL or real backend.
   Optionally use a public CORS proxy (temporary only).
*/

const BACKEND_URL = process.env.VITE_BACKEND_URL || "https://wlxeu7erob0udp-33529.proxy.runpod.net";
const USE_PROXY = process.env.VITE_USE_PROXY === "true" || true; // flip to false if backend has CORS configured
const PROXY_BASE = "https://corsproxy.io/?"; // temporary CORS proxy (use only until you enable CORS on backend)
const PING_INTERVAL_MS = 1000 * 60 * 2; // 2 minutes - adjust if you like

function buildUrl(path = "/") {
  const target = `${BACKEND_URL.replace(/\/$/, "")}${path}`;
  if (USE_PROXY) {
    // corsproxy.io expects the target URL encoded after `?`
    return `${PROXY_BASE}${encodeURIComponent(target)}`;
  }
  return target;
}

/** Generic POST helper */
async function postJson(url, body, extraHeaders = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    // try to get text for debugging
    let text = "";
    try { text = await res.text(); } catch (e) {}
    const err = new Error(`HTTP ${res.status}: ${res.statusText} - ${text}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }

  const contentType = res.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  // fallback - return text
  return res.text();
}

/**
 * Send a chat message to the backend
 * message: string
 * opts: { model?: string, streaming?: boolean }  // streaming not implemented here
 */
export async function sendMessage(message, opts = {}) {
  const url = buildUrl("/api/chat");
  const body = {
    model: opts.model || "mistral",
    messages: [{ role: "user", content: message }],
  };

  try {
    const data = await postJson(url, body);
    return data;
  } catch (err) {
    console.error("sendMessage error:", err);
    throw err;
  }
}

/**
 * Lightweight ping endpoint call - used to keep RunPod / container alive
 * Returns true if backend responded OK, false otherwise (doesn't throw).
 */
export async function pingBackend() {
  const url = buildUrl("/api/ping");
  try {
    // some backends expect GET here - cors proxies may require GET or POST.
    // use POST with tiny JSON for consistency.
    const result = await postJson(url, { ping: true });
    return { ok: true, result };
  } catch (err) {
    console.warn("pingBackend failed:", err);
    return { ok: false, error: err };
  }
}

/* Auto-ping control (so you can start/stop from React lifecycle) */
let _pingIntervalId = null;

export function startAutoPing(intervalMs = PING_INTERVAL_MS) {
  if (_pingIntervalId) return; // already running
  // do an immediate ping first
  pingBackend().then(r => {
    if (!r.ok) console.info("initial ping failed (still starting backend?)", r.error);
  });
  _pingIntervalId = setInterval(async () => {
    const r = await pingBackend();
    if (!r.ok) {
      console.debug("auto-ping failed:", r.error && r.error.message);
    } else {
      console.debug("auto-ping ok");
    }
  }, intervalMs);
  console.info("Auto-ping started, interval:", intervalMs);
}

export function stopAutoPing() {
  if (_pingIntervalId) {
    clearInterval(_pingIntervalId);
    _pingIntervalId = null;
    console.info("Auto-ping stopped");
  }
}

/* Helpful function for debugging */
export function testBackendOnce() {
  return pingBackend().then(r => {
    if (r.ok) {
      console.info("Backend ping ok:", r.result);
    } else {
      console.warn("Backend ping failed:", r.error);
    }
    return r;
  });
}
