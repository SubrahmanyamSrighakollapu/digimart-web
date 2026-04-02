// src/components/WhyChooseUs.jsx

import React from "react";
import { FaTruckFast, FaChartLine, FaBoxOpen, FaMobileScreen } from "react-icons/fa6";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaTruckFast size={22} color="#EC5609" />,
      title: "Fast Delivery",
      description:
        "Guaranteed 24-hour turnaround for all orders in metro cities. Never run out of stock.",
    },
    {
      icon: <FaChartLine size={22} color="#EC5609" />,
      title: "Better Margins",
      description:
        "Eliminate middlemen. Get direct-from-brand wholesale prices to increase your profits.",
    },
    {
      icon: <FaBoxOpen size={22} color="#EC5609" />,
      title: "5000+ SKUs",
      description:
        "Access a wide range of categories including Staples, Snacks, and Personal Care brands.",
    },
    {
      icon: <FaMobileScreen size={22} color="#EC5609" />,
      title: "Easy Ordering",
      description:
        "Our mobile-first platform lets you place orders in seconds, even while serving customers.",
    },
  ];

  return (
    <section
      className="py-5"
      style={{
        backgroundColor: "#F7EEEA",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      <div className="container">

        {/* Section Title */}
        <div className="text-center mb-5">
          <h2
            className="fw-bold"
            style={{
              color: "#EC5609",
              fontSize: "2rem",
            }}
          >
            Why Choose Us
          </h2>
        </div>

        {/* Feature Cards */}
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-lg-3 col-md-6">

              <div
                className="h-100 p-4"
                style={{
                  background: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >

                {/* Icon Box */}
                <div
                  className="mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "45px",
                    height: "45px",
                    background: "#F7EEEA",
                    borderRadius: "6px",
                  }}
                >
                  {feature.icon}
                </div>

                <h5
                  className="fw-semibold mb-2"
                  style={{
                    fontSize: "1rem",
                    color: "#222",
                  }}
                >
                  {feature.title}
                </h5>

                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#666",
                    lineHeight: "1.5",
                    marginBottom: 0,
                  }}
                >
                  {feature.description}
                </p>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;