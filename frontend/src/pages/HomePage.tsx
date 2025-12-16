import { Terminal } from "../components/Terminal";
import { useRippleBackground } from "../hooks/useRippleBackground";

const HomePage = () => {
  const rippleRef = useRippleBackground();

  return (
    <div className="home-page">
      <div className="ripple-background" ref={rippleRef}></div>
      <div className="home-content">
        <Terminal />
      </div>
    </div>
  );
};

export default HomePage;
