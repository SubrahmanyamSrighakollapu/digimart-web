// src/services/Services.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import PartnersHero from './PartnersHero';
import WhyBrandUs from './WhyBrandUs';
import OnboardingProcess from './OnboardingProcess';
import Testimonials from '../HomePages/Testimonials';


const Partners = () => {
  return (
    <>
      <PartnersHero />
      <WhyBrandUs/>
      <OnboardingProcess/>
      <Testimonials/>
      
    </>
  );
};

export default Partners;