import heroImage from "../hero.png";

export default function HeroPanel() {
  return (
    <div className="hero-panel">
      <img src={heroImage} alt="LyricLab — your ideas, our lyrics" className="hero-image" />
    </div>
  );
}
