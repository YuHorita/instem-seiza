import React, { useEffect } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/router";
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

// console.log(formData);

const ResultPage = () => {
  const router = useRouter();
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
      <SketchComponent data={formData} />
    </main>
  );
};

export default ResultPage;
