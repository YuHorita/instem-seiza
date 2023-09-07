import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "bootstrap/dist/css/bootstrap.css";
import supabase from "./api/supabase";

const SketchComponent = dynamic(() => import("../components/DrawSketch"), {
  loading: () => <></>,
  ssr: false,
});

var designerName = "";
var selectedStars = [];
var starLines = [];

try {
  designerName = JSON.parse(localStorage.getItem("designerName"));
  selectedStars = JSON.parse(localStorage.getItem("selectedStars"));
} catch (e) {
  console.log(e);
}

const Page2 = () => {
  const [starName, setStarName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("starName", JSON.stringify(starName));

    try {
      starLines = JSON.parse(localStorage.getItem("starLines"));
    } catch (e) {
      console.log(e);
    }

    // try {
    //   const response = await fetch("/api/addData", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       designerName,
    //       selectedStars,
    //       starName,
    //       starLines,
    //     }),
    //   });

    //   if (response.status === 201) {
    //     setMessage("データが追加されました");
    //   } else {
    //     setMessage("データの追加に失敗しました");
    //   }
    // } catch (error) {
    //   console.error("データ追加エラー:", error);
    // }

    const { data, error } = await supabase
      .from("designStars")
      .insert([
        {
          // created_at: new Date(),
          designerName: designerName,
          starName: starName,
          starLines: starLines,
          selectedStars: selectedStars,
        },
      ])
      .select();

    window.location.href = "/page3";
  };

  return (
    <main
      data-bs-theme="designship"
      className="bg-body text-body container-flued p-4"
    >
      {/* <h1 className="fw-bold">{router.query.displayName}さんの星座</h1> */}
      <div className="text-center mt-3 mb-4">
        <h3 className="text-primary fs-5 fw-bold">Step 2/3</h3>
        <h2 className="fw-bold">星座を描こう</h2>
      </div>
      <p>
        広大なデザインの星空から、あなたにとってのデザインの星を見つけ出しました。次は、星同士を繋ぐことで星座を描いてみましょう。
      </p>
      <p>
        デザインの星を2つタップすると星同士が繋がります。線のある場所をもう一度選ぶと線を消すことができます。
      </p>
      <SketchComponent />

      <div className="text-center mt-5 mb-3">
        <h3 className="text-primary fs-5 fw-bold">Step 3/3</h3>
        <h2 className="fw-bold">星座に名前をつけよう</h2>
      </div>
      <p>最後に、描いた星座に名前をつけてみましょう。 </p>

      <form onSubmit={handleSubmit} className="my-5">
        <label htmlFor="starName" className="form-label">
          星座名
        </label>

        <div className="input-group mb-5">
          <input
            type="text"
            className="form-control p-3"
            id="starName"
            value={starName}
            onChange={(e) => setStarName(e.target.value)}
          />
          <span className="input-group-text">座</span>
        </div>
        <div className="d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-primary rounded-5 px-5 py-2 fs-5 text-center"
          >
            回答を送信する
          </button>
        </div>
      </form>
    </main>
  );
};

export default Page2;
