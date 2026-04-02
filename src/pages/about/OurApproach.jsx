// src/components/OurApproach.jsx

import React from 'react';
import { 
  FaHandshake, 
  FaTruckFast, 
  FaHeadset, 
  FaMobileScreen,  // Updated from FaMobileAlt
  FaRobot, 
  FaShieldHalved 
} from 'react-icons/fa6';

const approachPoints = [
  {
    icon: <FaHandshake size={28} />,
    text: 'Direct partnerships with 120+ FMCG brands'
  },
  {
    icon: <FaTruckFast size={28} />,
    text: '24-hour delivery across 50+ cities'
  },
  {
    icon: <FaHeadset size={28} />,
    text: 'Dedicated relationship managers'
  },
  {
    icon: <FaMobileScreen size={28} />,
    text: 'Mobile-first platform for on-the-go ordering'
  },
  {
    icon: <FaRobot size={28} />,
    text: 'AI-powered inventory optimization'
  },
  {
    icon: <FaShieldHalved size={28} />,
    text: 'Zero hidden fees or surprise charges'
  },
];

const OurApproach = () => {
  return (
    <section
      className="py-5 py-lg-6"
      style={{
        backgroundColor: '#F7EEEA',
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">
            {/* Card Container */}
            <div
              className="rounded-4 overflow-hidden shadow-lg"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #f0e0d8',
              }}
            >
              {/* Orange Header Bar */}
              <div
                className="d-flex align-items-center p-4 p-lg-5"
                style={{
                  backgroundColor: '#EC5609',
                  color: '#ffffff',
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle me-4 flex-shrink-0"
                  style={{
                    width: '90px',
                    height: '90px',
                    backgroundColor: 'rgba(255,255,255,0.25)',
                  }}
                >
                  <FaHandshake size={48} color="#ffffff" />
                </div>

                <h2
                  className="fw-bold mb-0"
                  style={{
                    fontSize: '2.4rem',
                    color:'#fff'
                  }}
                >
                  Our Approach
                </h2>
              </div>

              {/* Content Area */}
              <div className="p-4 p-lg-5">
                <div className="row g-4 g-lg-5">
                  {/* Left Column */}
                  <div className="col-lg-6">
                    <ul className="list-unstyled mb-0">
                      {approachPoints.slice(0, 3).map((item, index) => (
                        <li
                          key={index}
                          className="d-flex align-items-start mb-4"
                        >
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                            style={{
                              width: '60px',
                              height: '60px',
                              backgroundColor: 'rgba(236, 86, 9, 0.10)',
                              color: '#EC5609',
                            }}
                          >
                            {item.icon}
                          </div>
                          <p
                            className="mb-0 pt-2"
                            style={{
                              fontSize: '1.15rem',
                              lineHeight: '1.6',
                              color: '#444444',
                              fontWeight: 500,
                            }}
                          >
                            {item.text}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Column */}
                  <div className="col-lg-6">
                    <ul className="list-unstyled mb-0">
                      {approachPoints.slice(3).map((item, index) => (
                        <li
                          key={index}
                          className="d-flex align-items-start mb-4"
                        >
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                            style={{
                              width: '60px',
                              height: '60px',
                              backgroundColor: 'rgba(236, 86, 9, 0.10)',
                              color: '#EC5609',
                            }}
                          >
                            {item.icon}
                          </div>
                          <p
                            className="mb-0 pt-2"
                            style={{
                              fontSize: '1.15rem',
                              lineHeight: '1.6',
                              color: '#444444',
                              fontWeight: 500,
                            }}
                          >
                            {item.text}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurApproach;