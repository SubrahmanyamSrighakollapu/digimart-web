// src/components/Testimonials.jsx

import React from 'react';

const testimonials = [
  {
    quote:
      '"Ordering from local distributors was a nightmare. Now I do it all from my phone at 11 PM and get my stock the next afternoon."',
    author: 'Ram Kumar',
    initials: 'RK',
    store: 'Rani General Store, Mumbai',
  },
  {
    quote:
      '"Ordering from local distributors was a nightmare. Now I do it all from my phone at 11 PM and get my stock the next afternoon."',
    author: 'Ram Kumar',
    initials: 'RK',
    store: 'Rani General Store, Mumbai',
  },
  {
    quote:
      '"Ordering from local distributors was a nightmare. Now I do it all from my phone at 11 PM and get my stock the next afternoon."',
    author: 'Ram Kumar',
    initials: 'RK',
    store: 'Rani General Store, Mumbai',
  },
];

const Testimonials = () => {
  return (
    <section
      className="py-5 py-lg-5"
      style={{
        backgroundColor: '#F7EEEA',
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <h2
            className="fw-bold"
            style={{
              color: '#EC5609',
              fontSize: '2.5rem',
              marginBottom: '0.75rem',
            }}
          >
            Trusted by Store Owners Like You
          </h2>
          <p
            style={{
              color: '#555555',
              fontSize: '1.25rem',
              fontWeight: 500,
              textAlign:"center"
            }}
          >
            Real stories from the retail community
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="row g-4 justify-content-center">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div
                className="h-100 p-4 p-lg-5 rounded-4 position-relative"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #f0e0d8',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.06)',
                  transition: 'all 0.35s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 45px rgba(236,86,9,0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.06)';
                }}
              >
                {/* Stars */}
                <div className="mb-4" style={{ color: '#EC5609', fontSize: '1.6rem', letterSpacing: '0.15em' }}>
                  ★★★★★
                </div>

                {/* Quote */}
                <p
                  className="mb-4"
                  style={{
                    color: '#24231D',
                    fontSize: '1.1rem',
                    lineHeight: '1.7',
                    fontStyle: 'italic',
                    fontWeight: 500,
                  }}
                >
                  {testimonial.quote}
                </p>

                {/* Author Info */}
                <div className="d-flex align-items-center">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                    style={{
                      width: '56px',
                      height: '56px',
                      backgroundColor: '#EC5609',
                      color: '#ffffff',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                    }}
                  >
                    {testimonial.initials}
                  </div>

                  <div>
                    <h5
                      className="fw-bold mb-0"
                      style={{
                        color: '#24231D',
                        fontSize: '1.15rem',
                      }}
                    >
                      {testimonial.author}
                    </h5>
                    <p
                      className="mb-0"
                      style={{
                        color: '#777777',
                        fontSize: '0.95rem',
                      }}
                    >
                      {testimonial.store}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;