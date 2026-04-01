// PrivacyPolicy.jsx
import React from 'react';

const privacyData = [
  {
    number: "01",
    title: "Information We Collect",
    subsections: [
      {
        subtitle: "A. Personal Information",
        points: [
          "Name",
          "Email address",
          "Phone number",
          "Phone and shipping address",
          "Billing and shipping address",
          "Payment details (via secure third-party gateways)",
          "Usernames and passwords",
          "Any other information voluntarily provided"
        ]
      },
      {
        subtitle: "B. Non-Personal Information",
        points: [
          "IP address",
          "Browser type",
          "Device type",
          "Device information",
          "Referring website URLs",
          "Your interactions with the website (pages visited, time spent, etc.)"
        ]
      }
    ]
  },
  {
    number: "02",
    title: "How We Use Your Information",
    points: [
      "To process and fulfill your orders",
      "To communicate with you (order status, offers, customer service)",
      "To personalize your shopping experience",
      "To improve our website, products, and services",
      "To comply with legal obligations",
      "To prevent fraud and ensure security"
    ]
  }
];

const PrivacyPolicy = () => {
  const lastUpdated = "01 Dec 2025";

  return (
    <>
      <style>{`
        .privacy-policy-page {
          padding: 32px 40px;
          background: #f8fafc;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1f2937;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px 0;
        }

        .last-updated {
          color: #10b981;
          font-weight: 600;
          font-size: 15px;
          margin: 0 0 32px 0;
        }

        .policy-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          padding: 40px;
        }

        .section {
          margin-bottom: 40px;
        }

        .section-title {
          font-size: 22px;
          font-weight: 700;
          color: #10b981;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-number {
          width: 38px;
          height: 38px;
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 17px;
          flex-shrink: 0;
        }

        .subsection-title {
          font-size: 17px;
          font-weight: 600;
          color: #374151;
          margin: 20px 0 12px 0;
        }

        .points-list {
          list-style: none;
          padding-left: 0;
          margin: 0;
        }

        .points-list li {
          position: relative;
          padding-left: 24px;
          margin-bottom: 10px;
          font-size: 15px;
          line-height: 1.65;
          color: #374151;
        }

        .points-list li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #6b7280;
          font-size: 18px;
          line-height: 1;
        }

        .sub-bullet {
          padding-left: 48px;
        }

        .sub-bullet:before {
          content: "•";
          left: 24px;
        }
      `}</style>

      <div className="privacy-policy-page">
        <div className="container">
          <h1 className="page-title">Privacy Policy</h1>
          <div className="last-updated">Last Updated: {lastUpdated}</div>

          <div className="policy-card">
            {privacyData.map((section) => (
              <div key={section.number} className="section">
                <h2 className="section-title">
                  <span className="section-number">{section.number}</span>
                  {section.title}
                </h2>

                {section.subsections ? (
                  <>
                    {section.subsections.map((sub, subIdx) => (
                      <div key={subIdx}>
                        <h3 className="subsection-title">{sub.subtitle}</h3>
                        <ul className="points-list">
                          {sub.points.map((point, idx) => (
                            <li 
                              key={idx}
                              className={point.startsWith("•") ? "sub-bullet" : ""}
                            >
                              {point.replace(/^•\s*/, '')}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </>
                ) : (
                  <ul className="points-list">
                    {section.points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;