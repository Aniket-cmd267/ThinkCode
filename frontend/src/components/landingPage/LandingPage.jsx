import CompetitionArena from "./CompetitionArena";
import FeatureGrid from "./FeatureGrid";
import HeroSection from "./HeroSection";
import InteractivePreview from "./InteractivePreview";
import AIMentorship from './AiMentor'
import PathToMastery from "./PathToMastery";
import SocialProof from "./SocialProof";
import Footer from "./Footer";

export default function LandingPage(){
  return (
    <>
      <HeroSection></HeroSection>
      <InteractivePreview></InteractivePreview>
      <FeatureGrid></FeatureGrid>
      {/* <CompetitionArena></CompetitionArena> */}
      {/* <AIMentorship></AIMentorship> */}
      <PathToMastery></PathToMastery>
      <SocialProof></SocialProof>
      <Footer></Footer>
    </>
  )
}