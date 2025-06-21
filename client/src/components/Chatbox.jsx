import React, { useEffect, useState, useRef } from 'react';
import socket from '../socket';

function ChatBox({ roomId, username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('chat-message', handleMessage);

    return () => {
      socket.off('chat-message', handleMessage);
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const msg = {
      roomId,
      username,
      text: input,
      timestamp: Date.now(),
    };

    socket.emit('chat-message', msg);
    setMessages((prev) => [...prev, msg]); // Show own message immediately
    setInput('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #ccc',
      maxHeight: '300px',
      overflowY: 'auto',
    }}>
      <h3 style={{ marginBottom: '1rem' }}>Chat</h3>

      <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '1rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '0.5rem' }}>
            <strong>{msg.username}</strong>
            <span style={{
              fontSize: '0.75rem',
              color: '#888',
              marginLeft: '0.5rem',
            }}>
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div>{msg.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatBox;
