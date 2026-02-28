// src/components/ShopByCategory.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // or use <a> if no router

// Replace these paths with your actual local image files
import staples1 from '../../assets/groceryweb/grocery.png'; // e.g. various dals & grains in bowls
import edibleOils from '../../assets/groceryweb/grocery.png';   // bottle of oil with seeds
import staples2 from '../../assets/groceryweb/grocery.png'; // another variation of staples

const categories = [
  {
    image: staples1,
    title: 'Staples & Grains',
    subtitle: '1,200+ Items',
    link: '/category/staples-grains',
  },
  {
    image: edibleOils,
    title: 'Edible Oils',
    subtitle: 'Sunflower, Mustard',
    link: '/category/edible-oils',
  },
  {
    image: staples2,
    title: 'Staples & Grains',
    subtitle: '1,200+ Items',
    link: '/category/staples-grains', // or different if needed
  },
  // Add more if you have additional cards in the design
];

const ShopByCategory = () => {
  return (
    <section
      className="py-5 py-lg-5"
      style={{
        backgroundColor: '#fff', // matching previous section's light peach
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <h2
            className="fw-bold"
            style={{
              color: '#EC5609',
              fontSize: '2.5rem',
              marginBottom: '0.75rem',
            }}
          >
            Shop by Category
          </h2>
          <p
            style={{
              color: '#555555',
              fontSize: '1.25rem',
              fontWeight: 500,
              marginBottom: '1rem',
              textAlign:"center"
            }}
          >
            Restock your shelves with our curated categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="row g-4 justify-content-center">
          {categories.map((cat, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div
                className="position-relative rounded-2 overflow-hidden shadow-sm h-100 d-flex flex-column"
                style={{
                  backgroundColor: '#ffffff',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(236,86,9,0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
                }}
              >
                {/* Image */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-100 object-fit-cover"
                  style={{
                    height: '260px', // adjust based on your images' aspect ratio
                    objectPosition: 'center',
                  }}
                />

                {/* Overlay Content at Bottom */}
                <div
                  className="position-absolute bottom-0 start-0 w-100 p-4 text-white"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)',
                  }}
                >
                  <h3
                    className="fw-bold mb-1"
                    style={{
                      fontSize: '1.5rem',
                    }}
                  >
                    {cat.title}
                  </h3>
                  <p
                    className="mb-3"
                    style={{
                      fontSize: '1rem',
                      color:"#fff",
                      opacity: 0.9,
                    }}
                  >
                    {cat.subtitle}
                  </p>

                  <Link
                    to={cat.link}
                    className="btn btn-sm px-4 py-2 fw-semibold text-white border border-white border-2"
                    style={{
                      backgroundColor: '#EC5609',
                      borderRadius: '5px',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#d14c08';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#EC5609';
                    }}
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;