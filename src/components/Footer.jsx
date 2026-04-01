// src/components/Footer.jsx

import { Link } from 'react-router-dom';
import divider from '../assets/footer/divider.png';
import fb from '../assets/footer/fb.png';
import icon from '../assets/footer/Icon.png';
import insta from '../assets/footer/Insta.png';
import locationIcon from '../assets/footer/location.png';
import mail from '../assets/footer/Mail.png';
import phone from '../assets/footer/Phone.png';
import pinterest from '../assets/footer/pintrest.png';
import send from '../assets/footer/send.png';
import twitter from '../assets/footer/twitter.png';
import logo from '../assets/total-needs-logo.png';

const Footer = () => {
    const quickLinks = ['About', 'Services', 'Agent Login', 'Contact'];
    const newsItems = [
        { title: 'Bringing Food Production Back To Cities', date: 'July 5, 2022' },
        { title: 'The Future of Farming, Smart Irrigation Solutions', date: 'July 5, 2022' }
    ];

    return (
        <footer className="w-100" role="contentinfo">
            {/* Top section */}
            <div className="py-5" style={{ background: '#24231D' }}>
                <div className="container-fluid">
                    <div className="row w-100 mx-0">

                        {/* Column 1: Logo & Description */}
                        <div className="col-lg-3 col-md-6 col-12 mb-4 px-4">
                            <img src={logo} alt="Total Needs" style={{ height: '8rem', marginBottom: '1rem' }} />
                            <p className="mb-4" style={{ color: '#A5A49A', fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: '0.9375rem', lineHeight: '1.875rem' }}>
                                Fresh, naturally grown produce without chemicals or harmful additives.
                            </p>

                            <div className="d-flex gap-2 mt-2">
                                <img src={twitter} alt="Twitter" className="social-icon" />
                                <img src={insta} alt="Instagram" className="social-icon" />
                                <img src={pinterest} alt="Pinterest" className="social-icon" />
                                <img src={fb} alt="Facebook" className="social-icon" />
                            </div>
                        </div>

                        {/* Column 2: Explore */}
                        <div className="col-lg-2 col-md-6 col-12 mb-4 px-4">
                            <h3 className="mb-2 text-white" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.25rem' }}>Explore</h3>
                            <img src={divider} alt="" className="d-block mb-3 divider" />

                            <div className="d-flex flex-column gap-2">
                                {quickLinks.map((link, index) => {
                                    const linkPath = link === 'About' ? '/about' : 
                                                   link === 'Services' ? '/services' : 
                                                   link === 'Agent Login' ? '/login' :
                                                   link === 'Contact' ? '/contact' : '#';
                                    
                                    return (
                                        <div key={index} className="d-flex align-items-center gap-2">
                                            <img src={icon} alt="" style={{ width: '0.9375rem', height: '0.9375rem' }} />
                                            <Link 
                                                to={linkPath} 
                                                style={{ 
                                                    color: '#A5A49A', 
                                                    fontFamily: 'Manrope, sans-serif', 
                                                    fontWeight: 500, 
                                                    fontSize: '0.9375rem',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                {link}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Column 3: News */}
                        <div className="col-lg-3 col-md-6 col-12 mb-4 px-4">
                            <h3 className="mb-2 text-white" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.25rem' }}>News</h3>
                            <img src={divider} alt="" className="d-block mb-3 divider" />

                            <div className="d-flex flex-column gap-3">
                                {newsItems.map((item, index) => (
                                    <div key={index}>
                                        <p style={{ color: '#FFFFFF', fontFamily: 'Manrope, sans-serif', fontWeight: 300, fontSize: '1rem', margin: 0 }}>{item.title}</p>
                                        <p style={{ color: '#EEC044', fontFamily: 'Manrope, sans-serif', fontWeight: 300, fontSize: '0.9375rem', margin: '0.25rem 0 1.2rem' }}>{item.date}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Column 4: Contact */}
                        <div className="col-lg-4 col-md-6 col-12 mb-4 px-4">
                            <h3 className="mb-2 text-white" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.25rem' }}>Contact</h3>
                            <img src={divider} alt="" className="d-block mb-3 divider" />

                            <div className="d-flex align-items-center gap-2 mb-2">
                                <img src={phone} alt="" style={{ width: '0.9375rem', height: '0.9375rem' }} />
                                <span style={{ color: '#A5A49A', fontFamily: 'Manrope, sans-serif', fontWeight: 500 }}>9581906060</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <img src={mail} alt="" style={{ width: '0.9375rem', height: '0.9375rem' }} />
                                <span style={{ color: '#A5A49A', fontFamily: 'Manrope, sans-serif', fontWeight: 500 }}>support@totalneeds.in</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <img src={locationIcon} alt="" style={{ width: '0.9375rem', height: '0.9375rem' }} />
                                <span style={{ color: '#A5A49A', fontFamily: 'Manrope, sans-serif', fontWeight: 500 }}>#405, ALLURI TRADE CENTRE, BHAGYANAGAR COLONY KUKATPALLY HYDERABAD 500072</span>
                            </div>

                            <div className="position-relative" style={{ marginTop: '1rem', maxWidth: '21rem' }}>
                                <input
                                    type="text"
                                    placeholder="Enter your location"
                                    className="form-control location-input"
                                    style={{ 
                                        height: '3.125rem', 
                                        borderRadius: '0.625rem', 
                                        paddingRight: '3.5rem',
                                        width: '100%'
                                    }}
                                />
                                <button 
                                    className="btn position-absolute" 
                                    style={{ 
                                        background: '#4BAF47', 
                                        borderRadius: '0.625rem', 
                                        width: '3rem', 
                                        height: '3.125rem', 
                                        display: 'inline-flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        right: 0,
                                        top: 0
                                    }}
                                >
                                    <img src={send} alt="Send" style={{ width: '1.25rem', height: '1.25rem' }} />
                                </button>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

            {/* Bottom section */}
            <div style={{ background: '#1F1E17' }}>
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center py-3 flex-column flex-md-row">
                        <p style={{ color: '#A5A49A', margin: 0 }}>© All Copyright 2024. All rights reserved</p>
                        <p style={{ color: '#A5A49A', margin: 0, textAlign: 'right' }}>
                            <Link to="/terms-and-conditions" style={{ color: '#A5A49A', textDecoration: 'none' }}>Terms of Use</Link>
                            {' '} | {' '}
                            <Link to="/privacy-policy" style={{ color: '#A5A49A', textDecoration: 'none' }}>Privacy Policy</Link>
                            {' '} | {' '}
                            <Link to="/refund-policy" style={{ color: '#A5A49A', textDecoration: 'none' }}>Refund policy</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Minimal custom CSS to preserve exact sizing and responsive adjustments */}
            <style>{`
                .social-icon { width: 2.5rem; height: 2.5rem; border-radius: 1.25rem; object-fit: contain; }
                .divider { width: 9.8125rem; height: auto; }
                
                @media (max-width: 480px) {
                    .divider { width: 8.5rem; }
                }
            `}</style>
        </footer>
    );
};

export default Footer;