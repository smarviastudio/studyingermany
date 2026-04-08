'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Send, Loader2, Sparkles, Minimize2, LogIn, Crown, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PageContext {
  type: 'program' | 'blog' | 'page';
  pageName?: string;
  data?: any;
}

// Context provider hook - detects current page and extracts relevant data
function usePageContext(): PageContext | null {
  const pathname = usePathname();
  const [context, setContext] = useState<PageContext | null>(null);

  useEffect(() => {
    // Detect page type based on pathname
    if (pathname.startsWith('/blog/') && pathname !== '/blog') {
      // Blog article page - extract article data from DOM
      const articleTitle = document.querySelector('h1')?.textContent;
      const articleContent = document.querySelector('article')?.textContent?.substring(0, 2000);
      
      if (articleTitle) {
        setContext({
          type: 'blog',
          data: {
            title: articleTitle,
            content: articleContent,
            url: pathname,
          },
        });
      }
    } else if (pathname.startsWith('/detail/') || pathname.includes('/program/')) {
      // Program detail page
      const programName = document.querySelector('h1')?.textContent;
      const universityName = document.querySelector('[data-university]')?.textContent || 
                            document.querySelector('.university-name')?.textContent;
      
      if (programName) {
        setContext({
          type: 'program',
          data: {
            name: programName,
            university: universityName,
            url: pathname,
          },
        });
      }
    } else {
      // Generic page context
      const pageName = pathname === '/' ? 'Home' : 
                       pathname.replace(/^\//, '').replace(/-/g, ' ').replace(/\//g, ' > ');
      setContext({
        type: 'page',
        pageName: pageName.charAt(0).toUpperCase() + pageName.slice(1),
      });
    }
  }, [pathname]);

  return context;
}

export function GlobalChatbot() {
  const { data: session, status } = useSession();
  const pageContext = usePageContext();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatStatus, setChatStatus] = useState<{
    authenticated: boolean;
    tier: string;
    dailyLimit: number;
    remainingMessages: number;
  } | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch chat status on mount and when session changes
  useEffect(() => {
    if (status === 'authenticated') {
      fetchChatStatus();
    }
  }, [status]);

  const fetchChatStatus = async () => {
    try {
      const res = await fetch('/api/global-chat');
      if (res.ok) {
        const data = await res.json();
        setChatStatus(data);
        if (data.remainingMessages === 0) {
          setLimitReached(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch chat status:', error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current && status === 'authenticated') {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized, status]);

  const sendMessage = async () => {
    if (!input.trim() || loading || status !== 'authenticated') return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/global-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: pageContext,
          conversationHistory: messages.slice(-10),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        setChatStatus(prev => prev ? {
          ...prev,
          remainingMessages: data.remainingMessages,
        } : null);
        if (data.remainingMessages === 0) {
          setLimitReached(true);
        }
      } else if (response.status === 429) {
        setLimitReached(true);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message || `You've reached your daily limit. ${data.tier === 'free' ? 'Upgrade to get more messages!' : 'Your limit resets at midnight.'}`,
        }]);
      } else if (response.status === 401) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Please sign in to continue chatting.',
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I could not connect to the server. Please try again.',
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

  const suggestedQuestions = pageContext?.type === 'blog' ? [
    "Summarize this article",
    "What are the key points?",
    "Tell me more about this topic",
  ] : pageContext?.type === 'program' ? [
    "What are the requirements?",
    "How do I apply?",
    "What's the tuition fee?",
    "Tell me about the visa process",
  ] : [
    "How do I study in Germany?",
    "What documents do I need?",
    "How much does it cost?",
    "Find programs for me",
  ];

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="global-chat-fab"
        aria-label="Open AI Assistant"
      >
        <div className="global-chat-fab-inner">
          <Sparkles className="w-6 h-6" />
        </div>
        <span className="global-chat-fab-label">Ask AI</span>
        <style jsx>{`
          .global-chat-fab {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
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
          
          .global-chat-fab-inner {
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
          
          .global-chat-fab:hover .global-chat-fab-inner {
            transform: scale(1.1);
            box-shadow: 0 12px 40px rgba(221,0,0,0.45);
          }
          
          .global-chat-fab-label {
            background: #fff;
            padding: 8px 16px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 700;
            color: #111;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          }

          @media (max-width: 480px) {
            .global-chat-fab-label {
              display: none;
            }
          }
        `}</style>
      </button>
    );
  }

  // Chat window
  return (
    <div className={`global-chat-window ${isMinimized ? 'minimized' : ''}`}>
      {/* Header */}
      <div className="global-chat-header">
        <div className="global-chat-header-left">
          <div className="global-chat-avatar">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3>German Path AI</h3>
            <span>
              {status !== 'authenticated' ? (
                'Sign in to chat'
              ) : chatStatus ? (
                <span className="global-chat-limit-badge">
                  {chatStatus.remainingMessages}/{chatStatus.dailyLimit} messages left
                </span>
              ) : (
                'AI-powered help'
              )}
            </span>
          </div>
        </div>
        <div className="global-chat-header-actions">
          <button onClick={() => setIsMinimized(!isMinimized)} aria-label={isMinimized ? 'Maximize' : 'Minimize'}>
            <Minimize2 className="w-4 h-4" />
          </button>
          <button onClick={() => setIsOpen(false)} aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div className="global-chat-messages">
            {/* Not authenticated - show sign in prompt */}
            {status !== 'authenticated' ? (
              <div className="global-chat-auth-prompt">
                <div className="global-chat-auth-icon">
                  <LogIn className="w-8 h-8" />
                </div>
                <h4>Sign in to Chat</h4>
                <p>Create a free account to start chatting with our AI assistant about studying in Germany.</p>
                <button onClick={() => signIn()} className="global-chat-signin-btn">
                  <LogIn className="w-4 h-4" />
                  Sign In / Sign Up
                </button>
                <p className="global-chat-auth-note">
                  Free users get 5 messages/day. <Link href="/pricing">Upgrade</Link> for more!
                </p>
              </div>
            ) : (
              <>
                {/* Welcome message */}
                {messages.length === 0 && (
                  <div className="global-chat-welcome">
                    <div className="global-chat-welcome-icon">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h4>Hi! I'm your AI Assistant</h4>
                    <p>
                      {pageContext?.type === 'blog' 
                        ? `Ask me anything about this article!`
                        : pageContext?.type === 'program'
                        ? `Ask me about this program or studying in Germany!`
                        : `Ask me anything about studying in Germany!`
                      }
                    </p>
                    <div className="global-chat-suggestions">
                      {suggestedQuestions.map((q, i) => (
                        <button key={i} onClick={() => { setInput(q); inputRef.current?.focus(); }}>
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Messages */}
                {messages.map((msg, i) => (
                  <div key={i} className={`global-chat-message ${msg.role}`}>
                    <div className="global-chat-message-content">
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown
                          components={{
                            p: ({children}) => <p style={{ margin: '0 0 8px' }}>{children}</p>,
                            strong: ({children}) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
                            ul: ({children}) => <ul style={{ margin: '8px 0', paddingLeft: 20 }}>{children}</ul>,
                            li: ({children}) => <li style={{ marginBottom: 4 }}>{children}</li>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <div className="global-chat-message assistant">
                    <div className="global-chat-message-content loading">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}

                {/* Limit reached message */}
                {limitReached && !loading && (
                  <div className="global-chat-limit-warning">
                    <AlertCircle className="w-5 h-5" />
                    <div>
                      <p>Daily limit reached</p>
                      <Link href="/pricing">Upgrade for more messages →</Link>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          {status === 'authenticated' && (
            <div className="global-chat-input-container">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={limitReached ? "Daily limit reached" : "Ask me anything..."}
                disabled={loading || limitReached}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading || limitReached}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .global-chat-window {
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
          z-index: 9999;
          overflow: hidden;
          animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .global-chat-window.minimized {
          height: auto;
        }
        
        .global-chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: linear-gradient(135deg, #dd0000, #7c3aed);
          color: #fff;
        }
        
        .global-chat-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .global-chat-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .global-chat-header h3 {
          font-size: 15px;
          font-weight: 700;
          margin: 0;
        }
        
        .global-chat-header span {
          font-size: 12px;
          opacity: 0.9;
        }
        
        .global-chat-header-actions {
          display: flex;
          gap: 8px;
        }
        
        .global-chat-header-actions button {
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
        
        .global-chat-header-actions button:hover {
          background: rgba(255,255,255,0.25);
        }
        
        .global-chat-limit-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          background: rgba(255,255,255,0.2);
          border-radius: 8px;
        }
        
        .global-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .global-chat-auth-prompt {
          text-align: center;
          padding: 40px 20px;
        }
        
        .global-chat-auth-icon {
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
        
        .global-chat-auth-prompt h4 {
          font-size: 18px;
          font-weight: 700;
          color: #111;
          margin: 0 0 8px;
        }
        
        .global-chat-auth-prompt p {
          font-size: 14px;
          color: #666;
          margin: 0 0 20px;
          line-height: 1.5;
        }
        
        .global-chat-signin-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #dd0000, #b91c1c);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .global-chat-signin-btn:hover {
          transform: scale(1.05);
        }
        
        .global-chat-auth-note {
          font-size: 12px;
          color: #999;
          margin-top: 16px;
        }
        
        .global-chat-auth-note a {
          color: #dd0000;
          font-weight: 600;
        }
        
        .global-chat-welcome {
          text-align: center;
          padding: 20px 0;
        }
        
        .global-chat-welcome-icon {
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
        
        .global-chat-welcome h4 {
          font-size: 18px;
          font-weight: 700;
          color: #111;
          margin: 0 0 8px;
        }
        
        .global-chat-welcome p {
          font-size: 14px;
          color: #666;
          margin: 0 0 20px;
        }
        
        .global-chat-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }
        
        .global-chat-suggestions button {
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
        
        .global-chat-suggestions button:hover {
          border-color: #dd0000;
          color: #dd0000;
          background: rgba(221,0,0,0.05);
        }
        
        .global-chat-message {
          max-width: 85%;
        }
        
        .global-chat-message.user {
          align-self: flex-end;
        }
        
        .global-chat-message.assistant {
          align-self: flex-start;
        }
        
        .global-chat-message-content {
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .global-chat-message.user .global-chat-message-content {
          background: linear-gradient(135deg, #dd0000, #b91c1c);
          color: #fff;
          border-bottom-right-radius: 4px;
        }
        
        .global-chat-message.assistant .global-chat-message-content {
          background: #f5f5f5;
          color: #333;
          border-bottom-left-radius: 4px;
        }
        
        .global-chat-message-content.loading {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #999;
        }
        
        .global-chat-limit-warning {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #fef3c7;
          border-radius: 12px;
          color: #92400e;
        }
        
        .global-chat-limit-warning p {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
        }
        
        .global-chat-limit-warning a {
          font-size: 12px;
          color: #dd0000;
          font-weight: 600;
        }
        
        .global-chat-input-container {
          display: flex;
          gap: 10px;
          padding: 16px 20px;
          border-top: 1px solid #f0f0f0;
          background: #fff;
        }
        
        .global-chat-input-container input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        
        .global-chat-input-container input:focus {
          border-color: #dd0000;
        }
        
        .global-chat-input-container input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }
        
        .global-chat-input-container button {
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
        
        .global-chat-input-container button:hover:not(:disabled) {
          transform: scale(1.05);
        }
        
        .global-chat-input-container button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        @media (max-width: 480px) {
          .global-chat-window {
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
