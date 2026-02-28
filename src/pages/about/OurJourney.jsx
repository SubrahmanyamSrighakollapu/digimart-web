// src/components/OurJourney.jsx

import React from 'react';

// Replace with your actual image path
import journeyImage from '../../assets/groceryweb/grocery.png';

const OurJourney = () => {
  const highlights = [
    'Direct Brand Partnerships',
    '24-Hour Delivery',
    'Zero Minimum Order',
    'Digital First',
  ];

  return (
    <section
      className="py-5 py-lg-6"
      style={{
        backgroundColor: '#fff',
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      <div className="container">
        {/* Centered Heading Section */}
        <div className="text-center mb-5 mb-lg-5">
          <h2
            className="fw-bold"
            style={{
              color: '#EC5609',
              fontSize: '2.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}
          >
            OUR JOURNEY
          </h2>

          <h3
            className="fw-bold"
            style={{
              color: '#24231D',
              fontSize: '2.1rem',
              marginBottom: '1.5rem',
            }}
          >
            Built by Retailers, For Retailers
          </h3>
        </div>

        {/* Main Content Row: Text left | Image right */}
        <div className="row align-items-center g-5">
          {/* Left - All Text Content */}
          <div className="col-lg-6 order-lg-1">
            <div className="pe-lg-4">
              <p
                style={{
                  color: '#555555',
                  fontSize: '1.15rem',
                  lineHeight: '1.75',
                  marginBottom: '2rem',
                }}
              >
                It started with a simple observation: small retail stores were getting squeezed out by online giants and modern trade. They couldn’t access the same wholesale prices, reliable supply chains, or digital tools.
              </p>

              <p
                style={{
                  color: '#555555',
                  fontSize: '1.15rem',
                  lineHeight: '1.75',
                  marginBottom: '2rem',
                }}
              >
                Our founders, having spent decades in FMCG distribution, knew there was a better way. In 2019, we launched with a radical idea: give every kirana store owner the same advantages as big retailers.
              </p>

              <p
                style={{
                  color: '#555555',
                  fontSize: '1.15rem',
                  lineHeight: '1.75',
                  marginBottom: '2.5rem',
                }}
              >
                Today, we’re India’s fastest-growing wholesale platform, serving over 20,000 retailers across 50+ cities. But we’re just getting started.
              </p>

              {/* Highlights - 2 per row */}
              <div className="row g-4">
                {highlights.map((point, index) => (
                  <div key={index} className="col-md-6">
                    <div className="d-flex align-items-start">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                        style={{
                          width: '60px',
                          height: '60px',
                          backgroundColor: 'rgba(236, 86, 9, 0.10)',
                          color: '#EC5609',
                        }}
                      >
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <p
                        className="mb-0 pt-2"
                        style={{
                          fontSize: '1.18rem',
                          fontWeight: 600,
                          color: '#24231D',
                        }}
                      >
                        {point}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Image */}
          <div className="col-lg-6 order-lg-2">
            <div
              className="rounded-4 overflow-hidden shadow-lg"
              style={{
                border: '8px solid #ffffff',
                boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
              }}
            >
              <img
                src={journeyImage}
                alt="Traditional Indian dals and pulses in bowls"
                className="w-100"
                style={{
                  display: 'block',
                  borderRadius: '12px',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurJourney;