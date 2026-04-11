import { useState, useEffect } from 'react';
import axios from 'axios';

const SCROLL_DURATION = 18000; // ms to scroll across (slower)
const GAP_DURATION    = 3000;  // ms pause between messages

const ScrollingMessages = () => {
  const [messages, setMessages]     = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible]       = useState(false);
  const [key, setKey]               = useState(0); // forces animation restart

  useEffect(() => { fetchMessages(); }, []);

  // Start the cycle once messages are loaded
  useEffect(() => {
    if (messages.length === 0) return;
    // Show first message immediately
    setVisible(true);
    setKey(k => k + 1);
  }, [messages]);

  // After each scroll completes → pause → show next
  useEffect(() => {
    if (!visible || messages.length === 0) return;

    // Wait for scroll to finish
    const scrollTimer = setTimeout(() => {
      setVisible(false); // hide

      // After gap, show next message
      const gapTimer = setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % messages.length);
        setKey(k => k + 1);
        setVisible(true);
      }, GAP_DURATION);

      return () => clearTimeout(gapTimer);
    }, SCROLL_DURATION);

    return () => clearTimeout(scrollTimer);
  }, [visible, key, messages.length]);

  const fetchMessages = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/lookup/getscrollmessages`,
        { alertsId: 0, isActive: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status === 1 && res.data.result?.length > 0) {
        setMessages(res.data.result);
      }
    } catch {}
  };

  if (messages.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes scroll-once {
          0%   { transform: translateX(110%); }
          100% { transform: translateX(-110%); }
        }
        .scroll-msg {
          display: inline-block;
          white-space: nowrap;
          animation: scroll-once ${SCROLL_DURATION}ms linear forwards;
        }
      `}</style>

      <div style={{
        background: 'linear-gradient(135deg, #EC5B13 0%, #32a862 100%)',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '12px',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
      }}>
        {/* Static badge */}
        <span style={{
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '20px',
          padding: '2px 12px',
          fontSize: '10px',
          fontWeight: 700,
          color: 'white',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>📢 Notice</span>

        {/* Scrolling text — key forces full remount to restart animation */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
          {visible && (
            <span
              key={key}
              className="scroll-msg"
              style={{ color: 'white', fontSize: '13px', fontWeight: 500 }}
            >
              {messages[currentIndex]?.alertMessage}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default ScrollingMessages;
