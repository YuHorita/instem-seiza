import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "bootstrap/dist/css/bootstrap.css";
import { designs } from "../../components/library";
import Script from "next/script";
import supabase from "../api/supabase";

// var designerName = "";
// var constellationName = "";

const SketchComponent = dynamic(() => import("../../components/ResultSketch"), {
  loading: () => <div>Loading SketchComponent...</div>,
  ssr: false,
});

const Result = () => {
  const router = useRouter();
  const { id } = router.query;

  const [canvasImage, setCanvasImage] = useState(null);
  const [designerName, setDesignerName] = useState("");
  const [constellationName, setConstellationName] = useState("");
  const handleCanvasSave = (imageData) => {
    setCanvasImage(imageData);
  };
  const getData = async (id) => {
    console.log(id);
    try {
      const { data: design_constellation, error } = await supabase
        .from("design_constellation")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }
      //   const designerNameHolder = document.getElementById("designerNameHolder");
      //   if (designerNameHolder) {
      //     designerNameHolder.innerText =
      //       design_constellation.designer_name + "さんの星座";
      //   }
      //   designerName = design_constellation.designer_name;
      setDesignerName(design_constellation.designer_name);
      //   const hiddenConstellationNameHolder = document.getElementById(
      //     "hiddenConstellationNameHolder"
      //   );
      //   if (hiddenConstellationNameHolder) {
      //     hiddenConstellationNameHolder.innerText =
      //       design_constellation.constellation_name;
      //   }
      //   constellationName = design_constellation.constellation_name;
      setConstellationName(design_constellation.constellation_name);
    } catch (error) {
      console.error("データの取得に失敗しました", error);
    }
  };

  useEffect(() => {
    if (id) {
      getData(id); // idが変更されたらgetDataを呼び出す
    }
  }, [id]);

  return (
    <main data-bs-theme="designship" className="bg-body text-body">
      <section className="container-sm p-4">
        <p>ID: {id}</p>
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
          素敵な星座が完成しました！あなたの星座はDesignship
          2023の会場でも投影されています。
        </p>
        <p className="mt-3">画像を長押しすると保存できます。</p>

        <div className="text-center mt-5 mb-4">
          <h3 className="text-primary fs-5 fw-bold">Share & Connect</h3>
          <h2 className="fw-bold">星座を共有しよう</h2>
        </div>
        <p>
          完成した星座をSNSで共有してみませんか？自分と星座の形が似ている参加者を探してつながってみましょう。
        </p>

        <div className="d-flex justify-content-center mt-4">
          <a
            className="btn btn-primary rounded-5 px-5 py-3 fs-5 text-center d-flex align-items-center gap-2"
            href="https://twitter.com/share?ref_src=twsrc%5Etfw"
            data-show-count="false"
          >
            <img src="/x-logo-white.png" height={24} />
            シェアする
          </a>
        </div>

        <div
          className="hiddenContent"
          style={{ visibility: "hidden", position: "fixed" }}
        >
          <p suppressHydrationWarning={true}>{`${constellationName}座`}</p>

          {designs.map((design) => (
            <p key={design.name}>{design.name}</p>
          ))}
        </div>
      </section>

      <Script
        type="text/javascript"
        src="//typesquare.com/3/tsst/script/ja/typesquare.js?64fe9ab4c940489b8184031bac1e02d5"
        charset="utf-8"
      ></Script>
    </main>
  );
};

export default Result;
