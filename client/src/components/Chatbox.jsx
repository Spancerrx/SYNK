import React, { useEffect, useState, useRef } from 'react';
import socket from '../socket';

function ChatBox({ roomId, username }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (message.trim()) {
      const payload = {
        roomId,
        username,
        message,
        timestamp: new Date().toISOString(),
      };
      socket.emit('send-message', payload);
      setMessages(prev => [...prev, payload]);
      setMessage('');
    }
  };

  useEffect(() => {
    const handleReceive = (payload) => {
      setMessages(prev => [...prev, payload]);
    };

    socket.on('receive-message', handleReceive);

    return () => {
      socket.off('receive-message', handleReceive);
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const formatTime = (isoTime) => {
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      marginTop: '2rem',
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '1rem',
      maxHeight: '300px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <h4>Chat</h4>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            marginBottom: '0.5rem',
            padding: '0.5rem',
            backgroundColor: msg.username === username ? '#e0f7fa' : '#f1f1f1',
            borderRadius: '5px'
          }}>
            <strong>{msg.username}</strong>
            <span style={{ fontSize: '0.8rem', color: '#888', marginLeft: '0.5rem' }}>
              {formatTime(msg.timestamp)}
            </span>
            <div>{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button onClick={sendMessage} style={{
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none'
        }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
