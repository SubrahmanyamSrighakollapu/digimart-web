// src/components/QualityProducts.jsx

import 'bootstrap/dist/css/bootstrap.min.css';
import cardImg from '../../assets/groceryweb/grocery.png'; // ← replace if you have better matching image (farmer hand + tomatoes/eggplants)
import icon1 from '../../assets/MainPage/QualityProducts/Icon1.png'; // Professional Growers
import icon2 from '../../assets/MainPage/QualityProducts/Icon2.png'; // Wholesale Solutions
import DiscoverMoreButton from '../../components/DiscoverMoreButton';

const QualityProducts = () => {
  const features = [
    {
      icon: icon1,
      title: 'Professional Growers',
      text: 'Sourced from experienced and trusted suppliers.',
    },
    {
      icon: icon2,
      title: 'Wholesale Solutions',
      text: 'Smart solutions tailored for efficient wholesale operations.',
    },
  ];

  return (
    <section className="py-5 py-lg-6 bg-white">
      <div className="container">
        <div className="row g-0 rounded overflow-hidden shadow-sm mx-auto quality-section" style={{ maxWidth: '1200px' }}>
          {/* Left - Image */}
          <div className="col-lg-6 p-0">
            <div className="quality-img-wrapper position-relative overflow-hidden">
              <img
                src={cardImg}
                alt="Farmer holding fresh organic vegetables"
                className="w-100 h-100 object-cover"
                style={{
                  objectPosition: 'center 30%', // Focus on hand + tomatoes/eggplants area
                }}
              />
            </div>
          </div>

          {/* Right - Content */}
          <div className="col-lg-6 d-flex flex-column justify-content-center p-4 p-lg-5 bg-white">
            <p
              className="mb-2 fw-medium"
              style={{
                color: '#EC5609',
                fontSize: '1.25rem',
                letterSpacing: '1px',
              }}
            >
              Quality Products
            </p>

            <h2
              className="fw-bold mb-4"
              style={{
                color: '#000',
                fontSize: "2rem",
                lineHeight: 1.1,
              }}
            >
              Only Quality Food
            </h2>

            <p
              className="mb-5"
              style={{
                color: '#555555',
                fontSize: '1.15rem',
                lineHeight: 1.65,
                maxWidth: '520px',
              }}
            >
              Pure, chemical-free organic food grown using natural farming practices.
            </p>

            {/* Features */}
            <div className="d-flex flex-column gap-4 mb-5">
              {features.map((feature, index) => (
                <div key={index} className="d-flex align-items-start gap-3">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    style={{
                      width: '48px',
                      height: '48px',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <h3
                      className="fw-bold mb-1"
                      style={{
                        color: '#24231D',
                        fontSize: '1.5rem',
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      style={{
                        color: '#555555',
                        fontSize: '1.05rem',
                        lineHeight: 1.6,
                        marginBottom: 0,
                      }}
                    >
                      {feature.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div>
              <DiscoverMoreButton
                text="Start Shopping Now"
                href="/shop"
                // Assuming DiscoverMoreButton uses #EC5609 bg, white text, pill shape
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .quality-img-wrapper {
          height: 100%;
        }

        .quality-img-wrapper img {
          min-height: 100%;
        }

        @media (max-width: 991px) {
          .quality-img-wrapper {
            height: 28rem; /* taller on tablet to show more of the hand/veggies */
          }
          .quality-img-wrapper img {
            object-position: center 25% !important;
          }
        }

        @media (max-width: 576px) {
          .quality-img-wrapper {
            height: 22rem;
          }
          .quality-section {
            max-width: 95% !important;
          }
        }
      `}</style>
    </section>
  );
};

export default QualityProducts;