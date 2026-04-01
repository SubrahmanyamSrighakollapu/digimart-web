// src/services/Education.jsx

import img2 from '../../assets/services/Img2.jpg';
import img3 from '../../assets/services/Img3.jpg';
import img4 from '../../assets/services/Img4.jpg';

const Education = () => {
  const educationCards = [
    {
      img: img2,
      alt: "Urban Agri Academy Access",
      title: "Urban Agri Academy Access",
      description: "Comprehensive courses on sustainable urban farming.",
      linkText: "Learn more →"
    },
    {
      img: img3,
      alt: "Learning Support",
      title: "Learning Support",
      description: "On-demand video tutorials and expert webinars.",
      linkText: "View Library →"
    },
    {
      img: img4,
      alt: "Organic Farming Practices",
      title: "Organic Farming Practices",
      description: "Certification guides and soil health management.",
      linkText: "Start Course →"
    }
  ];

  return (
    <section className="py-5 py-lg-7">
      <div className="container">
        {/* Title and Paragraph Section */}
        <div className="row justify-content-center text-center align-items-center">
          <div className="section-header">
            <h2 className="mb-1">EDUCATION THAT EMPOWERS</h2>
            <p>
              Bridging the knowledge gap with modern farming techniques.
            </p>
          </div>
        </div>

        {/* 3 Cards Row */}
        <div className="row g-4 g-xl-5 justify-content-center">
          {educationCards.map((card, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="education-card h-100 d-flex flex-column">
                <img src={card.img} alt={card.alt} className="card-img-top" />
                <div className="p-4 flex-grow-1 d-flex flex-column">
                  <h3 className="card-title mb-2">{card.title}</h3>
                  <p style={{color:'#565656'}}>
                    {card.description}
                  </p>
                  <a href="#" className="mt-auto learn-more-link">
                    {card.linkText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <style jsx>{`
       
        

        /* Card container */
        .education-card {
          width: 25rem;
          max-width: 100%;
          background: #FFFFFF;
          border-radius: 10px;
          border: 0.5px solid #959595;
          box-shadow: 2px 2px 4px 0px #00000040;
        }

        /* Card image */
        .education-card .card-img-top {
          width: 22rem;
          max-width: 100%;
          height: 198px;
          object-fit: cover;
          border-radius: 8px;
          margin: 24px auto 0;
          display: block;
          background-color: #D9D9D9;
        }

        /* Learn more link/button */
        .learn-more-link {
          font-family: 'Manrope', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          line-height: 30px;
          color: #0A6806;
          text-decoration: none;
          align-self: flex-start;
        }

        .learn-more-link:hover {
          text-decoration: underline;
        }

        /* Responsive adjustment: stack cards on smaller screens */
        @media (max-width: 992px) {
          .education-card {
            width: 100%;
            height: auto;
          }
        }
      `}</style>
    </section>
  );
};

export default Education;