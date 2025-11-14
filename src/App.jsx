import React, { useState, useEffect, useRef } from "react";
import { sendToRuthless } from "./api";
import logo from "./ruthless-logo.png";

export default function App() {
  // Personality intro lines
  const modeIntros = {
    ruthless: "Ready. No filters. No feelings. Just raw answers.",
    drlove: "Dr. Love is at your service. Spill it out hoe. ❤️",
    hacker: "I'm ready. Let’s get to work 💻",
    professor: "Ah, I see you seek wisdom. Let’s think this through. 🧠",
    creator: "Imagination engaged. Let’s build something legendary. ⚡",
  };

  const [mode, setMode] = useState("ruthless");
  const [messages, setMessages] = useState([
    { role: "ai", content: modeIntros["ruthless"] },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef(null);

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
    setMessages([{ role: "ai", content: modeIntros[mode] }]);
  }, [mode]);

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

    // THINKING DELAY
    setThinking(false);
    const thinkingTimer = setTimeout(() => {
      setThinking(true);
    }, 2000);

    const aiReply = await sendToRuthless([...messages, userMessage], mode);

    clearTimeout(thinkingTimer);
    setThinking(false);

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
      ${
        mode === "hacker"
          ? "bg-transparent"
          : mode === "drlove"
          ? "bg-gradient-to-b from-rose-600 via-rose-500 to-pink-500"
          : "bg-gradient-to-b from-black via-zinc-900 to-black"
      }
      text-white overflow-hidden transition-all duration-700 ${
        started ? "pt-6" : ""
      }`}
    >
      {/* BACKGROUND GLOW */}
      {mode !== "hacker" && mode !== "drlove" && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] 
      bg-cyan-500/20 blur-[200px] rounded-full animate-pulse"
        ></div>
      )}

      {mode === "drlove" && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px]
      bg-pink-400/20 blur-[200px] rounded-full animate-pulse-slow"
        ></div>
      )}

      {!started && (
        <div className="flex justify-center items-center h-[40vh] transition-all duration-700 animate-fadeIn">
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
        } ${mode === "drlove" ? "bg-rose-900/30" : "bg-white/5"} backdrop-blur-md border border-white/10 
        rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.25)] p-6`}
      >
        {/* HEADER */}
        <div className="flex flex-col items-center justify-center mb-4">
          <h1
            className={`text-2xl font-bold tracking-widest mb-2 ${
              mode === "drlove" ? "text-white" : "text-cyan-400"
            }`}
          >
            RUT#L3SS_AI
          </h1>

          <div className="flex items-center space-x-2">
            <span
              className={`font-semibold ${
                mode === "drlove" ? "text-rose-200" : "text-cyan-400"
              }`}
            >
              Mode:
            </span>
            <div className="relative">
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className={`bg-transparent border rounded-lg 
                px-2 py-1 text-sm focus:outline-none appearance-none pr-6 
                hover:shadow-[0_0_12px_rgba(255,0,128,0.3)] transition-all duration-300
                ${
                  mode === "drlove"
                    ? "text-rose-200 border-rose-300/30 hover:border-rose-200"
                    : "text-cyan-400 border-cyan-500/30 hover:border-cyan-400"
                }`}
              >
                <option value="ruthless">🔥 Ruthless</option>
                <option value="drlove">💘 Dr Love</option>
                <option value="hacker">💻 The Hacker</option>
              </select>

              <span
                className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none 
                ${mode === "drlove" ? "text-rose-200" : "text-cyan-400"}`}
              >
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 space-y-6 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-600">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${
                msg.role === "ai"
                  ? mode === "hacker"
                    ? "hacker-ai text-left"
                    : mode === "drlove"
                    ? "text-rose-200 text-left"
                    : "text-cyan-300 text-left"
                  : mode === "hacker"
                  ? "hacker-user text-right"
                  : mode === "drlove"
                  ? "text-rose-300 text-right"
                  : "text-red-400 text-right"
              } text-sm font-mono leading-relaxed`}
            >
              {msg.role === "ai"
                ? `${mode.charAt(0).toUpperCase() + mode.slice(1)}: `
                : "You: "}
              <span
                className="text-gray-300"
                dangerouslySetInnerHTML={{ __html: msg.content }}
              ></span>
            </div>
          ))}

          {thinking && (
            <div className="text-cyan-400 text-sm font-mono italic">
              thinking to give you the best answer...
            </div>
          )}

          {loading && !thinking && (
            <div className="flex space-x-1 justify-start text-cyan-400 text-sm font-mono">
              <span className="animate-bounce">•</span>
              <span className="animate-bounce delay-150">•</span>
              <span className="animate-bounce delay-300">•</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <form
          onSubmit={sendMessage}
          className={`flex items-center border border-white/10 rounded-xl 
          overflow-hidden focus-within:ring-2 transition
          ${mode === "hacker" ? "hacker-input focus-within:ring-green-400" : ""}`}
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
            className={`px-5 py-3 font-semibold transition-all duration-200
            rounded-none disabled:opacity-60 disabled:cursor-not-allowed
            ${
              mode === "hacker"
                ? "hacker-send-btn"
              : mode === "drlove"
                ? "bg-rose-500 hover:bg-rose-400 active:bg-rose-600"
                : "bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700"
            }`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
