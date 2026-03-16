'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface CourseAssistantChatProps {
  programId: string;
  programContext: any;
  userProfile: any;
}

export function CourseAssistantChat({ programId, programContext, userProfile }: CourseAssistantChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const renderAssistantMessage = (content: string) => {
    const cleaned = content.trim();
    if (!cleaned) return null;
    const lines = cleaned.split(/\n+/).map(line => line.trim()).filter(Boolean);
    if (!lines.length) return null;

    const headline = lines[0];
    const bulletLines = lines.slice(1).filter(line => /^(-|•|\d+\.)/.test(line));
    const paragraphLines = lines.slice(1).filter(line => !/^(-|•|\d+\.)/.test(line));

    return (
      <div className="chat-assistant-content">
        <p className="chat-assistant-headline">{headline}</p>
        {paragraphLines.length > 0 && (
          <div className="chat-assistant-paragraphs">
            {paragraphLines.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        )}
        {bulletLines.length > 0 && (
          <ul className="chat-assistant-list">
            {bulletLines.map((line, idx) => {
              const normalized = line.replace(/^(-|•|\d+\.)\s*/, '');
              return <li key={idx}>{normalized}</li>;
            })}
          </ul>
        )}
      </div>
    );
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch(`/api/programs/${programId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          programContext,
          userProfile,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.' 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I could not connect to the server. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "What documents do I need?",
    "How do I open a blocked account?",
    "What's the visa process?",
    "Tell me about living costs"
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="chat-fab"
        aria-label="Open course assistant"
      >
        <div className="chat-fab-inner">
          <Sparkles className="w-6 h-6" />
        </div>
        <span className="chat-fab-label">Ask AI</span>
        <style jsx>{`
          .chat-fab {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 0;
            border: none;
            background: none;
            cursor: pointer;
            animation: fabPulse 2s infinite;
          }
          
          @keyframes fabPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          .chat-fab-inner {
            width: 60px;
            height: 60px;
            border-radius: 20px;
            background: linear-gradient(135deg, #dd0000, #7c3aed);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            box-shadow: 0 8px 32px rgba(221,0,0,0.35);
            transition: all 0.3s;
          }
          
          .chat-fab:hover .chat-fab-inner {
            transform: scale(1.1);
            box-shadow: 0 12px 40px rgba(221,0,0,0.45);
          }
          
          .chat-fab-label {
            background: #fff;
            padding: 8px 16px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 700;
            color: #111;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          }
        `}</style>
      </button>
    );
  }

  return (
    <div className={`chat-window ${isMinimized ? 'minimized' : ''}`}>
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-avatar">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3>Course Assistant</h3>
            <span>AI-powered help</span>
          </div>
        </div>
        <div className="chat-header-actions">
          <button onClick={() => setIsMinimized(!isMinimized)} aria-label={isMinimized ? 'Maximize' : 'Minimize'}>
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsOpen(false)} aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-welcome">
                <div className="chat-welcome-icon">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h4>Hi! I'm your Course Assistant</h4>
                <p>Ask me anything about this program, requirements, or studying in Germany.</p>
                <div className="chat-suggestions">
                  {suggestedQuestions.map((q, i) => (
                    <button key={i} onClick={() => { setInput(q); inputRef.current?.focus(); }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                <div className="chat-message-content">
                  {msg.role === 'assistant' ? renderAssistantMessage(msg.content) : msg.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="chat-message assistant">
                <div className="chat-message-content loading">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-container">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about this program..."
              disabled={loading}
            />
            <button 
              onClick={sendMessage} 
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      <style jsx>{`
        .chat-window {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 380px;
          max-width: calc(100vw - 48px);
          height: 560px;
          max-height: calc(100vh - 120px);
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 12px 48px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          overflow: hidden;
          animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .chat-window.minimized {
          height: auto;
        }
        
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: linear-gradient(135deg, #dd0000, #7c3aed);
          color: #fff;
        }
        
        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .chat-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .chat-header h3 {
          font-size: 15px;
          font-weight: 700;
          margin: 0;
        }
        
        .chat-header span {
          font-size: 12px;
          opacity: 0.8;
        }
        
        .chat-header-actions {
          display: flex;
          gap: 8px;
        }
        
        .chat-header-actions button {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: rgba(255,255,255,0.15);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        
        .chat-header-actions button:hover {
          background: rgba(255,255,255,0.25);
        }
        
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .chat-welcome {
          text-align: center;
          padding: 20px 0;
        }
        
        .chat-welcome-icon {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(221,0,0,0.1), rgba(124,58,237,0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #dd0000;
        }
        
        .chat-welcome h4 {
          font-size: 18px;
          font-weight: 700;
          color: #111;
          margin: 0 0 8px;
        }
        
        .chat-welcome p {
          font-size: 14px;
          color: #666;
          margin: 0 0 20px;
        }
        
        .chat-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }
        
        .chat-suggestions button {
          padding: 8px 14px;
          border-radius: 20px;
          border: 1px solid #e5e5e5;
          background: #fafafa;
          font-size: 12px;
          font-weight: 500;
          color: #555;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .chat-suggestions button:hover {
          border-color: #dd0000;
          color: #dd0000;
          background: rgba(221,0,0,0.05);
        }
        
        .chat-message {
          max-width: 85%;
        }
        
        .chat-message.user {
          align-self: flex-end;
        }
        
        .chat-message.assistant {
          align-self: flex-start;
        }
        
        .chat-message-content {
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .chat-message.user .chat-message-content {
          background: linear-gradient(135deg, #dd0000, #b91c1c);
          color: #fff;
          border-bottom-right-radius: 4px;
        }
        
        .chat-message.assistant .chat-message-content {
          background: #f5f5f5;
          color: #333;
          border-bottom-left-radius: 4px;
        }

        .chat-assistant-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .chat-assistant-headline {
          margin: 0;
          font-weight: 600;
          color: #111;
        }

        .chat-assistant-paragraphs p {
          margin: 0;
          font-size: 13px;
          color: #444;
          line-height: 1.5;
        }

        .chat-assistant-list {
          margin: 0;
          padding-left: 18px;
          font-size: 13px;
          color: #444;
        }

        .chat-assistant-list li {
          margin-bottom: 4px;
        }
        
        .chat-message-content.loading {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #999;
        }
        
        .chat-input-container {
          display: flex;
          gap: 10px;
          padding: 16px 20px;
          border-top: 1px solid #f0f0f0;
          background: #fff;
        }
        
        .chat-input-container input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        
        .chat-input-container input:focus {
          border-color: #dd0000;
        }
        
        .chat-input-container button {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #dd0000, #b91c1c);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .chat-input-container button:hover:not(:disabled) {
          transform: scale(1.05);
        }
        
        .chat-input-container button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        @media (max-width: 480px) {
          .chat-window {
            bottom: 0;
            right: 0;
            width: 100%;
            max-width: 100%;
            height: 100%;
            max-height: 100%;
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
}
