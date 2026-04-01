// RefundPolicy.jsx
import React from 'react';

const refundData = [
  {
    number: "01",
    title: "Eligibility for Return / Replacement",
    content: [
      "Due to the nature of wholesale transactions, returns are only accepted under the following conditions:",
      "• Damaged or Defective Products: If you receive goods that are damaged, defective, or not as per your purchase order.",
      "• Incorrect Items Received: If the product specifications (model, size, quantity, or variant) differ from what was ordered.",
      "• Manufacturing Defect: Valid only with photographic/video proof.",
      "Returns will NOT be accepted for buyer's remorse, unsold inventory, or minor packaging damage that does not affect product usability."
    ]
  },
  {
    number: "02",
    title: "Return Request Process",
    content: [
      "To request a return or replacement:",
      "a. Contact our support team at info@totalneedsmarketing.com / +91 9581906060 within 48 hours of delivery.",
      "b. Provide:",
      "• Order ID / Invoice Number",
      "• Photos or videos clearly showing the issue",
      "• Number of affected units",
      "c. After verification, we will confirm approval or rejection of your request.",
      "No returns will be accepted without prior authorization."
    ]
  },
  {
    number: "03",
    title: "Pickup / Return Shipping",
    content: [
      "• If the return is approved due to our fault (wrong, defective, or damaged items), we will arrange pickup / reimburse return shipping.",
      "• If the return is requested for other reasons and accepted as per mutual agreement, the buyer will bear return logistics costs."
    ]
  },
  {
    number: "04",
    title: "Refund / Replacement Terms",
    content: [
      "Once the returned goods are received and inspected:",
      "• Refunds (if applicable) will be processed within 7-10 business days via the original payment method or store credit.",
      "• Replacements will be dispatched based on stock availability."
    ]
  },
  {
    number: "05",
    title: "Order Cancellation Policy",
    content: [
      "• Wholesale orders cannot be cancelled once processed or dispatched.",
      "• For prepaid orders, advance payments are non-refundable.",
      "• For prepaid custom / bulk manufacturing orders, no cancellation is allowed."
    ]
  }
];

const RefundPolicy = () => {
  const effectiveDate = "01-10-2025";

  return (
    <>
      <style>{`
        .refund-policy-page {
          padding: 32px 40px;
          background: #f8fafc;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1f2937;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px 0;
        }

        .effective-date {
          color: #10b981;
          font-weight: 600;
          font-size: 15px;
          margin: 0 0 24px 0;
        }

        .policy-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          padding: 36px;
          max-width: 900px;
          margin: 0 auto;
        }

        .section {
          margin-bottom: 36px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #10b981;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-number {
          width: 36px;
          height: 36px;
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          flex-shrink: 0;
        }

        .section-content {
          font-size: 15px;
          line-height: 1.7;
          color: #374151;
        }

        ul {
          list-style-type: none;
          padding-left: 0;
          margin: 12px 0;
        }

        li {
          margin-bottom: 12px;
          position: relative;
          padding-left: 24px;
        }

        li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #6b7280;
        }

        .sub-bullet {
          margin-left: 24px;
        }
      `}</style>

      <div className="refund-policy-page">
        <div className="policy-card">
          <h1 className="page-title">Refund Policy</h1>
          <div className="effective-date">Effective Date: {effectiveDate}</div>

          {refundData.map((section) => (
            <div key={section.number} className="section">
              <h2 className="section-title">
                <span className="section-number">{section.number}</span>
                {section.title}
              </h2>

              <div className="section-content">
                <ul>
                  {section.content.map((point, idx) => (
                    <li 
                      key={idx}
                      className={point.startsWith("•") ? "sub-bullet" : ""}
                    >
                      {point.replace(/^•\s*/, '')}
                    </li>
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

export default RefundPolicy;