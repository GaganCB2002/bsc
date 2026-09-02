import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: 0,
  text: "Welcome to BSC Exclusive! I'm your AI assistant. I can help you with:\n\n- Product recommendations\n- Shipping & delivery info\n- Returns & exchanges\n- Store locations\n- Order tracking\n\nHow can I help you today?",
  sender: 'bot',
  timestamp: new Date(),
};

const SUGGESTIONS = [
  'Show me bridal silk sarees',
  'What is your return policy?',
  'Where are your stores?',
  'How to track my order?',
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(1);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: messageIdRef.current++,
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const botResponse = await sendMessageToGemini(messageText);

    const botMessage: Message = {
      id: messageIdRef.current++,
      text: botResponse,
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #B91C1C, #991B1B)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(185,28,28,0.4)',
          zIndex: 9999,
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        aria-label="Chat with AI assistant"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '96px',
          right: '24px',
          width: '380px',
          maxWidth: 'calc(100vw - 48px)',
          height: '520px',
          maxHeight: 'calc(100vh - 140px)',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 9998,
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #1A1A2E, #0F0F1A)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #B91C1C, #991B1B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Bot size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>BSC Exclusive AI</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Always here to help</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '8px',
                }}
              >
                {msg.sender === 'bot' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#1E3A8A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Bot size={14} color="#fff" />
                  </div>
                )}
                <div style={{
                  maxWidth: '75%',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: msg.sender === 'user' ? '#B91C1C' : '#F1F5F9',
                  color: msg.sender === 'user' ? '#fff' : '#1E293B',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line',
                }}>
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#B91C1C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <User size={14} color="#fff" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#1E3A8A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Bot size={14} color="#fff" />
                </div>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '14px',
                  background: '#F1F5F9',
                  display: 'flex',
                  gap: '4px',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94A3B8', animation: 'bounce 1s infinite' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94A3B8', animation: 'bounce 1s infinite 0.2s' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94A3B8', animation: 'bounce 1s infinite 0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    background: '#fff',
                    color: '#1E3A8A',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#1E3A8A'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1E3A8A'; }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            gap: '8px',
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                outline: 'none',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: input.trim() ? '#B91C1C' : '#E2E8F0',
                color: input.trim() ? '#fff' : '#94A3B8',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
