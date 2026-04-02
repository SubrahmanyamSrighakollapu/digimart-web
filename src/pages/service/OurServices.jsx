// src/services/OurServices.jsx

import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import Icon1 from '../../assets/services/Icon1.png';
import Icon2 from '../../assets/services/Icon2.png';
import Icon3 from '../../assets/services/Icon3.png';
import Icon4 from '../../assets/services/Icon4.png';
import agentIcon from '../../assets/MainPage/Agent/Icon.png';
import revenueIcon from '../../assets/about/Icon1.png';
import platformIcon from '../../assets/about/Icon2.png';
import farmerIcon from '../../assets/about/Icon3.png';
import colors from '../../styles/colors';

const OurServices = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const servicesData = [
    {
      id: 1,
      icon: agentIcon,
      title: 'Creating Local Agents',
      description: 'Building a network of trusted local agents who understand their communities and provide personalized service.',
    },
    {
      id: 2,
      icon: revenueIcon,
      title: 'Recurring Revenue',
      description: 'Sustainable business model ensuring consistent income streams for all stakeholders in the ecosystem.',
    },
    {
      id: 3,
      icon: platformIcon,
      title: 'Online Platform',
      description: 'Digital marketplace connecting farmers, agents, and customers with seamless ordering and payment systems.',
    },
    {
      id: 4,
      icon: farmerIcon,
      title: 'Empowering Farmers',
      description: 'Providing farmers with better revenue opportunities through direct market access and fair pricing.',
    },
        {
      id: 5,
      icon: Icon4,
      title: 'Education & Training',
      description: 'Improve farming practices through learning.',
    },
    {
      id: 6,
      icon: Icon1,
      title: 'Farmer Credit Support',
      description: 'Flexible financial options for crop cycles.',
    },
    {
      id: 7,
      icon: Icon2,
      title: 'Equipment Access',
      description: 'Rental and purchase of essential tools.',
    },
    {
      id: 8,
      icon: Icon3,
      title: 'Pest & Crop Advisory',
      description: 'Expert advice on crop health and protection.',
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 4) % servicesData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 4 + servicesData.length) % servicesData.length);
  };

  const getVisibleServices = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      visible.push(servicesData[(currentIndex + i) % servicesData.length]);
    }
    return visible;
  };

  return (
    <div className="bg-white py-5">
      <div className="container">
        {/* Header Section */}
        <div className="section-header">
          <h2 className='mb-1'>OUR CORE SERVICES</h2>
          <p>
            Designed to support farmers from soil to sale.
          </p>
        </div>

        {/* Cards Section */}
        <div className="position-relative">
          <div className="d-flex justify-content-center" style={{ gap: '2rem' }}>
            {getVisibleServices().map((service) => (
              <div key={`${currentIndex}-${service.id}`} className="service-card h-100 p-4" style={{ width: '18rem' }}>
                {/* Icon with Background */}
                <div className="icon-bg mb-3 d-flex justify-content-center">
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="icon-img"
                    style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                  />
                </div>

                {/* Title */}
                <h3 className="card-title mb-3 text-center" style={{ fontSize: '1.25rem', fontWeight: '600' }}>{service.title}</h3>

                {/* Description */}
                <p style={{color:colors.textTertiary, textAlign: 'center', lineHeight: '1.6'}}>{service.description}</p>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="position-absolute btn btn-light rounded-circle"
            style={{
              left: '-40px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              border: `2px solid ${colors.primary}`,
              color: colors.primary,
              zIndex: 20,
              fontSize: '18px'
            }}
          >
            ‹
          </button>
          <button 
            onClick={nextSlide}
            className="position-absolute btn btn-light rounded-circle"
            style={{
              right: '-40px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              border: `2px solid ${colors.primary}`,
              color: colors.primary,
              zIndex: 20,
              fontSize: '18px'
            }}
          >
            ›
          </button>

          {/* Dots Indicator */}
          <div className="d-flex justify-content-center mt-4" style={{ gap: '10px' }}>
            {Array.from({ length: Math.ceil(servicesData.length / 4) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * 4)}
                className="btn p-0"
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: Math.floor(currentIndex / 4) === index ? colors.primary : '#ccc'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .service-card {
          background-color: ${colors.bgLightGreen};
          margin: 0 auto;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-0.3125rem);
          box-shadow: 0 0.625rem 1.5625rem rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default OurServices;