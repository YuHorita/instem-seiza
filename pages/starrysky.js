import dynamic from "next/dynamic";
import { designs } from "../components/library";
import Script from "next/script";

const SketchComponent = dynamic(() => import("../components/SkySketch"), {
  loading: () => <></>,
  ssr: false,
});

export default function StarrySky() {
  return (
    <main>
      <SketchComponent />
      <div
        className="hiddenContent"
        style={{ visibility: "hidden", position: "fixed" }}
      >
        {designs.map((design) => (
          <p key={design.name} className="fw-bold">
            {design.name}
          </p>
        ))}
      </div>
      <Script
        type="text/javascript"
        src="//typesquare.com/3/tsst/script/ja/typesquare.js?64fe9ab4c940489b8184031bac1e02d5"
        charset="utf-8"
      />
    </main>
  );
}
