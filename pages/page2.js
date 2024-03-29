import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import supabase from "./api/supabase";
import { designs } from "../components/library";
import Script from "next/script";
import { useRouter } from "next/router";
import Link from "next/link";

const SketchComponent = dynamic(() => import("../components/DrawSketch"), {
  loading: () => <div>Loading SketchComponent...</div>,
  ssr: false,
});

var designerName = "";
var selectedDesigns = [];
var starLines = [];

const Page2 = () => {
  const [constellationName, setConstellationName] = useState("");
  const [isTouchable, setIsTouchable] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      designerName = JSON.parse(localStorage.getItem("designerName"));
      selectedDesigns = JSON.parse(localStorage.getItem("selectedDesigns"));
      if (designerName == "" || selectedDesigns == null) {
        // selectedDesignsなどが空だった場合は、トップページに戻す
        window.location.href = "/";
      }
    } catch (e) {
      console.log(e);
    }

    // モバイルでかつselectedDesignが8つ以上の場合は、回転を促すためにisTouchableをfalseにする
    if (
      navigator.userAgent.match(/iPhone|Android.+Mobile/) &&
      selectedDesigns.length >= 8
    ) {
      setIsTouchable(false);
    } else {
      setIsTouchable(true);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem(
      "constellationName",
      JSON.stringify(constellationName)
    );

    try {
      starLines = JSON.parse(localStorage.getItem("starLines"));
    } catch (e) {
      console.log(e);
    }

    const { data, error } = await supabase
      .from("instem_seiza")
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
      .select()
      .single();

    console.log(data.id);

    window.location.href = "/result/" + data.id;
  };

  return (
    <main className="bg-body text-body px-4">
      <section className="container-fluid p-0">
        <div className="text-center mt-3 mb-4">
          <h3 className="text-primary fs-5 fw-bold">Step 2/3</h3>
          <h2 className="fw-bold">星をつなごう</h2>
        </div>
        <p>
          広大な夜空から、あなたをあらわす星を見つけ出しました。次は、星同士をつないで星座を描いてみましょう。
        </p>

        <div className="balloon1">
          <p className="fw-bold">星をタップしてつないでみましょう！</p>
        </div>
        <SketchComponent isTouchable={isTouchable}>
          <div
            className={`rotate-guide d-flex flex-column justify-content-center align-items-center gap-4 py-3 ${
              isTouchable ? "is-hidden" : "is-visible"
            }`}
          >
            <div className="d-flex align-items-center justify-content-center gap-3">
              <img src="/rotate_icon.png" style={{ height: "2.5rem" }}></img>
              <p className="m-0">
                スマホを横に回転させると
                <br />
                操作しやすくなります。
              </p>
            </div>
            <button
              type="button"
              className="btn border-white d-inline rounded-5 fs-5 text-center fw-bold"
              style={{ padding: "0.8rem 2.8rem" }}
              onClick={() => setIsTouchable(true)}
            >
              はじめる
            </button>
          </div>
        </SketchComponent>

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
            <span className="text-danger">*</span>
          </label>
          <div className="input-group has-validation mb-5">
            <input
              type="text"
              className="form-control p-3"
              id="constellationName"
              value={constellationName}
              onChange={(e) => setConstellationName(e.target.value)}
              required
              maxLength="50"
              placeholder="例：わたしのキャリア"
            />
            <span className="input-group-text">座</span>
            <div className="invalid-feedback">星座名を入力してください。</div>
          </div>
          <p>
            回答を送信することで
            <a
              className="text-primary"
              href="/terms"
              target="_blank"
            >
              利用規約
            </a>
            に同意したものとみなします。
          </p>
          <div className="mt-4 d-flex flex-column align-items-center justify-content-center gap-3">
            <button
              type="submit"
              className="btn btn-primary rounded-5 px-5 py-3 fs-5 text-center fw-bold"
            >
              回答を送信する
            </button>

            <Link
              className="btn bg-transparent px-5 py-3 text-center fw-bold"
              href="/"
            >
              前のページに戻る
            </Link>
          </div>
        </form>
        <div
          className="hiddenContent"
          style={{ visibility: "hidden", position: "fixed" }}
        >
          {designs.map((design) => (
            <p
              key={design.name}
              className="fw-bold"
              suppressHydrationWarning={true}
            >
              {design.name}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Page2;
