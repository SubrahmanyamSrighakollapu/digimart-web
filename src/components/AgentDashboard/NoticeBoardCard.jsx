// NoticeBoardCard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, X } from 'lucide-react';

const NoticeBoardCard = () => {
  const [notices, setNotices] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/lookup/getnoticemessages`, {
        alertsId: 0,
        isActive: true
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.status === 1 && response.data.result) {
        setNotices(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  if (notices.length === 0) return null;

  return (
    <>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        border: '2px solid #4BAF47',
        marginBottom: '24px',
        marginTop:'30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #4BAF47 0%, #3d9139 100%)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bell size={20} color="white" />
            </div>
            <div>
              <h3 style={{
                margin: 0,
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '700'
              }}>
                Notice Board
              </h3>
              <p style={{
                margin: 0,
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.8rem'
              }}>
                {notices.length} active {notices.length === 1 ? 'notice' : 'notices'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            {expanded ? 'Show Less' : 'View All'}
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          {(expanded ? notices : notices.slice(0, 2)).map((notice, index) => (
            <div
              key={notice.alertsId}
              style={{
                padding: '16px',
                background: index % 2 === 0 ? '#f8fdf8' : 'white',
                borderRadius: '12px',
                marginBottom: '12px',
                border: '1px solid #e5f5e5',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => setSelectedNotice(notice)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(75,175,71,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#4BAF47',
                  marginTop: '6px',
                  flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: 0,
                    color: '#1a1a1a',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    fontWeight: '500'
                  }}>
                    {notice.alertMessage}
                  </p>
                  <p style={{
                    margin: '8px 0 0 0',
                    color: '#64748b',
                    fontSize: '0.75rem'
                  }}>
                    {new Date(notice.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }}
          onClick={() => setSelectedNotice(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              background: 'linear-gradient(135deg, #4BAF47 0%, #3d9139 100%)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{
                margin: 0,
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: '700'
              }}>
                Notice Details
              </h3>
              <button
                onClick={() => setSelectedNotice(null)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                <X size={20} color="white" />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{
                margin: '0 0 16px 0',
                color: '#1a1a1a',
                fontSize: '1rem',
                lineHeight: '1.8'
              }}>
                {selectedNotice.alertMessage}
              </p>
              <div style={{
                borderTop: '1px solid #e5e7eb',
                paddingTop: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
                color: '#64748b'
              }}>
                <span>Posted on: {new Date(selectedNotice.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}</span>
                <span>Notice ID: #{selectedNotice.alertsId}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NoticeBoardCard;
