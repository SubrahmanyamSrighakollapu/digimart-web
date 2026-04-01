// src/pages/shop/OfferCard.jsx

import offerImg from '../../assets/shop/offerCardImg.png';
import DiscoverMoreButton from '../../components/DiscoverMoreButton';

const OfferCard = () => {
  return (
    <section className="offer-section px-5 py-3" style={{ background: '#EAFCEA', minHeight: '10rem', marginTop: '-2rem', }}>
      <div className="container">
        
        <div
          className="offer-card d-flex align-items-center gap-3 mx-auto"
          style={{
            width: '93.25rem',
            minHeight: '20.125rem',
            gap: '0rem',
            padding: '3rem',
            borderRadius: '0.5rem',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {/* Left: Text (title, paragraph, button) */}
          <div className="offer-text-content d-flex flex-column justify-content-center" style={{ width: '45%', textAlign: 'left' }}>
            <h2 className='mb-2'>
              Premium Bulk Grains for Your Business
            </h2>

            <p className='mb-3'>
              Direct from farms, quality assured, reliable supply across India. Sourcing bulk rice and dals has never been easier.
            </p>

            <div>
              <DiscoverMoreButton text="Explore All Products →" />
            </div>
          </div>

          {/* Right: Image */}
          <div className="offer-image-content d-flex justify-content-center" style={{ width: '45%' }}>
            <img
              src={offerImg}
              alt="Premium Bulk Grains"
              style={{
                width: '35.0625rem', // 657px
                height: '18.5625rem', // 377px
                borderRadius: '2.5rem',
                borderBottom: '0.3125rem solid #0A6806',
                boxShadow: '0.25rem 0.25rem 0.5rem rgba(0,0,0,0.25)',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
      </div>

    
      <style>{`
        /* Ensure primary sizing uses rems and adapts */
        .offer-section { padding-bottom: 4rem; }

        @media (max-width: 1200px) {
          /* remove left offset on narrower screens and make card full-width */
          .offer-card { 
            width: 100% !important; 
            margin-left: 0 !important; 
            height: auto !important; 
            padding: 2rem !important; 
          }
          .offer-text-content { width: 50% !important; }
          .offer-image-content { width: 50% !important; }
          .offer-card img { 
            width: 28rem !important; 
            height: 15rem !important; 
          }
        }

        @media (max-width: 768px) {
          .offer-card { 
            flex-direction: column-reverse !important;
            padding: 2rem 1.5rem !important; 
            gap: 2rem !important; 
          }
          .offer-text-content { 
            width: 100% !important; 
            text-align: center !important;
            align-items: center !important;
          }
          .offer-image-content { 
            width: 100% !important; 
          }
          .offer-card img { 
            width: 28rem !important; 
            height: 15rem !important; 
            max-width: 100%;
          }
          .offer-section { padding-top: 3rem; padding-bottom: 3rem; }
        }

        @media (max-width: 480px) {
          .offer-card img { 
            width: 22rem !important; 
            height: 12rem !important; 
            border-radius: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default OfferCard;