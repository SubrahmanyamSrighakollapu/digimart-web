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
      className="py-5 py-md-6 py-lg-7"
      style={{
        backgroundColor: '#F7EEEA',
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5 mb-lg-6">
          <h2
            className="fw-bold mb-3"
            style={{
              color: '#EC5609',
              fontSize: "2rem", // responsive sizing, bigger on desktop
              lineHeight: 1.1,
            }}
          >
            Start Growing in 3 Simple Steps
          </h2>
          <p
            className="mx-auto"
            style={{
              color: '#555555',
              fontSize: "1rem",
              fontWeight: 500,
              maxWidth: '820px',
              lineHeight: 1.5,
              textAlign:'center'
            }}
          >
            Getting set up as a wholesale partner is fast and entirely digital
          </p>
        </div>

        {/* Steps */}
        <div className="row g-4 g-lg-5 justify-content-center">
          {steps.map((step, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div
                className="h-100 text-center p-4 p-lg-5 d-flex flex-column align-items-center justify-content-between"
              >
                {/* Orange Circle */}
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle mb-4 flex-shrink-0"
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#EC5609', 
                    color: '#ffffff',
                    fontSize: '2rem',
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {step.number}
                </div>

                {/* Title */}
                <h3
                  className="fw-bold mb-3"
                  style={{
                    color: '#24231D',
                    fontSize: '1.5rem',
                    lineHeight: 1.2,
                  }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    color: '#555555',
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    marginBottom: 'auto', // pushes content up if needed
                    textAlign: 'center',
                  }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-5 mt-lg-6 pt-3 pt-lg-4">
          <a
            href="/register" // ← replace with your actual route
            className="btn btn-lg fw-semibold text-white shadow-lg"
            style={{
              backgroundColor: '#EC5609',
              border: 'none',
              borderRadius: '10px',     // pill shape — more modern & common in Figma e-com designs
              fontSize: '1rem',
              padding: '1rem 3.5rem',
              transition: 'all 0.35s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d44e08';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(236,86,9,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#EC5609';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(236,86,9,0.25)';
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