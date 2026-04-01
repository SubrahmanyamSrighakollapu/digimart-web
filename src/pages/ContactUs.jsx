import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import ContactImg from "../assets/contact/Contact_img.png";
import BackImg from "../assets/contact/back_img.png";

const ContactUs = () => {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${ContactImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "280px",
          position: "relative",
          color: "#fff",
        }}
      >
        <div
          className="d-flex flex-column justify-content-center align-items-center h-100"
          style={{ background: "rgba(0,0,0,0.45)" }}
        >
          <small className="text-uppercase">Home / Contact</small>
          <h1 className="fw-bold">Contact</h1>
        </div>
      </div>

      <div className="container my-5">
        <div className="row g-4 justify-content-center">
          <div className="col-md-4">
            <div
              className="p-4 text-white rounded text-center h-100 d-flex flex-column justify-content-center"
              style={{ background: "#4CAF50", minHeight: "200px" }}
            >
              <h4 className="fw-bold mb-3" style={{ fontSize: "1.5rem", letterSpacing: "0.5px", color: "black" }}>About</h4>
              <p className="mb-0" style={{ 
                fontSize: "1rem", 
                lineHeight: "1.6", 
                fontWeight: "400",
                color: "black"
              }}>
                Fresh, naturally grown produce without chemicals or harmful additives. 
                Connecting farmers directly with consumers for sustainable agriculture.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="p-4 text-white rounded text-center h-100 d-flex flex-column justify-content-center"
              style={{ background: "#C5D63C", minHeight: "200px" }}
            >
              <h4 className="fw-bold mb-3" style={{ fontSize: "1.5rem", letterSpacing: "0.5px", color: "black" }}>Contact</h4>
              <div className="d-flex flex-column gap-2">
                <p className="mb-0" style={{ fontSize: "1.1rem", fontWeight: "500", color: "black" }}>+91 9581906060</p>
                <p className="mb-0" style={{ fontSize: "1rem", fontWeight: "400", color: "black" }}>support@totalneeds.in</p>
                <p className="mb-0" style={{ 
                  fontSize: "0.95rem", 
                  fontWeight: "400",
                  color: "black",
                  marginTop: "8px"
                }}>Mon – Fri: 7:00 am – 6:00 pm</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="p-4 text-white rounded text-center h-100 d-flex flex-column justify-content-center"
              style={{ background: "#F2C94C", minHeight: "200px" }}
            >
              <h4 className="fw-bold mb-3" style={{ fontSize: "1.5rem", letterSpacing: "0.5px", color: "black" }}>Address</h4>
              <p className="mb-0" style={{ 
                fontSize: "1rem", 
                lineHeight: "1.5", 
                fontWeight: "400",
                color: "black"
              }}>
                #405, ALLURI TRADE CENTRE<br />
                BHAGYANAGAR COLONY KUKATPALLY<br />
                HYDERABAD 500072
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mb-5">
        <div className="row g-4 align-items-stretch">
          <div className="col-lg-6">
            <iframe
              title="Hyderabad Map"
              src="https://www.google.com/maps?q=ALLURI+TRADE+CENTRE+BHAGYANAGAR+COLONY+KUKATPALLY+HYDERABAD&output=embed"
              width="100%"
              height="100%"
              style={{
                border: 0,
                minHeight: "360px",
                borderRadius: "8px",
              }}
              loading="lazy"
            />
          </div>
          <div className="col-lg-6">
            <div
              className="p-4 rounded h-100"
              style={{
                backgroundImage: `url(${BackImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <small className="text-success fw-semibold">Contact us</small>
              <h3 className="fw-bold mb-4">Write a Message</h3>

              <form>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      placeholder="Name"
                      className="form-control"
                      style={{
                        height: "48px",
                        borderRadius: "6px",
                        border: "1px solid #e5e5e5",
                        backgroundColor: "#ffffff",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="form-control"
                      style={{
                        height: "48px",
                        borderRadius: "6px",
                        border: "1px solid #e5e5e5",
                        backgroundColor: "#ffffff",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <textarea
                    rows="4"
                    placeholder="Write a Message"
                    className="form-control"
                    style={{
                      borderRadius: "6px",
                      border: "1px solid #e5e5e5",
                      backgroundColor: "#ffffff",
                      fontSize: "14px",
                      resize: "none",
                    }}
                  />
                </div>

                <button
                  className="btn btn-success"
                  style={{
                    height: "42px",
                    padding: "0 24px",
                    fontSize: "14px",
                  }}
                >
                  Send a Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;