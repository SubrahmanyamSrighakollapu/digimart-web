// HomePages/WelcomeAgri.jsx
import cardImg1 from '../../assets/MainPage/agri_welcomeCardImg1.png';
import cardImg2 from '../../assets/MainPage/agri_welcomeCardImg2.png';
import cardImg3 from '../../assets/MainPage/agri_welcomeCardImg3.jpg';
import welcomeBg from '../../assets/MainPage/agri_welcomeImg.jpg';
import leafImg from '../../assets/MainPage/LeafImg.png';
import leavesImg from '../../assets/MainPage/leavesImg.png';
import DiscoverMoreButton from '../../components/DiscoverMoreButton';

const WelcomeAgri = () => {
    const cards = [
        { feature: 'Feature 01', title: 'Direct From Farmers', img: cardImg1 },
        { feature: 'Feature 02', title: 'Rural to Urban Connection', img: cardImg2 },
        { feature: 'Feature 03', title: 'Smart Agri Supply Chain', img: cardImg3 },
    ];

    return (
        <section className="welcome-section">

            {/* Hero Background */}
            <div className="hero-bg d-flex align-items-center">
                <div className="container hero-content text-white">
                    <h3 className="small white mb-3">Welcome to agri farming</h3>

                    <div className="mb-4">
                        <h2 className="white col-5">
                            Empowering Local Farmers, Agents, and{' '}
                            <span className="title-end d-inline-flex align-items-center">
                                Consumers
                                <img src={leafImg} alt="Leaf decoration" className="leaf-img-inline ms-3" />
                            </span>
                        </h2>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        <DiscoverMoreButton />
                        <img src={leavesImg} alt="Leaves decoration" className="leaves-img" />
                    </div>
                </div>
                    </div>
                {/* 3 Cards overlapping at the bottom */}
                <div className="container cards-container d-flex justify-content-center gap-4 flex-lg-row flex-column align-items-center">
                    {cards.map((card, index) => (
                        <div key={index} className="feature-card card d-flex flex-column align-items-center justify-content-center p-3 shadow-sm" style={{width: '18rem', height: '16rem'}}>
                            <p className="subtitle mb-1">{card.feature}</p>
                            <h3 className="card-title mb-2 text-center">{card.title}</h3>
                            <img src={card.img} alt={card.title} className="card-img" />
                        </div>
                    ))}
                </div>
            



            <style jsx>{`
        /* Minimal CSS only for the visual bits not covered by Bootstrap utilities */
        .welcome-section { width: 100%; height: auto; margin-top: -2rem; padding-top: 0; }

        .hero-bg {
          background-image: url(${welcomeBg});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          min-height: 75vh; /* keep hero tall but avoid nested scroll */
          padding-left: 25%;
        }

        .leaf-img-inline { width: 5.75rem; height: 4.6875rem; object-fit: contain; }
        .leaves-img { height: 4rem; object-fit: contain; }

        .cards-container { margin-top: -2rem; }

        .feature-card { border-radius: 0.625rem; transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .feature-card:hover { transform: translateY(-10px); box-shadow: 0 1.25rem 3rem rgba(0,0,0,0.12); }

        .card-img { width: 7rem; height: 7rem; border-radius: 0.625rem; object-fit: cover; }

        /* Responsive adjustments (small overrides only) */
        @media (max-width: 992px) {
          .hero-bg { padding-left: 5%; }
          .cards-container { margin-top: -4rem; }
        }

        @media (max-width: 768px) {
          .cards-container { margin-top: -4rem; }
          .card-img { width: 5rem; height: 5rem; }
        }
      `}</style>
        </section>
    );
};

export default WelcomeAgri;