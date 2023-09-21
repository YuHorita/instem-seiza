import dynamic from "next/dynamic";
import { designs } from "../components/library";
import "bootstrap/dist/css/bootstrap.css";

const SketchComponent = dynamic(() => import("../components/SkySketch"), {
  loading: () => <></>,
  ssr: false,
});

const StarrySky = () => {
  return (
    <main>
      <SketchComponent />
      <div
        className="hiddenContent"
        style={{ visibility: "hidden", position: "fixed" }}
      >
        {designs.map((design) => (
          <p>{design.name}</p>
        ))}
      </div>
    </main>
  );
};

export default StarrySky;
