import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { designs } from "../components/library";
// import Script from "next/script";

const SketchComponent = dynamic(() => import("../components/SkySketch"), {
  loading: () => <></>,
  ssr: false,
});

export default function StarrySky() {
  const [timeStamp, setTimeStamp] = useState(null);
  useEffect(() => {
    const now = new Date();
    setTimeStamp(now.toLocaleString());

    const intervalFunc = setInterval(() => {
      window.location.reload();
    }, 1000 * 60);
    return () => clearInterval(intervalFunc);
  }, []);
  return (
    <main>
      <SketchComponent />
      <p
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          margin: "0.5rem",
          fontSize: "0.8rem",
          color: "#fff",
          zIndex: 100,
        }}
      >
        {timeStamp}
      </p>
      <div
        className="hiddenContent"
        style={{ visibility: "hidden", position: "fixed" }}
      >
        {designs.map((design) => (
          <p key={design.name} className="fw-bold">
            {design.name}
          </p>
        ))}
        <p className="fw-bold">0123456789個本描かれた星座の数繋がれた星の数</p>
      </div>
      <script
        type="text/javascript"
        src="//typesquare.com/3/tsst/script/ja/typesquare.js?60d03ddf9b2c47128bf96dcae90393a3"
        charset="utf-8"
      ></script>
    </main>
  );
}
