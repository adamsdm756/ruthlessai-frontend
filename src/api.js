export async function sendToRuthless(messages) {
  try {
    const last = messages[messages.length - 1].content;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "ruthless:latest",
        prompt: last,
      }),
    });

    const data = await res.json();
    return data.response || "No response.";
  } catch (err) {
    console.log("🔥 API ERROR:", err);
    return "Proxy connection failed.";
  }
}

export async function pingRuthless() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tags`);
    return res.ok;
  } catch {
    return false;
  }
}
