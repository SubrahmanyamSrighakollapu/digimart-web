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
        .scroll-text { display: inline-block; animation: scroll-left 20s linear; }
      `}</style>
      <div style={{
        background: 'linear-gradient(135deg, #EC5B13 0%, #32a862 100%)',
        height: '36px', display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: '12px', overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
      }}>
        <span style={{
          background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '20px', padding: '2px 12px', fontSize: '10px',
          fontWeight: 700, color: 'white', textTransform: 'uppercase',
          letterSpacing: '0.08em', whiteSpace: 'nowrap', flexShrink: 0,
        }}>📢 Notice</span>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div key={currentIndex} className="scroll-text" style={{
            color: 'white', fontSize: '13px', fontWeight: 500,
          }}>
            {messages[currentIndex]?.alertMessage}
          </div>
        </div>
      </div>
    </>
  );
};

export default ScrollingMessages;
