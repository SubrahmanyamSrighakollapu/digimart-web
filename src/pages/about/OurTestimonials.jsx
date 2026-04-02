// src/about/OurTestimonials.jsx

import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import bgImg from '../../assets/about/bgImg.png';
import iconOverlay from '../../assets/about/Icon8.png';
import line from '../../assets/about/line.png';
import farmerTestimonial from '../../assets/MainPage/testimonials/farmer-testimonial.jpg';
import agentTestimonial from '../../assets/MainPage/testimonials/agent-testimonial.jpg';
import customerTestimonial from '../../assets/MainPage/testimonials/customer-testimonial.jpg';
import colors from '../../styles/colors';

const OurTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      image: farmerTestimonial,
      text: 'Earlier I had to go through multiple middlemen to sell my crops. Now I can directly connect with buyers and get fair prices for my hard work. This platform is a blessing for farmers like us.',
      name: 'Rajesh Kumar',
      role: 'Farmer, Haryana',
    },
    {
      image: agentTestimonial,
      text: 'Being an agent on this platform has transformed my business completely. The transparency in pricing and quality verification gives me confidence while dealing with customers.',
      name: 'Priya Sharma',
      role: 'Agent, Punjab',
    },
    {
      image: customerTestimonial,
      text: 'I get the best quality grains delivered right to my home. The delivery is always on time and prices are reasonable. I recommend this service to all my friends and family.',
      name: 'Sunita Devi',
      role: 'Customer, Delhi',
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 2; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section className="w-100 position-relative mt-5 text-center testimonials-section" style={{
      padding: '3rem 8rem 5rem 8rem',
      backgroundImage: `url(${bgImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="section-header">
      <p className="subtitle mb-1">
        Our Testimonials
      </p>

      <h2>
        What They Say
      </h2>
      </div>

      <div className="position-relative">
        <div className="d-flex justify-content-center mx-auto testimonial-cards-wrapper" style={{
          gap: '6rem',
          maxWidth: '70rem'
        }}>
          {getVisibleTestimonials().map((item, index) => (
            <div key={`${currentIndex}-${index}`} className="position-relative d-inline-block testimonial-card-wrapper">
              {/* Person Image Wrapper */}
              <div className="position-absolute rounded shadow testimonial-image-wrapper" style={{
                top: '3.1875rem',
                left: '-4.375rem',
                width: '8.75rem',
                height: '11.4375rem',
                overflow: 'hidden',
                zIndex: 10
              }}>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Overlay Icon */}
              <img
                src={iconOverlay}
                alt="Decorative icon"
                className="position-absolute testimonial-overlay-icon"
                style={{
                  top: 'calc(3.1875rem + 5.71875rem)',
                  left: 'calc(-4.375rem + 9.3rem - 2rem)',
                  width: '3rem',
                  height: '3rem',
                  transform: 'translateY(-50%)',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  zIndex: 15
                }}
              />

              {/* Card */}
              <div className="position-relative bg-white rounded shadow testimonial-card" style={{
                width: '28.25rem',
                height: '17.8125rem',
                borderRadius: '0.625rem',
                padding: '2rem 2.5rem 3rem 7.5rem',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                boxSizing: 'border-box',
                overflow: 'visible',
                zIndex: 1
              }}>
                <div className="h-100 d-flex flex-column justify-content-between">
                  <p>
                    {item.text}
                  </p>

                  <div className="d-flex align-items-center justify-content-between mt-2">
                    <div className="d-flex rating-lines" style={{ gap: '0.1rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <img key={i} src={line} alt="Rating" style={{ width: '1rem', height: 'auto', objectFit: 'contain' }} />
                      ))}
                    </div>

                    <div className="text-end">
                      <h3 className="small mb-1">
                        {item.name}
                      </h3>
                      <p className='text-end'>
                        {item.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
            border: `2px solid ${colors.primary}`,
            color: colors.primary,
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
            border: `2px solid ${colors.primary}`,
            color: colors.primary,
            zIndex: 20
          }}
        >
          ›
        </button>

        {/* Dots Indicator */}
        <div className="d-flex justify-content-center mt-4" style={{ gap: '10px' }}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="btn p-0"
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentIndex ? colors.primary : '#ccc'
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        /* Responsive adjustments */
        @media (max-width: 1200px) {
          .testimonials-section {
            padding: 3rem 2rem 5rem 2rem !important;
          }
          .testimonial-cards-wrapper {
            gap: 4rem !important;
          }
        }

        @media (max-width: 992px) {
          .testimonials-section {
            padding: 3rem 1.5rem 5rem 1.5rem !important;
          }
          .testimonial-cards-wrapper {
            flex-direction: column;
            align-items: center;
            gap: 3rem !important;
          }
        }

        @media (max-width: 768px) {
          .testimonials-section {
            padding: 3rem 1rem 4rem 1rem !important;
          }
        }

        @media (max-width: 576px) {
          .testimonials-section {
            padding: 2.5rem 0.75rem 3.5rem 0.75rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default OurTestimonials;