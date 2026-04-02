// src/components/WhyBrandUs.jsx

import React from 'react';
import { 
  FaUsers, 
  FaChartLine, 
  FaRocket, 
  FaShieldHalved 
} from 'react-icons/fa6';

const benefits = [
  {
    icon: <FaUsers size={30} />,
    title: 'Reach 20,000+ Retailers',
    description:
      'Instant 50+ cities distribution across kirana stores, supermarkets, and retail chains.'
  },
  {
    icon: <FaChartLine size={30} />,
    title: 'Data-Driven Insights',
    description:
      'Real-time sales analytics. Understand demand patterns. Optimize inventory and pricing strategies.'
  },
  {
    icon: <FaRocket size={30} />,
    title: 'Fast Market Entry',
    description:
      'Launch new products in weeks, not months. Test markets quickly with our extensive retailer network.'
  },
  {
    icon: <FaShieldHalved size={30} />,
    title: 'Brand Protection',
    description:
      'Direct-to-retailer model ensures price control. Prevent grey market leakage and maintain brand integrity.'
  },
];

const WhyBrandUs = () => {
  return (
    <section
      className="py-5 py-lg-6"
      style={{
        backgroundColor: '#fff',
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
              fontSize: '2rem',
              marginBottom: '0.75rem',
            }}
          >
            Why Brands Partner With Us
          </h2>
          <p
            className="fs-5 fw-medium mx-auto"
            style={{
              color: '#555555',
              maxWidth: '720px',
              lineHeight: '1.6',
              textAlign:'center'
            }}
          >
            Reach more retailers, faster, with data-driven distribution
          </p>
        </div>

        {/* Cards Grid */}
        <div className="row g-4 g-lg-5 justify-content-center">
          {benefits.map((benefit, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <div
                className="h-100 text-center p-4 p-lg-5 rounded-4 shadow-sm"
                style={{
                  backgroundColor: '#F7EEEA',
                  border: '1px solid #f0e0d8',
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
                  className="d-flex align-items-center justify-content-center rounded-2 mx-auto mb-4"
                  style={{
                    width: '70px',
                    height: '70px',
                    backgroundColor: '#EC5609',
                    color: '#ffffff',
                  }}
                >
                  {benefit.icon}
                </div>

                {/* Title */}
                <h3
                  className="fw-bold mb-3"
                  style={{
                    color: '#24231D',
                    fontSize: '1.2rem',
                  }}
                >
                  {benefit.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    color: '#555555',
                    fontSize: '1.02rem',
                    lineHeight: '1.65',
                    marginBottom: 0,
                    textAlign:'center'
                  }}
                >
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBrandUs;