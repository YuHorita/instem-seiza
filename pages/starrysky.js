import dynamic from "next/dynamic";
import "bootstrap/dist/css/bootstrap.css";

const SketchComponent = dynamic(() => import("../components/SkySketch"), {
  loading: () => <></>,
  ssr: false,
});

const StarrySky = () => {
  return <SketchComponent />;
};

export default StarrySky;
