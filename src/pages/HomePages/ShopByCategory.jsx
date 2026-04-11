// src/components/ShopByCategory.jsx

import React from "react";
import { Link } from "react-router-dom";

import staples from "../../assets/MainPage/category1_image.png";
import edibleOils from "../../assets/MainPage/category2_image.png";
import flours from "../../assets/MainPage/category4_image.jpg";

const categories = [
  {
    image: staples,
    title: "Staples & Grains",
    subtitle: "1,200+ Items",
    link: "/category/staples-grains",
  },
  {
    image: edibleOils,
    title: "Edible Oils",
    subtitle: "Sunflower, Mustard",
    link: "/category/edible-oils",
  },
  {
    image: flours,
    title: "Flours",
    subtitle: "Atta, Maida, Besan",
    link: "/category/flours",
  },
];

const ShopByCategory = () => {
  return (
    <section
      className="py-5"
      style={{
        background: "#fff",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <h2
            className="fw-bold"
            style={{
              color: "#EC5609",
              fontSize: "2rem",
            }}
          >
            Shop by Category
          </h2>

          <p
            style={{
              color: "#666",
              fontSize: "1rem",
              marginTop: "8px",
              textAlign:'center'
            }}
          >
            Restock your shelves with our curated categories
          </p>
        </div>

        {/* Cards */}
        <div className="row g-4 justify-content-center">
          {categories.map((cat, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div
                className="category-card h-100"
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(0,0,0,0.08)";
                }}
              >
                {/* Image */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                  }}
                />

                {/* Card Body */}
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{
                    padding: "16px 18px",
                  }}
                >
                  <div>
                    <h5
                      style={{
                        margin: 0,
                        fontWeight: "600",
                        fontSize: "16px",
                      }}
                    >
                      {cat.title}
                    </h5>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "#888",
                      }}
                    >
                      {cat.subtitle}
                    </p>
                  </div>

                  <Link
                    to="/ shop"
                    className="btn btn-sm text-white"
                    style={{
                      background: "#EC5609",
                      padding: "6px 14px",
                      fontSize: "13px",
                      borderRadius: "4px",
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