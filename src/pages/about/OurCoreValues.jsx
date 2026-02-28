// src/components/OurCoreValues.jsx

import React from 'react';
import { 
  FaHeart,          // for heart / Retailer First
  FaShieldHalved,   // for shield / Trust & Transparency
  FaBolt,           // for lightning / Speed & Efficiency
  FaLeaf            // for leaf / Sustainable Growth
} from 'react-icons/fa6';

const coreValues = [
  {
    icon: <FaHeart size={48} />,
    title: 'Retailer First',
    description:
      'Every decision we make starts with our retail partners. Their success is our success.'
  },
  {
    icon: <FaShieldHalved size={48} />,
    title: 'Trust & Transparency',
    description:
      'No hidden fees, no middlemen. Just honest pricing and reliable service.'
  },
  {
    icon: <FaBolt size={48} />,
    title: 'Speed & Efficiency',
    description:
      'We obsess over getting products to your doorstep faster than anyone else.'
  },
  {
    icon: <FaLeaf size={48} />,
    title: 'Sustainable Growth',
    description:
      'Building a business that benefits retailers, brands, and communities alike.'
  },
];

const OurCoreValues = () => {
  return (
    <section
      className="py-5 py-lg-6"
      style={{
        backgroundColor: '#F7EEEA', // light peach/beige consistent with most sections
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
            Our Core Values
          </h2>
          <p
            className="fs-5 fw-medium mx-auto"
            style={{
              color: '#555555',
              maxWidth: '720px',
              lineHeight: '1.6',
            }}
          >
            These principles guide every decision we make, from product development to customer service.
          </p>
        </div>

        {/* Values Grid */}
        <div className="row g-4 g-lg-5 justify-content-center">
          {coreValues.map((value, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <div
                className="text-center p-4 p-lg-5 rounded-4 h-100"
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
                {/* Icon Circle */}
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-4"
                  style={{
                    width: '110px',
                    height: '110px',
                    backgroundColor: '#EC5609',
                    color: '#ffffff',
                  }}
                >
                  {value.icon}
                </div>

                {/* Title */}
                <h3
                  className="fw-bold mb-3"
                  style={{
                    color: '#24231D',
                    fontSize: '1.6rem',
                  }}
                >
                  {value.title}
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
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurCoreValues;