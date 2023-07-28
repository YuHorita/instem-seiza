// import Sketch from "../components/Sketch";
import styles from "./page.module.css";
import { useRouter } from "next/router";
import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";

const SketchComponent = dynamic(() => import("../components/Sketch"), {
  loading: () => <></>,
  ssr: false,
});

const ResultPage = () => {
  const router = useRouter();
  return (
    <main className={styles.main} data-bs-theme="dark">
      <h1 className="text-light p-4">{router.query.displayName}さんの星座</h1>
      <SketchComponent />
    </main>
  );
};

export default ResultPage;
