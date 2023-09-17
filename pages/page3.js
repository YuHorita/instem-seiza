import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "bootstrap/dist/css/bootstrap.css";
import { designs } from "../components/library";

var designerName = "";
var constellationName = "";

try {
  designerName = JSON.parse(localStorage.getItem("designerName"));
  constellationName = JSON.parse(localStorage.getItem("constellationName"));
} catch (e) {
  console.log(e);
}

if (typeof window !== "undefined") {
  const designerNameHolder = document.getElementById("designerNameHolder");
  if (designerNameHolder) {
    designerNameHolder.innerText = designerName + "さんの星座";
  }
  const hiddenConstellationNameHolder = document.getElementById(
    "hiddenConstellationNameHolder"
  );
  if (hiddenConstellationNameHolder) {
    hiddenConstellationNameHolder.innerText = constellationName;
  }
  Ts.loadFont();
}

const SketchComponent = dynamic(() => import("../components/ResultSketch"), {
  loading: () => <div>Loading SketchComponent...</div>,
  ssr: false,
});

const Page3 = () => {
  const [canvasImage, setCanvasImage] = useState(null);
  const handleCanvasSave = (imageData) => {
    setCanvasImage(imageData);
  };

  // useEffect(() => {
  //   const importText = designerName + "さんの星座" + constellationName;

  //   function callbackJson(json) {
  //     console.log(json);

  //     const designerNameHolder = document.getElementById("designerNameHolder");
  //     if (designerNameHolder) {
  //       designerNameHolder.innerText = designerName + "さんの星座";
  //     }
  //     const hiddenConstellationNameHolder = document.getElementById(
  //       "hiddenConstellationNameHolder"
  //     );
  //     if (hiddenConstellationNameHolder) {
  //       hiddenConstellationNameHolder.innerText = constellationName;
  //       console.log("テキスト差し替え完了");
  //     }
  //   }
  // }, []);

  return (
    <main
      data-bs-theme="designship"
      className="bg-body text-body container-flued p-4"
    >
      <div className="text-center mt-3 mb-4">
        <h2 suppressHydrationWarning={true} id="designerNameHolder">
          {`${designerName}さんの星座`}
        </h2>
      </div>
      <SketchComponent onSave={handleCanvasSave} />
      {canvasImage && (
        <img src={canvasImage} alt="完成した星座" style={{ width: "100%" }} />
      )}

      <p className="mt-4">
        素敵な星座が完成しました！ 体験いただきありがとうございました。
      </p>
      <p className="mt-3">画像を長押しすると保存できます。</p>

      <div
        className="hiddenContent"
        style={{ visibility: "hidden", position: "fixed" }}
      >
        <p suppressHydrationWarning={true}>{`${constellationName}座`}</p>

        {designs.map((design) => (
          <p key={design.name}>{design.name}</p>
        ))}
      </div>
    </main>
  );
};

export default Page3;
