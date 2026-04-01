// ScrollingMessages.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScrollingMessages = () => {
  const [messages, setMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/lookup/getscrollmessages`, {
        alertsId: 0,
        isActive: true
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.status === 1 && response.data.result) {
        setMessages(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching scroll messages:', error);
    }
  };

  if (messages.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(75, 175, 71, 0.4); }
          50% { box-shadow: 0 0 25px rgba(75, 175, 71, 0.6); }
        }
        .scroll-container { 
          overflow: hidden; 
          white-space: nowrap; 
          position: relative;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 8px 16px;
          backdrop-filter: blur(10px);
        }
        .scroll-text { 
          display: inline-block; 
          animation: scroll-left 20s linear;
        }
        .alert-badge {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
      
      <div style={{
        background: 'linear-gradient(135deg, #4BAF47 0%, #3d9139 100%)',
        padding: '10px 0',
        borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          maxWidth: '100%'
        }}>
          <div className="alert-badge" style={{
            background: 'rgba(255, 255, 255, 0.25)',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: '700',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap',
            marginLeft: '20px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '0.9rem' }}>📢</span>
            <span>ALERT</span>
          </div>
          
          <div className="scroll-container" style={{ flex: 1, marginRight: '20px' }}>
            <div key={currentIndex} className="scroll-text" style={{
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: '600',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
              lineHeight: '1.5'
            }}>
              {messages[currentIndex]?.alertMessage}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScrollingMessages;
