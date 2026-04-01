// src/AdminDashboard/pages/Dashboard/AdminActions/AgentOnboarded.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AgentOnboarded = () => {
    const navigate = useNavigate();

      const handleApprove = () => {
    navigate('/agent');
  };
  return (
    <>
      <style jsx>{`
        .onboard-container {
          padding: 60px 20px;
          background-color: #f7f9fc;
          min-height: 100vh;
          font-family: 'Segoe UI', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card {
          max-width: 600px;
          width: 100%;
          background: white;
          border-radius: 16px;
          padding: 48px 40px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        .title {
          font-size: 28px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 40px;
        }

        .success-icon {
          width: 100px;
          height: 100px;
          background-color: #54CF17;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 32px auto;
          position: relative;
        }

        .success-icon::before {
          content: '✓';
          font-size: 48px;
          color: white;
          font-weight: bold;
        }

        .success-icon::after {
          content: '';
          position: absolute;
          inset: -12px;
          border: 12px solid #54CF17;
          border-radius: 50%;
          opacity: 0.2;
        }

        .main-message {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 12px;
        }

        .sub-message {
          font-size: 18px;
          font-weight: 600;
          color: #54CF17;
          margin-bottom: 16px;
        }

        .description {
          font-size: 15px;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 40px;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }

        .btn-dashboard {
          padding: 14px 32px;
          background-color: white;
          color: #4a5568;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-dashboard:hover {
          background-color: #f7fafc;
          border-color: #cbd5e0;
        }

        @media (max-width: 640px) {
          .card {
            padding: 40px 24px;
          }

          .title {
            font-size: 26px;
          }

          .main-message {
            font-size: 22px;
          }

          .success-icon {
            width: 80px;
            height: 80px;
          }

          .success-icon::before {
            font-size: 40px;
          }
        }
      `}</style>

      <div className="onboard-container">
        <div className="card">
          <h1 className="title">Agent Onboarding Complete</h1>

          <div className="success-icon"></div>

          <h2 className="main-message">Agent Created Successfully</h2>
          <p className="sub-message">KYC Verified</p>

          <p className="description">
            The agent has been successfully onboarded and is now ready to start working 
            with AgriConnect. You can now assign orders to the agent or view their profile.
          </p>

          <button className="btn-dashboard" onClick={handleApprove}>
            Go to Agent Dashboard
          </button>
        </div>
      </div>
    </>
  );
};

export default AgentOnboarded;