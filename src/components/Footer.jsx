// src/components/Footer.jsx

import { Link } from 'react-router-dom';
import fb from '../assets/footer/fb.png';
import insta from '../assets/footer/Insta.png';
import locationIcon from '../assets/footer/location.png';
import mail from '../assets/footer/Mail.png';
import phone from '../assets/footer/Phone.png';
import pinterest from '../assets/footer/pintrest.png';
import send from '../assets/footer/send.png';
import twitter from '../assets/footer/twitter.png';
import logo from '../assets/digimart.png';

const Footer = () => {
    const quickLinks = [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/about' },
        // { label: 'Services', path: '/services' },
        { label: 'Shop', path: '/shop' },
        { label: 'Partners', path: '/partners' },
        { label: 'Contact', path: '/contact' },
    ];

    const legalLinks = [
        { label: 'Terms of Use', path: '/terms-and-conditions' },
        { label: 'Privacy Policy', path: '/privacy-policy' },
        { label: 'Refund Policy', path: '/refund-policy' },
    ];

    const socials = [
        { src: fb, alt: 'Facebook' },
        { src: twitter, alt: 'Twitter' },
        { src: insta, alt: 'Instagram' },
        { src: pinterest, alt: 'Pinterest' },
    ];

    return (
        <footer className="w-100" role="contentinfo">

            {/* Main Footer */}
            <div style={{ background: '#2f302d' }}>
                {/* Green top accent bar */}
                <div style={{ height: '4px', background: 'linear-gradient(90deg, #EC5609, #c54607)' }} />

                <div className="container-fluid px-lg-5 px-4 py-4">
                    <div className="row gy-3">

                        {/* Col 1: Brand */}
                        <div className="col-lg-4 col-md-12">
                            <img src={logo} alt="DigiMart" style={{ height: '8rem', marginBottom: '1rem', borderRadius: '0.5rem' }} />
                            <p style={{ color: '#fff', fontSize: '0.875rem', lineHeight: '1.6rem', maxWidth: '22rem' }}>
                                Connecting farmers, agents, and consumers through ethical organic trade. Fresh, naturally grown produce — from soil to shelf.
                            </p>

                            {/* Social Icons */}
                            {/* <div className="d-flex gap-3 mt-4">
                                {socials.map((s) => (
                                    <a key={s.alt} href="#" aria-label={s.alt}
                                        style={{
                                            width: '2.5rem', height: '2.5rem',
                                            background: 'rgba(236,91,19,0.12)',
                                            border: '1px solid rgba(236,91,19,0.3)',
                                            borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.25s ease'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#EC5609'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(236,91,19,0.12)'}
                                    >
                                        <img src={s.src} alt={s.alt} style={{ width: '1.1rem', height: '1.1rem', objectFit: 'contain' }} />
                                    </a>
                                ))}
                            </div> */}
                        </div>

                        {/* Col 2: Quick Links */}
                        <div className="col-lg-2 col-md-4 col-6">
                            <h4 style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.6rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Quick Links
                            </h4>
                            <div style={{ width: '2rem', height: '2px', background: '#EC5609', marginBottom: '0.6rem', borderRadius: '2px' }} />
                            <div className="d-flex flex-column gap-2">
                                {quickLinks.map((link) => (
                                    <Link key={link.label} to={link.path}
                                        style={{ color: '#fff', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.target.style.color = '#EC5609'}
                                        onMouseLeave={e => e.target.style.color = '#fff'}
                                    >
                                        <span style={{ color: '#EC5B13', marginRight: '0.5rem' }}>›</span>
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Col 3: Contact */}
                        <div className="col-lg-3 col-md-4 col-12">
                            <h4 style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.6rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Contact Us
                            </h4>
                            <div style={{ width: '2rem', height: '2px', background: '#EC5609', marginBottom: '0.6rem', borderRadius: '2px' }} />

                            <div className="d-flex flex-column gap-2">
                                <div className="d-flex align-items-start gap-3">
                                    <div style={{ width: '1.6rem', height: '1.6rem', background: 'rgba(236,91,19,0.12)', border: '1px solid rgba(236,91,19,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <img src={phone} alt="" style={{ width: '0.7rem', height: '0.7rem' }} />
                                    </div>
                                    <div>
                                        <p style={{ color: '#fff', fontSize: '0.7rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</p>
                                        <span style={{ color: '#d4d4cc', fontSize: '0.875rem' }}>+91 9652283222</span>
                                    </div>
                                </div>

                                <div className="d-flex align-items-start gap-3">
                                    <div style={{ width: '1.6rem', height: '1.6rem', background: 'rgba(236,91,19,0.12)', border: '1px solid rgba(236,91,19,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <img src={mail} alt="" style={{ width: '0.7rem', height: '0.7rem' }} />
                                    </div>
                                    <div>
                                        <p style={{ color: '#fff', fontSize: '0.7rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</p>
                                        <span style={{ color: '#d4d4cc', fontSize: '0.875rem' }}>info@mdigimart.com</span>
                                    </div>
                                </div>

                                <div className="d-flex align-items-start gap-3">
                                    <div style={{ width: '1.6rem', height: '1.6rem', background: 'rgba(236,91,19,0.12)', border: '1px solid rgba(236,91,19,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.2rem' }}>
                                        <img src={locationIcon} alt="" style={{ width: '0.7rem', height: '0.7rem' }} />
                                    </div>
                                    <div>
                                        <p style={{ color: '#fff', fontSize: '0.7rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address</p>
                                        <span style={{ color: '#d4d4cc', fontSize: '0.875rem', lineHeight: '1.5rem' }}>
                                            BRIGHT SPARK INNOVATIONS PVT. LTD.<br />
                                            Door No: 12-8-42, 2nd Floor,<br />
                                            Savithri Mallaiah Arcade,<br />
                                            Lallaguda, Secunderabad,<br />
                                            Hyderabad, Telangana - 500017
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Col 4: Newsletter */}
                        <div className="col-lg-3 col-md-4 col-12">
                            <h4 style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.6rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Newsletter
                            </h4>
                            <div style={{ width: '2rem', height: '2px', background: '#EC5609', marginBottom: '0.6rem', borderRadius: '2px' }} />

                            <p style={{ color: '#d4d4cc', fontSize: '0.875rem', lineHeight: '1.6rem', marginBottom: '0.75rem' }}>
                                Stay updated with the latest news on organic farming and agri trade.
                            </p>

                            <div className="position-relative" style={{ maxWidth: '20rem' }}>
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    style={{
                                        width: '100%',
                                        height: '2.5rem',
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(175, 116, 71, 0.3)',
                                        borderRadius: '0.5rem',
                                        paddingLeft: '1rem',
                                        paddingRight: '3.5rem',
                                        color: '#ffffff',
                                        fontSize: '0.9rem',
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    style={{
                                        position: 'absolute', right: 0, top: 0,
                                        width: '2.5rem', height: '2.5rem',
                                        background: '#EC5609',
                                        border: 'none', borderRadius: '0 0.5rem 0.5rem 0',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#682d06'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#EC5609'}
                                >
                                    <img src={send} alt="Subscribe" style={{ width: '1.1rem', height: '1.1rem' }} />
                                </button>
                            </div>

                            {/* Agent Login CTA */}
                            <Link to="/login"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                    marginTop: '0.75rem',
                                    padding: '0.4rem 1rem',
                                    background: 'transparent',
                                    border: '1px solid #EC5609',
                                    borderRadius: '0.5rem',
                                    color: '#EC5609',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    transition: 'all 0.25s ease'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#EC5609'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#EC5609'; }}
                            >
                                Agent Login →
                            </Link>
                        </div>

                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '0 2rem' }} />

                {/* Bottom Bar */}
                <div className="container-fluid px-lg-5 px-4 py-3">
                    <div className="d-flex justify-content-between align-items-center flex-column flex-md-row gap-2">
                        <p style={{ color: '#fff', margin: 0, fontSize: '0.875rem' }}>
                            © {new Date().getFullYear()} DigiMart. All rights reserved.
                        </p>
                        <div className="d-flex gap-3 flex-wrap justify-content-center">
                            {legalLinks.map((l, i) => (
                                <span key={l.label} className="d-flex align-items-center gap-3">
                                    <Link to={l.path}
                                        style={{ color: '#fff', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.target.style.color = '#EC5609'}
                                        onMouseLeave={e => e.target.style.color = '#fff'}
                                    >
                                        {l.label}
                                    </Link>
                                    {i < legalLinks.length - 1 && <span style={{ color: '#fff' }}>|</span>}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;
