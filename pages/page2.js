import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "bootstrap/dist/css/bootstrap.css";
import supabase from "./api/supabase";
import fontAsync from "./api/fontAsync";

const SketchComponent = dynamic(() => import("../components/DrawSketch"), {
  loading: () => <></>,
  ssr: false,
});

var designerName = "";
var selectedDesigns = [];
var starLines = [];

const Page2 = () => {
  const [constellationName, setConstellationName] = useState("");

  useEffect(() => {
    fontAsync();

    try {
      designerName = JSON.parse(localStorage.getItem("designerName"));
      selectedDesigns = JSON.parse(localStorage.getItem("selectedDesigns"));
    } catch (e) {
      console.log(e);
    }

    var forms = document.querySelectorAll(".needs-validation");
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener(
        "submit",
        function (event) {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add("was-validated");
        },
        false
      );
    });
  }, []);

  const handleInputChange = (e) => {
    setConstellationName(e.target.value);
    Ts.loadFont();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem(
      "constellationName",
      JSON.stringify(constellationName)
    );

    try {
      starLines = JSON.parse(localStorage.getItem("starLines"));
      console.log(starLines);
    } catch (e) {
      console.log(e);
    }

    const { data, error } = await supabase
      .from("design_constellation")
      .insert(
        [
          {
            designer_name: designerName,
            constellation_name: constellationName,
            selected_designs: selectedDesigns,
            star_lines: starLines,
          },
        ],
        { returning: "minimal" }
      )
      .select();

    window.location.href = "/page3";
  };

  return (
    <main
      data-bs-theme="designship"
      className="bg-body text-body container-flued p-4"
    >
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

      <form
        onSubmit={handleSubmit}
        className="my-5 needs-validation"
        noValidate
      >
        <label htmlFor="constellationName" className="form-label">
          星座名
        </label>
        <div className="input-group has-validation mb-5">
          <input
            type="text"
            className="form-control p-3"
            id="constellationName"
            value={constellationName}
            // onChange={(e) => {
            //   setConstellationName(e.target.value);
            //   loadFont();
            // }}
            onChange={handleInputChange}
            required
          />
          <span className="input-group-text">座</span>
          <div className="invalid-feedback">星座名を入力してください。</div>
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
