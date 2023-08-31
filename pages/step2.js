import React, { useEffect } from "react";
// import styles from "./page.module.css";
// import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "bootstrap/dist/css/bootstrap.css";

const SketchComponent = dynamic(() => import("../components/Sketch"), {
  loading: () => <></>,
  ssr: false,
});

var formData = {};

try {
  formData = JSON.parse(localStorage.getItem("formData"));
} catch (e) {
  console.log(e);
}

const ResultPage = () => {
  // useEffect(() => {
  //   function disableScroll(event) {
  //     event.preventDefault();
  //   }
  //   document.addEventListener("touchmove", disableScroll, {
  //     passive: false,
  //   });
  //   document.addEventListener("mousewheel", disableScroll, {
  //     passive: false,
  //   });
  // }, []);

  return (
    <main
      data-bs-theme="designship"
      className="bg-body text-body container-flued p-4"
    >
      {/* <h1 className="fw-bold">{router.query.displayName}さんの星座</h1> */}
      <div className="text-center mt-3 mb-4">
        <h3 className="text-primary fs-5 fw-bold">Step 2/2</h3>
        <h2 className="fw-bold">星座を描こう</h2>
      </div>
      <p>
        広大なデザインの星空から、あなたにとってのデザインの星を見つけ出しました。次は、星同士を繋ぐことで星座を描いてみましょう。
      </p>
      <p>
        デザインの星を2つタップすると星同士が繋がります。線のある場所をもう一度選ぶと線を消すことができます。
      </p>
      <SketchComponent data={formData} />
      <div className="d-flex justify-content-center my-3">
        <button
          type="submit"
          className="btn btn-primary rounded-5 px-5 py-2 fs-5 text-center"
        >
          回答を送信する
        </button>
      </div>
    </main>
  );
};

export default ResultPage;
