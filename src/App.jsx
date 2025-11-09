import React, { useState, useEffect, useRef } from "react";
import { sendToRuthless } from "./api";
import logo from "./ruthless-logo.png";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Ready. No filters. No feelings. Just raw answers." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState("ruthless");
  const messagesEndRef = useRef(null);

  // Intro lines per personality
  const intros = {
    ruthless: "Ready. No filters. No feelings. Just raw answers. 💀",
    drlove: "Your heart’s personal therapist is online. ❤️",
    hacker: "Access granted. Let’s rewrite the rules. 💻",
    professor: "Ah, I see you seek wisdom. Let’s think this through. 🧠",
    creator: "Imagination engaged. Let’s build something legendary. ⚡",
  };

  useEffect(() => {
    setMessages([{ role: "ai", content: intros[mode] }]);
  }, [mode]);

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    document.body.style.overflow = "auto";
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const ping = () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/ping`).catch(() => {});
    ping();
    const interval = setInterval(ping, 45000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!started) setStarted(true);

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const aiReply = await sendToRuthless([...messages, userMessage], mode);

    const emojiSet = ["😎", "🤖", "💬", "⚡", "✨", "🧠", "🔥", "👀", "😄"];
    const randomEmoji = emojiSet[Math.floor(Math.random() * emojiSet.length)];
    const formatted =
      aiReply
        .replace(/\n{2,}/g, "<br><br>")
        .replace(/\n/g, "<br>")
        .replace(/([.!?])\s+/g, "$1&nbsp;&nbsp;") + ` ${randomEmoji}`;

    setMessages((prev) => [...prev, { role: "ai", content: formatted }]);
    setLoading(false);
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center 
      bg-gradient-to-b from-black via-zinc-900 to-black text-white overflow-hidden 
      transition-all duration-700 ${started ? "pt-6" : ""}`}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] 
      bg-cyan-500/20 blur-[200px] rounded-full animate-pulse"></div>

      {!started && (
        <div className="flex justify-center items-center h-[40vh] transition-all duration-700">
          <img
            src={logo}
            alt="RuthlessAI Logo"
            className="w-[280px] sm:w-[400px] md:w-[500px] 
            drop-shadow-[0_0_40px_rgba(0,255,255,0.8)] animate-pulse-slow"
          />
        </div>
      )}

      <div
        className={`relative w-full transition-all duration-700 ${
          started
            ? "max-w-3xl h-[90vh] flex flex-col justify-between"
            : "max-w-md"
        } bg-white/5 backdrop-blur-md border border-white/10 
        rounded-2xl shadow-lg p-6`}
      >
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-cyan-400 tracking-widest">
            RUT#L3SS_AI
          </h1>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="bg-transparent text-cyan-400 border border-cyan-500/30 rounded-lg px-2 py-1 text-sm focus:outline-none appearance-none"
            style={{
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            <option value="ruthless">🔥 Ruthless</option>
            <option value="drlove">💘 Dr Love</option>
            <option value="hacker">💻 The Hacker</option>
            <option value="professor">🧠 The Professor</option>
            <option value="creator">🎨 The Creator</option>
          </select>
        </div>
        <p className="text-sm text-center text-gray-400 mb-6">
          {intros[mode]}
        </p>

        <div className="flex-1 space-y-6 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-600">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${
                msg.role === "ai"
                  ? "text-cyan-300 text-left"
                  : "text-red-400 text-right"
              } text-sm font-mono leading-relaxed`}
            >
              {msg.role === "ai" ? "RuthlessAI: " : "You: "}
              <span
                className="text-gray-300"
                dangerouslySetInnerHTML={{ __html: msg.content }}
              ></span>
            </div>
          ))}
          {loading && (
            <div className="text-cyan-400 text-sm font-mono animate-pulse">
              Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={sendMessage}
          className="flex items-center border border-white/10 rounded-xl 
          overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500/50 transition"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 
            px-3 py-3 text-base focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 
            active:bg-cyan-700 text-white font-semibold transition-all duration-200 
            rounded-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
