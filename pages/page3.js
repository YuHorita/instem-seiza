import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "bootstrap/dist/css/bootstrap.css";

const SketchComponent = dynamic(() => import("../components/ResultSketch"), {
  loading: () => <></>,
  ssr: false,
});

const Page3 = (displayName) => {
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
      <SketchComponent />
      <p className="mt-3">
        素敵な星座が完成しました！体験いただきありがとうございました。
      </p>

      <div className="d-flex justify-content-center my-5">
        <button className="btn btn-primary rounded-5 px-5 py-2 fs-5 text-center">
          画像を保存する
        </button>
      </div>
    </main>
  );
};

export default Page3;
