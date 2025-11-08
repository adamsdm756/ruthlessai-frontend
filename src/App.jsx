import React, { useState } from "react";
import "./App.css";
import { sendToRuthless } from "./api";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const aiReply = await sendToRuthless([...messages, userMessage]);

      // add inline emoji randomly for a conversational feel
      const emojis = ["😎", "🤖", "🔥", "💬", "🧠", "⚡", "👀", "✨", "😄", "📘"];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      const spacedText = aiReply.text
        .replace(/\n{2,}/g, "<br><br>") // double line breaks = new paragraph
        .replace(/\n/g, "<br>") // single newlines = line breaks
        .replace(/([.!?])\s+/g, "$1&nbsp;&nbsp;") // extra space after punctuation
        + ` ${randomEmoji}`;

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: spacedText }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <header className="header">
        <h1>RUT#L3SS_AI ⚡</h1>
        <p>Always in Ruthless Mode 🤖</p>
      </header>

      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <strong>{msg.role === "ai" ? "RuthlessAI:" : "You:"}</strong>
            <div
              className="message-content"
              dangerouslySetInnerHTML={{
                __html: msg.content
              }}
            />
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type something... 💭"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Thinking 🤔" : "Send 🚀"}
        </button>
      </div>
    </div>
  );
}

export default App;
