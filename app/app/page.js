"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // পেজ লোড হলে লোকাল স্টোরেজ থেকে চ্যাট হিস্ট্রি নিয়ে আসা
  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    } else {
      setMessages([
        { role: "ai", text: "Hello! I am Artificial Tasin. How can I help you today?" }
      ]);
    }
  }, []);

  // নতুন মেসেজ এলে চ্যাট হিস্ট্রি সেভ করা এবং নিচে স্ক্রল করা
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // হিস্ট্রি ডিলিট করার ফাংশন
  const clearHistory = () => {
    localStorage.removeItem("chatHistory");
    setMessages([{ role: "ai", text: "History cleared. How can I help you today?" }]);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages([...newMessages, { role: "ai", text: data.reply }]);
      } else {
        setMessages([...newMessages, { role: "ai", text: "Error: Could not get a response from the server." }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: "ai", text: "Network error: Could not connect to the server." }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="app-container">
      {/* গ্লাস থিম হেডার */}
      <header className="glass-header">
        <h1 className="brand-name">Artificial Tasin</h1>
        <button onClick={clearHistory} className="clear-btn" title="Clear History">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </header>

      {/* চ্যাট এরিয়া */}
      <main className="chat-area">
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.role === "user" ? "user-wrapper" : "ai-wrapper"}`}>
            <div className={`message-bubble ${msg.role === "user" ? "user-bubble" : "ai-bubble"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message-wrapper ai-wrapper">
            <div className="message-bubble ai-bubble typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* ইনপুট এরিয়া */}
      <footer className="input-area">
        <form onSubmit={sendMessage} className="glass-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="glass-input"
            disabled={isLoading}
          />
          <button type="submit" className="glass-send-btn" disabled={isLoading || !input.trim()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </footer>

      {/* প্রিমিয়াম CSS স্টাইলস */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --bg-color: #0f172a;
          --glass-bg: rgba(255, 255, 255, 0.05);
          --glass-border: rgba(255, 255, 255, 0.1);
          --ai-bubble: rgba(255, 255, 255, 0.1);
          --user-bubble: #3b82f6;
          --text-color: #f1f5f9;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        body {
          background: linear-gradient(135deg, #020617, #0f172a, #1e293b);
          color: var(--text-color);
          overflow: hidden; /* প্রিভেন্ট বডি স্ক্রল */
        }

        /* মোবাইল স্ক্রিনে পারফেক্ট ফিট করার জন্য 100dvh */
        .app-container {
          display: flex;
          flex-direction: column;
          height: 100dvh; 
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        /* Header Styles */
        .glass-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--glass-border);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .brand-name {
          font-size: 1.2rem;
          font-weight: 600;
          background: linear-gradient(90deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: fadeIn 0.5s ease-in-out;
        }

        .clear-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.3s;
        }
        .clear-btn:hover {
          color: #ef4444;
        }

        /* Chat Area Styles */
        .chat-area {
          flex-grow: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 15px;
          scroll-behavior: smooth;
        }

        /* স্ক্রলবার হাইড করার জন্য */
        .chat-area::-webkit-scrollbar {
          display: none;
        }
        .chat-area {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .message-wrapper {
          display: flex;
          width: 100%;
          animation: slideUp 0.4s ease-out forwards;
        }

        .user-wrapper {
          justify-content: flex-end;
        }

        .ai-wrapper {
          justify-content: flex-start;
        }

        .message-bubble {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 20px;
          font-size: 1rem;
          line-height: 1.5;
          word-wrap: break-word;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .user-bubble {
          background: var(--user-bubble);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .ai-bubble {
          background: var(--ai-bubble);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid var(--glass-border);
          border-bottom-left-radius: 4px;
        }

        /* Input Area Styles */
        .input-area {
          padding: 15px 20px;
          background: linear-gradient(to top, #020617 50%, transparent);
        }

        .glass-form {
          display: flex;
          gap: 10px;
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          padding: 8px;
          border-radius: 30px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .glass-input {
          flex-grow: 1;
          background: transparent;
          border: none;
          color: white;
          padding: 8px 15px;
          font-size: 1rem;
          outline: none;
        }
        .glass-input::placeholder {
          color: #94a3b8;
        }

        .glass-send-btn {
          background: var(--user-bubble);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }
        .glass-send-btn:disabled {
          background: #475569;
          cursor: not-allowed;
        }
        .glass-send-btn:not(:disabled):active {
          transform: scale(0.9);
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Typing Indicator */
        .typing-indicator {
          display: flex;
          gap: 5px;
          padding: 15px 20px;
        }
        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #94a3b8;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}} />
    </div>
  );
}
