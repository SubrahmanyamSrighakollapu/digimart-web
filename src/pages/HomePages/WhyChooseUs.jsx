// src/components/WhyChooseUs.jsx

import React from 'react';
// Assuming you have react-icons installed
import { FaTruckFast, FaChartLine, FaBoxOpen, FaMobileScreen } from 'react-icons/fa6';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaTruckFast size={38} color="#EC5609" />,
      title: 'Fast Delivery',
      description:
        'Guaranteed 24-hour turnaround for all orders in metro cities. Never run out of stock.',
    },
    {
      icon: <FaChartLine size={38} color="#EC5609" />,
      title: 'Better Margins',
      description:
        'Eliminate middlemen. Get direct-from-brand wholesale prices to increase your profits.',
    },
    {
      icon: <FaBoxOpen size={38} color="#EC5609" />,
      title: '5000+ SKUs',
      description:
        'Access a wide range of categories including Staples, Snacks, and Personal Care brands.',
    },
    {
      icon: <FaMobileScreen size={38} color="#EC5609" />,
      title: 'Easy Ordering',
      description:
        'Our mobile-first platform lets you place orders in seconds, even while serving customers.',
    },
  ];

  return (
    <section
      className="py-5 py-lg-5"
      style={{
        backgroundColor: '#F7EEEA',
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      <div className="container">
        {/* Section Title */}
        <div className="text-center mb-5">
          <h2
            className="fw-bold"
            style={{
              color: '#24231D',
              fontSize: '2.5rem',
            }}
          >
            Why Choose Us
          </h2>
          <div
            style={{
              width: '80px',
              height: '4px',
              backgroundColor: '#EC5609',
              margin: '1rem auto 0',
              borderRadius: '2px',
            }}
          />
        </div>

        {/* Features Grid */}
        <div className="row g-4 justify-content-center">
          {features.map((feature, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <div
                className="h-100 text-center p-4 rounded-2 shadow-sm transition-all"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #f0e0d8',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(236,86,9,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                }}
              >
                {/* Icon in circle-like bg */}
                <div
                  className="mb-4 d-inline-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: 'rgba(236, 86, 9, 0.08)',
                  }}
                >
                  {feature.icon}
                </div>

                <h3
                  className="fw-bold mb-3"
                  style={{
                    color: '#24231D',
                    fontSize: '1.5rem',
                  }}
                >
                  {feature.title}
                </h3>

                <p
                  style={{
                    color: '#555555',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    marginBottom: 0,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional minimal custom style */}
      <style>{`
        .transition-all:hover {
          transform: translateY(-8px);
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;