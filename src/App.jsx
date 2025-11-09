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
  const messagesEndRef = useRef(null);

  // ✅ ChatGPT-style iPhone viewport + scroll fix
  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    document.body.style.overflow = "auto"; // allow scrolling on iOS
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "auto";
    };
  }, []);

  // Keep Render awake
  useEffect(() => {
    const ping = () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/ping`).catch(() => {});
    ping();
    const interval = setInterval(ping, 45000);
    return () => clearInterval(interval);
  }, []);

  // 👇 Auto-scroll to latest message
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

    const aiReply = await sendToRuthless([...messages, userMessage]);

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
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] 
      bg-cyan-500/20 blur-[200px] rounded-full animate-pulse"></div>

      {/* Logo section */}
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

      {/* Chat container */}
      <div
        className={`relative w-full transition-all duration-700 ${
          started
            ? "max-w-3xl h-[90vh] flex flex-col justify-between"
            : "max-w-md"
        } bg-white/5 backdrop-blur-md border border-white/10 
        rounded-2xl shadow-lg p-6`}
      >
        <h1 className="text-2xl font-bold text-center mb-2 text-cyan-400 tracking-widest">
          RUT#L3SS_AI
        </h1>
        <p className="text-sm text-center text-gray-400 mb-6">
          Always in Ruthless Mode
        </p>

        {/* Messages */}
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
              RuthlessAI is thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
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
            className="px-4 py-2 text-sm font-semibold bg-cyan-600 
            hover:bg-cyan-500 transition-all"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
