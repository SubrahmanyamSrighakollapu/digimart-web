// src/about/WhatMakesUsDifferent.jsx

import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import icon3 from '../../assets/about/Icon3.png';
import icon4 from '../../assets/about/Icon4.png';
import icon5 from '../../assets/about/Icon5.png';
import icon6 from '../../assets/about/Icon6.png';
import icon7 from '../../assets/about/Icon7.png';
import icon1 from '../../assets/about/Icon1.png';
import icon2 from '../../assets/about/Icon2.png';
import agentIcon from '../../assets/MainPage/Agent/Icon.png';
import revenueIcon from '../../assets/services/Icon1.png';

const WhatMakesUsDifferent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const features = [
    {
      icon: agentIcon,
      title: 'Creating Local Agents',
      text: 'Building a network of trusted local agents who understand their communities and provide personalized service.',
    },
    {
      icon: revenueIcon,
      title: 'Recurring Revenue',
      text: 'Sustainable business model ensuring consistent income streams for all stakeholders in the ecosystem.',
    },
    {
      icon: icon1,
      title: 'Online Platform',
      text: 'Digital marketplace connecting farmers, agents, and customers with seamless ordering and payment systems.',
    },
    {
      icon: icon2,
      title: 'Empowering Farmers',
      text: 'Providing farmers with better revenue opportunities through direct market access and fair pricing.',
    },
    {
      icon: icon3,
      title: 'Direct Farmer Partnerships',
      text: 'Sourcing directly from verified growers without hidden layers, ensuring fair pricing and better farmer income.',
    },
    {
      icon: icon4,
      title: 'Bulk & Retail Friendly',
      text: 'Flexible purchasing options tailored for businesses of all sizes from agents to large retailers.',
    },
    {
      icon: icon5,
      title: 'End-to-End Traceability',
      text: 'Full visibility from farm to shelf through transparent records and digital tracking.',
    },
    {
      icon: icon6,
      title: 'Agent-Centric Model',
      text: 'Empowering local agents with tools to source, trade, and scale efficiently.',
    },
    {
      icon: icon7,
      title: 'Sustainable Agriculture',
      text: 'Commitment to soil health, eco-friendly farming, and long-term sustainability.',
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 4) % features.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 4 + features.length) % features.length);
  };

  const getVisibleFeatures = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      visible.push(features[(currentIndex + i) % features.length]);
    }
    return visible;
  };

  return (
    <section className="w-100 position-relative mt-5 bg-white text-center py-5" style={{ padding: '5rem 2rem' }}>
      <h2 className="mb-5">
        OUR CORE SERVICES
      </h2>

      <div className="position-relative">
        <div className="d-flex justify-content-center mx-auto different-cards-wrapper" style={{
          gap: '2rem',
          maxWidth: '80rem'
        }}>
          {getVisibleFeatures().map((feature, index) => (
            <div key={`${currentIndex}-${index}`} className="d-flex flex-column align-items-center rounded p-4 different-card" style={{
              width: '18rem',
              height: 'auto',
              backgroundColor: '#EFFFF0',
              borderRadius: '0.5rem',
              padding: '2.5rem 1.5rem',
              boxSizing: 'border-box'
            }}>
              <div className="icon-bg mb-4">
                <img 
                  src={feature.icon} 
                  alt={feature.title} 
                  className="icon-img"
                  style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                />
              </div>

              <h3 className="card-title mb-3" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                {feature.title}
              </h3>

              <p className="mt-3" style={{color:"#565656", textAlign: 'center', lineHeight: '1.6'}}>
                {feature.text}
              </p>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button 
          onClick={prevSlide}
          className="position-absolute btn btn-light rounded-circle"
          style={{
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '50px',
            height: '50px',
            border: '2px solid #4BAF47',
            color: '#4BAF47',
            zIndex: 20
          }}
        >
          ‹
        </button>
        <button 
          onClick={nextSlide}
          className="position-absolute btn btn-light rounded-circle"
          style={{
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '50px',
            height: '50px',
            border: '2px solid #4BAF47',
            color: '#4BAF47',
            zIndex: 20
          }}
        >
          ›
        </button>

        {/* Dots Indicator */}
        <div className="d-flex justify-content-center mt-4" style={{ gap: '10px' }}>
          {Array.from({ length: Math.ceil(features.length / 4) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * 4)}
              className="btn p-0"
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: Math.floor(currentIndex / 4) === index ? '#4BAF47' : '#ccc'
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        /* Responsive adjustments */
        @media (max-width: 1200px) {
          .different-cards-wrapper {
            gap: 1.5rem !important;
          }
          .different-card {
            width: 17rem !important;
          }
        }

        @media (max-width: 992px) {
          .different-cards-wrapper {
            gap: 2rem !important;
          }
          .different-card {
            width: 100% !important;
            max-width: 22rem !important;
            height: auto !important;
            padding: 2rem 1.5rem !important;
          }
        }

        @media (max-width: 768px) {
          section {
            padding: 5rem 1.5rem 6rem !important;
          }
          .different-card {
            padding: 2rem 1rem !important;
          }
        }

        @media (max-width: 480px) {
          section {
            padding: 4rem 1rem 5rem !important;
          }
          .different-card {
            width: 100% !important;
            max-width: 18rem !important;
            height: auto !important;
          }
        }
      `}</style>
    </section>
  );
};

export default WhatMakesUsDifferent;