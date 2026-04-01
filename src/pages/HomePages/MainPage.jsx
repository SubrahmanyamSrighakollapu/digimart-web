// HomePages/MainPage.jsx
import BusinessAsAgent from "./BusinessAsAgent";
import ExploreProjects from "./ExploreProjects";
import OurFarmBenefits from "./OurFarmBenefits";
import OurIntroduction from "./OurIntroduction";
import QualityProducts from "./QualityProducts";
import WelcomeAgri from "./WelcomeAgri";
import WhatWeOffer from "./WhatWeOffer";

const MainPage = () => {
  return (
    <div style={styles.container}>
      {/* Navbar is fixed in Layout; render sections in normal flow */}
      <WelcomeAgri />
      <OurIntroduction />
      <WhatWeOffer />
      <QualityProducts />
      <ExploreProjects />
      <OurFarmBenefits />
      <BusinessAsAgent />
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    minHeight: 'auto',
    backgroundColor: '#FFFFFF',
  },
};

export default MainPage;