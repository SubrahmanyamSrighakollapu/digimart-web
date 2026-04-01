// src/about/GetToKnowUs.jsx

import 'bootstrap/dist/css/bootstrap.min.css';
import cardImg from '../../assets/about/CardImg.png';
import pointImg from '../../assets/about/PointImg.png';
import DiscoverMoreButton from '../../components/DiscoverMoreButton';

const GetToKnowUs = () => {
  return (
    <div className="w-100 bg-white py-5 px-4 d-flex justify-content-center my-5" style={{ padding: '6rem 10rem' }}>
      <div className="row align-items-center mx-auto get-to-know-wrapper" style={{ gap: '1rem' }}>
        {/* Left Section - Image */}
        <div className="col-lg-6">
          <img
            src={cardImg}
            alt="Get to Know Us"
            className="w-100 d-block"
            style={{
              maxWidth: '44rem',
              height: '33rem',
              paddingLeft: '6rem',
              borderRadius: '0.5rem',
              objectFit: 'cover',
              
              
            }}
          />
        </div>

        {/* Right Section - Content */}
        <div className="col-lg-5 d-flex flex-column gap-3">
          <p className="subtitle" style={{
            color: '#4BAF47',
            fontWeight: '600',
            fontSize: '1.1rem',
            marginBottom: '0.5rem'
          }}>
            Get to Know Us
          </p>

          <h2 style={{
            color: '#1F1E17',
            fontWeight: '700',
            fontSize: '2.2rem',
            lineHeight: '1.3',
            marginBottom: '1rem'
          }}>Bridging the gap between rural roots and global markets</h2>

          <p style={{
            color: '#666',
            fontSize: '1.1rem',
            lineHeight: '1.7',
            marginBottom: '1.5rem'
          }}>
            Originating from a desire to solve inefficiencies in the traditional supply chain, Organic Agri B2B was founded to empower stakeholders through transparency. We saw that farmers weren't getting fair value, and buyers struggled with authenticity verification. Backed by 9+ years of industry experience, our journey is built on deep domain expertise, strong farmer relationships, and a commitment to creating a fair, efficient, and trustworthy agri-commerce ecosystem.
          </p>

          {/* Benefit Item */}
          <div className="d-flex gap-3 align-items-start mt-3">
            <img
              src={pointImg}
              alt="Point"
              className="point-icon"
              style={{ width: '24px', height: '24px', marginTop: '4px' }}
            />
            <p style={{
              color: '#333',
              fontSize: '1.05rem',
              lineHeight: '1.6',
              margin: 0
            }}>Today, our platform serves as a digital bridge—ensuring fair trade practices and full traceability from seed to shelf.</p>
          </div>

          {/* Button */}
          <div className="mt-3">
            <DiscoverMoreButton
              text="Discover More"
              href="/about"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .get-to-know-wrapper {
          max-width: 100rem;
          width: 100%;
        }

        /* Large tablets and below */
        @media (max-width: 1024px) {
          .w-100.bg-white {
            padding: 6rem 2rem 5rem !important;
          }
          .get-to-know-wrapper {
            flex-direction: column;
          }
          .row.g-5 {
            gap: 3rem !important;
          }
          .col-lg-6.d-flex.flex-column.gap-2 {
            gap: 1.25rem !important;
          }
        }

        /* Tablets */
        @media (max-width: 768px) {
          .w-100.bg-white {
            padding: 5rem 1.5rem !important;
          }
          
          .col-lg-6 p:first-child {
            font-size: 1.25rem !important;
          }
          .col-lg-6 img {
            height: auto !important;
          }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .w-100.bg-white {
            padding: 4rem 1rem !important;
          }
          .row.g-5 {
            gap: 2rem !important;
          }
          .col-lg-6 img {
            height: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default GetToKnowUs;