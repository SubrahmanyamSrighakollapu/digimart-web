// src/components/OurPurpose.jsx

import React from 'react';
import { FaBullseye, FaEye } from 'react-icons/fa6';

const OurPurpose = () => {
  return (
    <section
      className="py-5 py-lg-6"
      style={{
        backgroundColor: '#fff',
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      <div className="container">
        <div className="row g-5 align-items-center justify-content-center">
          
          {/* Left - Our Mission */}
          <div className="col-lg-6">
            <div
              className="h-100 p-4 p-lg-5 rounded-4 text-center text-lg-start"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #f0e0d8',
                boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Icon Circle */}
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-2 mb-4 mx-lg-0 mx-auto"
                style={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: '#EC5609',
                  color: '#ffffff',
                  fontSize: '2.5rem',
                }}
              >
                <FaBullseye />
              </div>

              <h2
                className="fw-bold mb-3"
                style={{
                  color: '#24231D',
                  fontSize: '2rem',
                }}
              >
                Our Mission
              </h2>

              <p
                className="mb-4"
                style={{
                  color: '#555555',
                  fontSize: '1.15rem',
                  lineHeight: '1.7',
                  fontWeight: 500,
                }}
              >
                To empower every Indian retailer with technology, access, and fair pricing that levels the playing field.
              </p>

              <p
                style={{
                  color: '#666666',
                  fontSize: '1.05rem',
                  lineHeight: '1.75',
                }}
              >
                We believe local stores are the backbone of Indian commerce. Our mission is to give them the tools, inventory access, and support they need to compete with anyone—from online marketplaces to modern trade chains.
              </p>
            </div>
          </div>

          {/* Right - Our Vision */}
          <div className="col-lg-6">
            <div
              className="h-100 p-4 p-lg-5 rounded-4 text-center text-lg-start"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #f0e0d8',
                boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Icon Circle */}
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-2 mb-4 mx-lg-0 mx-auto"
                style={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: '#EC5609',
                  color: '#ffffff',
                  fontSize: '2.5rem',
                }}
              >
                <FaEye />
              </div>

              <h2
                className="fw-bold mb-3"
                style={{
                  color: '#24231D',
                  fontSize: '2rem',
                }}
              >
                Our Vision
              </h2>

              <p
                className="mb-4"
                style={{
                  color: '#555555',
                  fontSize: '1.15rem',
                  lineHeight: '1.7',
                  fontWeight: 500,
                }}
              >
                To become India's most trusted wholesale platform, serving 100,000+ retailers by 2030.
              </p>

              <p
                style={{
                  color: '#666666',
                  fontSize: '1.05rem',
                  lineHeight: '1.75',
                }}
              >
                We envision a future where every kirana store, supermarket, and retail chain—regardless of size—has instant access to the best products at the best prices. Where technology removes friction, not relationships. Where growth is sustainable and shared.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OurPurpose;