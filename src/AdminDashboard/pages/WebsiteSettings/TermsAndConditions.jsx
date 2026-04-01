// TermsAndConditions.jsx
import React from 'react';

const termsData = [
  {
    number: "01",
    title: "General",
    content: [
      "These Terms govern your use of our Website, mobile application, and all related services provided by TotalneedsMarketing, an Indian company with its registered office at [Insert Address].",
      "We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Website implies acceptance of the updated Terms."
    ]
  },
  {
    number: "02",
    title: "Eligibility",
    content: [
      "You must be at least 18 years old to use this Website. By using this Website, you represent that you are legally competent to enter into a binding contract under applicable laws."
    ]
  },
  {
    number: "03",
    title: "User Account and Security",
    content: [
      "You may need to create an account to access certain features.",
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
      "We are not liable for any loss or damage resulting from your failure to safeguard your account."
    ]
  },
  {
    number: "04",
    title: "Products and Services",
    content: [
      "We strive to ensure that product descriptions, prices, and availability are accurate. However, we do not warrant that all information is error-free or current.",
      "Prices are subject to change without notice.",
      "All products and services are subject to availability, and we reserve the right to limit or refuse any order."
    ]
  },
  {
    number: "05",
    title: "Orders and Payment",
    content: [
      "By placing an order, you agree to pay the full amount due, including any applicable taxes and shipping charges.",
      "We accept payments through trusted third-party gateways. We do not store your credit/debit card details.",
      "Order confirmation is subject to successful payment and verification."
    ]
  }
];

const TermsAndConditions = () => {
  const lastUpdated = "01 Dec 2025"; // ← you can make this dynamic later

  return (
    <>
      <style>{`
        .terms-page {
          padding: 24px 32px;
          background: #f5f7fa;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1a1a1a;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .update-date {
          color: #64748b;
          font-size: 14px;
          margin: 0 0 8px 0;
        }

        .intro-text {
          color: #334155;
          font-size: 15px;
          margin: 0 0 32px 0;
          line-height: 1.6;
        }

        .terms-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          padding: 32px;
          margin-bottom: 32px;
        }

        .section {
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: rgba(75, 175, 71, 1);
          margin: 0 0 12px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-number {
          width: 32px;
          height: 32px;
          background: rgba(75, 175, 71, 0.1);
          color: rgba(75, 175, 71, 1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 15px;
          flex-shrink: 0;
        }

        .section-content {
          font-size: 15px;
          line-height: 1.7;
          color: #334155;
        }

        ul {
          list-style-type: disc;
          padding-left: 24px;
          margin: 12px 0;
        }

        li {
          margin-bottom: 10px;
        }
      `}</style>

      <div className="terms-page">
        <h1 className="page-title">Terms & Conditions</h1>
        <p className="update-date">Last Updated: {lastUpdated}</p>
        <p className="intro-text">
          Please read these terms carefully before using our platform for bulk grain purchasing and logistic services.
        </p>

        <div className="terms-card">
          {termsData.map((section) => (
            <div key={section.number} className="section">
              <h2 className="section-title">
                <span className="section-number">{section.number}</span>
                {section.title}
              </h2>
              <div className="section-content">
                <ul>
                  {section.content.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;