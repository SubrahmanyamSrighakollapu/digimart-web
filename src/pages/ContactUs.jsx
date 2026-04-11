// src/components/ContactUs.jsx

import React from 'react';

const ContactUs = () => {
  return (
    <div className="container my-5">
      <div
        className="rounded-4 overflow-hidden shadow-lg"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <div className="row g-0">
          {/* Left - Form Section */}
          <div className="col-lg-6 p-5">
            <h2 className="fw-bold mb-4" style={{ fontSize: '2.4rem' }}>
              Get in <span style={{ color: '#EC5609' }}>Touch</span>
            </h2>

            <p className="text-muted mb-5" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
              Have questions about a property or need assistance? We are here to help
              you find your dream home.
            </p>

            <form>
              <div className="mb-4">
                <label className="form-label fw-medium">Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name *"
                  required
                  style={{
                    height: '50px',
                    borderRadius: '8px',
                    border: '1px solid #ced4da',
                    padding: '0 1.25rem',
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  style={{
                    height: '50px',
                    borderRadius: '8px',
                    border: '1px solid #ced4da',
                    padding: '0 1.25rem',
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Phone number *</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Phone number *"
                  required
                  style={{
                    height: '50px',
                    borderRadius: '8px',
                    border: '1px solid #ced4da',
                    padding: '0 1.25rem',
                  }}
                />
              </div>

              <div className="mb-5">
                <label className="form-label fw-medium">How did you find us?</label>
                <select
                  className="form-select"
                  style={{
                    height: '50px',
                    borderRadius: '8px',
                    border: '1px solid #ced4da',
                    padding: '0 1.25rem',
                  }}
                >
                  <option value="">Select</option>
                  <option>Google</option>
                  <option>Friend / Family</option>
                  <option>Social Media</option>
                  <option>Advertisement</option>
                  <option>Other</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn text-white fw-semibold w-100"
                style={{
                  backgroundColor: '#EC5609',
                  height: '52px',
                  fontSize: '1.1rem',
                  borderRadius: '8px',
                  border: 'none',
                }}
              >
                SEND
              </button>
            </form>

            {/* Contact Info at Bottom */}
            <div className="mt-5 pt-4 border-top">
              <div className="d-flex align-items-center mb-3">
                <span style={{ fontSize: '1.4rem', color: '#EC5609', marginRight: '12px' }}>☎</span>
                <div>
                  <small className="text-muted d-block">PHONE</small>
                  <span style={{ color: '#EC5609', fontWeight: 600 }}>
                    +91 9652283222
                  </span>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <span style={{ fontSize: '1.4rem', color: '#EC5609', marginRight: '12px' }}>✉</span>
                <div>
                  <small className="text-muted d-block">EMAIL</small>
                  <span style={{ color: '#EC5609', fontWeight: 600 }}>
                    digimart.com
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Map Section */}
          <div className="col-lg-6 bg-dark position-relative">
            <iframe
              title="Company Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.4!2d78.5022!3d17.4399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99b1b1b1b1b1%3A0x0!2sSavithri+Mallaiah+Arcade%2C+Lallaguda%2C+Secunderabad%2C+Hyderabad%2C+Telangana+500017!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Optional overlay pin (you can customize or remove) */}
            <div
              className="position-absolute top-50 start-50 translate-middle"
              style={{ zIndex: 2 }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#EC5609',
                  borderRadius: '50%',
                  border: '6px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;