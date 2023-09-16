import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "bootstrap/dist/css/bootstrap.css";
import { designs } from "../components/library";

const SketchComponent = dynamic(() => import("../components/ResultSketch"), {
  loading: () => <div>Loading SketchComponent...</div>,
  ssr: false,
});

const Page3 = (designerName) => {
  const [canvasImage, setCanvasImage] = useState(null);
  const handleCanvasSave = (imageData) => {
    setCanvasImage(imageData);
  };

  var designerName = "";
  var constellationName = "";
  try {
    designerName = JSON.parse(localStorage.getItem("designerName"));
    constellationName = JSON.parse(localStorage.getItem("constellationName"));
  } catch (e) {
    console.log(e);
  }

  return (
    <main
      data-bs-theme="designship"
      className="bg-body text-body container-flued p-4"
    >
      <div className="text-center mt-3 mb-4">
        <h2 className="fw-bold" suppressHydrationWarning={true}>
          {designerName}さんの星座
        </h2>
      </div>
      <SketchComponent onSave={handleCanvasSave} />
      {canvasImage && (
        <img
          src={canvasImage}
          alt={`${designerName}さんの星座`}
          style={{ width: "100%" }}
        />
      )}

      <p className="mt-4">
        素敵な星座が完成しました！ 体験いただきありがとうございました。
      </p>
      <p className="mt-3">画像を長押しすると保存できます。</p>

      <div
        className="hiddenContent"
        style={{ visibility: "hidden", position: "fixed" }}
        suppressHydrationWarning={true}
      >
        <p>{designerName}さんの星座</p>
        <p>{constellationName}座</p>
        {designs.map((design) => (
          <p>{design.name}</p>
        ))}
      </div>
    </main>
  );
};

export default Page3;
