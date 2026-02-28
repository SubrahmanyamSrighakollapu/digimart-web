// src/components/OnboardingProcess.jsx

import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Submit Application',
    description:
      'Fill out the partnership form with your brand details'
  },
  {
    number: '02',
    title: 'Initial Meeting',
    description:
      'Our team reviews and schedules a consultation call'
  },
  {
    number: '03',
    title: 'Onboarding',
    description:
      'Product listing, pricing, and logistics setup'
  },
  {
    number: '04',
    title: 'Go Live',
    description:
      'Your products reach 20,000+ retailers instantly'
  },
];

const OnboardingProcess = () => {
  return (
    <section
      className="py-5 py-lg-6"
      style={{
        backgroundColor: '#F7EEEA',
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
            Simple Onboarding Process
          </h2>

          <p
            className="fs-5 fw-medium mx-auto"
            style={{
              color: '#555555',
              maxWidth: '720px',
              lineHeight: '1.6',
            }}
          >
            From application to distribution in less than 2 weeks
          </p>
        </div>

        {/* Steps Row */}
        <div className="row g-4 g-lg-5 justify-content-center align-items-stretch">
          {steps.map((step, index) => (
            <div key={index} className="col-lg-3 col-md-6">
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
                {/* Orange Number Circle */}
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle mb-4 flex-shrink-0"
                  style={{
                    width: '110px',
                    height: '110px',
                    backgroundColor: '#EC5609',
                    color: '#ffffff',
                    fontSize: '2.8rem',
                    fontWeight: 700,
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
                    fontSize: '1.55rem',
                    minHeight: '50px',
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
      </div>
    </section>
  );
};

export default OnboardingProcess;