// src/components/ThreeSimpleSteps.jsx

import React from 'react';

const ThreeSimpleSteps = () => {
  const steps = [
    {
      number: '01',
      title: 'Register Your Store',
      description:
        'Complete the digital verification with your GST or business permit.',
    },
    {
      number: '02',
      title: 'Add Items to Cart',
      description:
        'Browse thousands of products at live wholesale prices and build your order.',
    },
    {
      number: '03',
      title: 'Receive Delivery',
      description:
        'Get your stock delivered to your store doorstep within 24 hours.',
    },
  ];

  return (
    <section
      className="py-5 py-lg-5"
      style={{
        backgroundColor: '#F7EEEA', // consistent light peach/beige from previous sections
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5 mb-lg-5">
          <h2
            className="fw-bold"
            style={{
              color: '#EC5609',
              fontSize: '2.5rem',
              marginBottom: '0.75rem',
            }}
          >
            Start Growing in 3 Simple Steps
          </h2>
          <p
            style={{
              color: '#555555',
              fontSize: '1.25rem',
              fontWeight: 500,
              maxWidth: '720px',
              margin: '0 auto',
            }}
          >
            Getting set up as a wholesale partner is fast and entirely digital
          </p>
        </div>

        {/* Steps Row */}
        <div className="row g-4 g-lg-5 justify-content-center align-items-stretch">
          {steps.map((step, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div
                className="h-100 d-flex flex-column align-items-center text-center p-4 p-lg-5 rounded-4"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #f0e0d8',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.06)',
                  transition: 'all 0.35s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px)';
                  e.currentTarget.style.boxShadow = '0 20px 45px rgba(236,86,9,0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.06)';
                }}
              >
                {/* Circle Number */}
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle mb-4"
                  style={{
                    width: '110px',
                    height: '110px',
                    backgroundColor: '#EC5609',
                    color: '#ffffff',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  {step.number}
                </div>

                {/* Title */}
                <h3
                  className="fw-bold mb-3"
                  style={{
                    color: '#24231D',
                    fontSize: '1.75rem',
                  }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    color: '#555555',
                    fontSize: '1.05rem',
                    lineHeight: '1.65',
                    marginBottom: 0,
                  }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-5 mt-lg-5 pt-3">
          <a
            href="/register" // ← update to your actual registration route
            className="btn btn-lg px-5 py-3 fw-semibold text-white"
            style={{
              backgroundColor: '#EC5609',
              borderRadius: '5px',
              fontSize: '1.25rem',
              padding: '1rem 3.5rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(236,86,9,0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d14c08';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(236,86,9,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#EC5609';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(236,86,9,0.25)';
            }}
          >
            Get Started Today
          </a>
        </div>
      </div>
    </section>
  );
};

export default ThreeSimpleSteps;