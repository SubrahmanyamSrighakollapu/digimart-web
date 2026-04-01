// OtpVerification.jsx
import React, { useState, useEffect, useRef } from 'react';

const AgentOtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(50); // starting from 50 seconds
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  // Handle input change & auto-focus next field
  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace → move to previous field
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData.length === 4 && /^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[3].focus();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <style>{`
        .otp-page {
          min-height: 100vh;
          background: #f5f7fa;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .otp-card {
          background: white;
          border-radius: 5px;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
          padding: 48px 40px;
          width: 100%;
          max-width: 460px;
          text-align: center;
        }

        .title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 12px 0;
        }

        .subtitlee {
          color: #64748b;
          font-size: 15px;
          line-height: 1.5;
          margin: 0 0 40px 0;
        }

        .otp-inputs {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .otp-box {
          width: 60px;
          height: 60px;
          border: 2px solid #d1d9e0;
          border-radius: 12px;
          font-size: 28px;
          font-weight: 600;
          text-align: center;
          background: #f8fafc;
          transition: all 0.2s;
        }

        .otp-box:focus {
          outline: none;
          border-color: rgba(75, 175, 71, 1);
          box-shadow: 0 0 0 3px rgba(75, 175, 71, 0.2);
        }

        .timer-resend {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          font-size: 14px;
          color: #64748b;
        }

        .resend-link {
          color: rgba(75, 175, 71, 1);
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
        }

        .resend-link:hover {
          text-decoration: underline;
        }

        .verify-btn {
          width: 100%;
          padding: 14px;
          background: rgba(75, 175, 71, 1);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          margin-bottom: 16px;
        }

        .verify-btn:hover {
          background: rgba(65, 155, 61, 1);
        }

        .cancel-btn {
          width: 100%;
          padding: 14px;
          background: transparent;
          border: 2px solid #d1d9e0;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
        }

        .cancel-btn:hover {
          background: #f1f5f9;
        }
      `}</style>

      <div className="otp-page">
        <div className="otp-card">
          <h1 className="title">OTP Verification</h1>
          <p className="subtitlee">
            Please enter the OTP sent to your registered email/phone number to
            complete your verification
          </p>

          <div className="otp-inputs" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="otp-box"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <div className="timer-resend">
            <span>Remaining time : {formatTime(timeLeft)}s</span>
            <span>
              Didn't got the code?{' '}
              <span className="resend-link">Resend</span>
            </span>
          </div>

          <button className="verify-btn">Verify</button>
          <button className="cancel-btn">Cancel</button>
        </div>
      </div>
    </>
  );
};

export default AgentOtpVerification;