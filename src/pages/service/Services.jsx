// src/services/Services.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import Top from '../../components/Top';
import AffordableTools from './AffordableTools';
import Education from './Education';
import OurServices from './OurServices';
import SupportForFarmers from './SupportForFarmers';


const Services = () => {
  return (
    <>
      <Top
        title="Services"
        subtitle="Empowering organic trade through innovative solutions and seamless connectivity."
      />
      <OurServices />
      <SupportForFarmers />
      <Education />
      <AffordableTools />
      
    </>
  );
};

export default Services;