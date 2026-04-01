// src/about/OurPurpose.jsx

import 'bootstrap/dist/css/bootstrap.min.css';
import icon1 from '../../assets/about/Icon1.png';
import icon2 from '../../assets/about/Icon2.png';

const OurPurpose = () => {
  const purposes = [
    {
      icon: icon1,
      title: 'Our Mission',
      text: 'To create a transparent and sustainable agriculture ecosystem where everyone thrives. We aim to eliminate opaque middlemen and foster direct relationships built on trust and verified quality.'
    },
    {
      icon: icon2,
      title: 'Our Vision',
      text: 'To become the world\'s most trusted organic trade platform connecting verified farmers and markets. We envision a future where organic sourcing is effortless, ethical, and universally accessible.'
    }
  ];

  return (
    <section className="w-100 position-relative mt-5 text-center" style={{
      padding: '4rem 8rem',
      backgroundColor: '#F8F7F0CC'
    }}>
      <h2 className="mb-5" style={{
        color: '#1F1E17',
        fontWeight: '700',
        fontSize: '2.5rem',
        letterSpacing: '1px'
      }}>
        OUR PURPOSE
      </h2>

      <div className="d-flex flex-wrap justify-content-center align-items-start mx-auto purpose-cards-wrapper" style={{
        gap: '3.75rem',
        maxWidth: '74rem'
      }}>
        {purposes.map((purpose, index) => (
          <div key={index} className="bg-white rounded shadow d-flex flex-column align-items-start p-4 purpose-card" style={{
            width: '35.0625rem',
            maxWidth: '100%',
            height: '20.8125rem',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
            boxSizing: 'border-box'
          }}>
            <div className="icon-bg mb-4">
              <img 
                src={purpose.icon}
                alt={`${purpose.title} Icon`}
                className="icon-img"
              />
            </div>

            <h3 className="card-title mb-3" style={{
              color: '#1F1E17',
              fontWeight: '600',
              fontSize: '1.5rem',
              marginBottom: '1rem'
            }}>
              {purpose.title}
            </h3>

            <p className="card-text" style={{
              color: '#555',
              fontSize: '1rem',
              lineHeight: '1.7',
              textAlign: 'left'
            }}>
              {purpose.text}
            </p>
          </div>
        ))}
      </div>

      <style jsx>{`
        /* Responsive adjustments */
        @media (max-width: 1200px) {
          .purpose-cards-wrapper {
            gap: 2.5rem !important;
          }
          .purpose-card {
            width: 32rem !important;
          }
        }

        @media (max-width: 992px) {
          .purpose-cards-wrapper {
            flex-direction: column;
            align-items: center;
          }
          .purpose-card {
            width: 100% !important;
            max-width: 35rem !important;
            height: auto !important;
            padding: 2rem 1.5rem !important;
          }
          
        }

        @media (max-width: 768px) {
          section {
            padding: 5rem 1.5rem 6rem !important;
          }
          
          .purpose-card p {
            font-size: 1rem !important;
            line-height: 2rem !important;
          }
        }

        @media (max-width: 480px) {
          section {
            padding: 4rem 1rem 5rem !important;
          }
          
        }
      `}</style>
    </section>
  );
};

// Export empty styles object for compatibility
export const styles = {};

export default OurPurpose;