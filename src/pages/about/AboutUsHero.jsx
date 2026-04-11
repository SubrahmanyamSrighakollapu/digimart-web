// src/components/AboutUsHero.jsx

import React from 'react';

// You can replace these with your own local SVG/icon images or use react-icons
// For exact match, assuming simple line icons in orange circles
// Here using emoji-style placeholders + react-icons alternative

// If you have custom images:
// import retailIcon from '../assets/icons/retail-partners.png';
// import productsIcon from '../assets/icons/products-listed.png';
// import deliveryIcon from '../assets/icons/delivery-time.png';
// import brandsIcon from '../assets/icons/brand-partners.png';

import { FaStore, FaShoppingBag, FaClock, FaStar } from 'react-icons/fa';

const stats = [
  {
    icon: <FaStore size={30} color="#EC5609" />,
    value: '20,000+',
    label: 'Retail Partners',
  },
  {
    icon: <FaShoppingBag size={30} color="#EC5609" />,
    value: '5,234',
    label: 'Products Listed',
  },
  {
    icon: <FaClock size={30} color="#EC5609" />,
    value: '24hrs',
    label: 'Delivery Time',
  },
  {
    icon: <FaStar size={30} color="#EC5609" />,
    value: '200+',
    label: 'Brand Partners',
  },
];

const AboutUsHero = () => {
  return (
    <section
      className="py-5 py-lg-6"
      style={{
        backgroundColor: '#F7EEEA', // light peach/beige consistent with previous sections
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      <div className="container">
        {/* Main Heading & Description */}
        <div className="text-center mb-5 mb-lg-5">
          <h1
            className="fw-bold display-5"
            style={{
              color: '#24231D',
              lineHeight: '1.15',
              marginBottom: '1.25rem',
            }}
          >
            Empowering India's Retail
            <br />
            <span style={{ color: '#EC5609' }}>Revolution</span>
          </h1>

          <p
            className="fs-5 fw-medium mx-auto"
            style={{
              color: '#555555',
              maxWidth: '820px',
              lineHeight: '1.6',
              marginBottom: '2.5rem',
              textAlign:'center'
            }}
          >
            We're on a mission to democratize wholesale grocery distribution, helping 20,000+ local retailers compete and thrive in the modern marketplace.
          </p>

          <a
            href="/login" // ← update to your actual partner route
            className="btn btn-lg px-5 py-3 fw-semibold text-white"
            style={{
              backgroundColor: '#EC5609',
              borderRadius: '10px',
              fontSize: '1rem',
              padding: '1rem 3rem',
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
            Partner With Us
          </a>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 g-md-5 justify-content-center">
          {stats.map((stat, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <div
                className="text-center p-4 p-lg-5 rounded-4 h-100"
                // style={{
                //   backgroundColor: '#ffffff',
                //   border: '1px solid #f0e0d8',
                //   boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
                //   transition: 'all 0.3s ease',
                // }}
                // onMouseEnter={(e) => {
                //   e.currentTarget.style.transform = 'translateY(-10px)';
                //   e.currentTarget.style.boxShadow = '0 15px 35px rgba(236,86,9,0.15)';
                // }}
                // onMouseLeave={(e) => {
                //   e.currentTarget.style.transform = 'translateY(0)';
                //   e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.05)';
                // }}
              >
                {/* Icon in circle */}
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-2 mb-4"
                  style={{
                    width: '70px',
                    height: '70px',
                    backgroundColor: 'rgba(236, 86, 9, 0.08)',
                  }}
                >
                  {stat.icon}
                </div>

                <h3
                  className="fw-bold mb-2"
                  style={{
                    color: '#24231D',
                    fontSize: '2rem',
                  }}
                >
                  {stat.value}
                </h3>

                <p
                  className="fw-medium"
                  style={{
                    color: '#555555',
                    fontSize: '1.2rem',
                    marginBottom: 0,
                    textAlign:'center'
                  }}
                >
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUsHero;