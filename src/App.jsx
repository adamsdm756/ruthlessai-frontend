import React, { useState, useEffect, useRef } from "react";
import { sendToRuthless } from "./api";
import "./App.css";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Ready. No filters. No feelings. Just raw answers." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("Ruthless");
  const bottomRef = useRef(null);

  // Personality descriptions
  const modeIntros = {
    Ruthless: "Ready. No filters. No feelings. Just raw answers. 💀",
    "Dr Love": "Your heart’s personal therapist is online. ❤️",
    "The Hacker": "System booted. Let’s break some limits. 💻",
    "The Professor": "Ah, I see you seek wisdom. Let’s think this through. 🧠",
    "The Creator": "Imagination engaged. Let’s build something legendary. ⚡",
  };

  useEffect(() => {
    setMessages([{ role: "assistant", content: modeIntros[mode] }]);
  }, [mode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const aiResponse = await sendToRuthless(newMessages, mode);
    setMessages([...newMessages, { role: "assistant", content: aiResponse }]);
    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="chat-container">
        <h1 className="title">RUT#L3SS_AI</h1>
        <p className="subtitle">Always in {mode} Mode</p>

        <div className="mode-select">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="bg-zinc-900 text-cyan-400 border border-cyan-500/30 rounded-lg px-2 py-1 text-sm focus:outline-none hover:border-cyan-400 transition-all duration-200 appearance-none"
            style={{
              backgroundColor: "#0a0a0a",
              color: "#67e8f9",
            }}
          >
            <option>🔥 Ruthless</option>
            <option>💖 Dr Love</option>
            <option>💻 The Hacker</option>
            <option>🧠 The Professor</option>
            <option>⚡ The Creator</option>
          </select>
        </div>

        <div className="chat-box">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              {m.role === "assistant" ? (
                <span className="assistant">
                  RuthlessAI: <span dangerouslySetInnerHTML={{ __html: m.content }} />
                </span>
              ) : (
                <span className="user">You: {m.content}</span>
              )}
            </div>
          ))}
          {loading && <div className="thinking">RuthlessAI is thinking...</div>}
          <div ref={bottomRef} />
        </div>

        <div className="input-box">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}
