import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "bootstrap/dist/css/bootstrap.css";

const SketchComponent = dynamic(() => import("../components/ResultSketch"), {
  loading: () => <></>,
  ssr: false,
});

const Page3 = (displayName) => {
  const [canvasImage, setCanvasImage] = useState(null);
  const handleCanvasSave = (imageData) => {
    setCanvasImage(imageData);
  };
  const handleDownloadClick = () => {
    if (canvasImage) {
      const link = document.createElement("a");
      link.href = canvasImage;
      link.download = `${displayName}さんの星座.png`;
      link.click();
    }
  };

  var formData = {};
  var displayName = "";
  try {
    formData = JSON.parse(localStorage.getItem("formData"));
    displayName = formData.displayName;
  } catch (e) {
    console.log(e);
  }
  return (
    <main
      data-bs-theme="designship"
      className="bg-body text-body container-flued p-4"
    >
      <div className="text-center mt-3 mb-4">
        <h2 className="fw-bold">{displayName}さんの星座</h2>
      </div>
      <SketchComponent onSave={handleCanvasSave} />
      {canvasImage && (
        <img
          src={canvasImage}
          alt={`${displayName}さんの星座`}
          style={{ width: "100%" }}
        />
      )}

      <p className="mt-4">
        素敵な星座が完成しました！
        体験いただきありがとうございました。
      </p>
      <p className="mt-3">画像を長押しすると保存できます。</p>
    </main>
  );
};

export default Page3;
