// src/components/Hero.jsx

import React from "react";
import heroRightImage from "../../assets/MainPage/hero_image.png";

const Hero = () => {
  return (
    <section
      className="py-5"
      style={{
        backgroundColor: "#fff",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      <div className="container">
        <div className="row align-items-center">

          {/* LEFT CONTENT */}
          <div className="col-lg-6 mb-5 mb-lg-0">

            <h1
              className="fw-bold mb-3"
              style={{
                fontSize: "3rem",
                lineHeight: "1.15",
                color: "#1d1d1d",
              }}
            >
              Your trusted <br />
              <span style={{ color: "#EC5609" }}>
                Grocery Wholesale
              </span>{" "}
              <br />
              Partener
            </h1>

            <p
              style={{
                fontSize: "1rem",
                color: "#6c6c6c",
                maxWidth: "520px",
                marginBottom: "25px",
              }}
            >
              Empowering your retail business with exclusive bulk pricing,
              24-hour fulfillment, and over 5,000+ top-quality SKUs.
            </p>

            <a
              href="/login"
              className="btn text-white"
              style={{
                backgroundColor: "#EC5609",
                padding: "10px 28px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.95rem",
              }}
            >
              Shop Now
            </a>
          </div>

          {/* RIGHT IMAGE */}
          <div className="col-lg-6">

            <div
              className="position-relative rounded-3 overflow-hidden"
              style={{
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={heroRightImage}
                alt="Fresh produce"
                style={{
                  width: "100%",
                  height: "340px",
                  objectFit: "cover",
                }}
              />

              {/* Overlay badge */}
              <div
  className="position-absolute"
  style={{
    bottom: "15px",
    right: "20px",
    background: "rgba(0,0,0.6,0.6)",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "0.9rem",
    whiteSpace: "nowrap"
  }}
>
                Daily inventory updates from top FMCG brands
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;