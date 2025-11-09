import React, { useState, useRef, useEffect } from "react";
import { sendToRuthless } from "./api";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("ruthless");
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { role: "user", content: input };
    setMessages((m) => [...m, newMessage]);
    setInput("");
    setLoading(true);

    const reply = await sendToRuthless([...messages, newMessage], mode);
    setMessages((m) => [...m, { role: "assistant", content: reply }]);
    setLoading(false);
  };

  return (
    <div className="app">
      <header>
        <h1>
          {mode === "ruthless"
            ? "🔥 Ruthless"
            : mode === "drlove"
            ? "💘 Dr Love"
            : mode === "hacker"
            ? "💻 The Hacker"
            : mode === "professor"
            ? "🧠 The Professor"
            : "🎨 The Creator"}
        </h1>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="ruthless">🔥 Ruthless</option>
          <option value="drlove">💘 Dr Love</option>
          <option value="hacker">💻 The Hacker</option>
          <option value="professor">🧠 The Professor</option>
          <option value="creator">🎨 The Creator</option>
        </select>
      </header>

      <main>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="loading">🤖 Thinking...</div>}
        <div ref={chatEndRef} />
      </main>

      <footer>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </footer>
    </div>
  );
}

export default App;
