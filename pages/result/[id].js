import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { designs } from "../../components/library";
import Script from "next/script";
import supabase from "../api/supabase";
import { usePathname } from "next/navigation";

const SketchComponent = dynamic(() => import("../../components/ResultSketch"), {
  loading: () => <div>Loading SketchComponent...</div>,
  ssr: false,
});

const Result = () => {
  const router = useRouter();
  const { id } = router.query;
  const pathname = usePathname();
  const [canvasImage, setCanvasImage] = useState(null);
  const [designerName, setDesignerName] = useState("");
  const [constellationName, setConstellationName] = useState("");
  const [isCopied, setIsCopied] = useState(false);

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
      setDesignerName(design_constellation.designer_name);
      setConstellationName(design_constellation.constellation_name);
    } catch (error) {
      console.error("データの取得に失敗しました", error);
    }
  };

  useEffect(() => {
    if (id) {
      getData(id);
    }
  }, [id]);

  const copyToClipboard = () => {
    console.log(pathname);
    const url = `https://visual-thinking.design-ship.jp${pathname}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
        setIsCopied(true);
      });
    }
  };

  return (
    <main className="bg-body text-body">
      <section className="container-sm p-4">
        <p style={{ fontSize: "0.8rem" }}>ID:{id}</p>
        <div className="text-center mb-4">
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

        <div className="mt-4 d-flex flex-column align-items-center justify-content-center ">
          <a
            className="btn btn-primary rounded-5 w-75 py-3 fs-5 mb-4 text-center d-flex align-items-center justify-content-center gap-2"
            href="https://twitter.com/share?ref_src=twsrc%5Etfw"
            data-show-count="false"
          >
            <img src="/x-logo-white.png" height={24} />
            シェアする
          </a>

          <btn
            type="button"
            className="btn btn-light rounded-5 w-75 py-3 fs-5 mb-2 text-center text-primary"
            onClick={copyToClipboard}
          >
            リンクをコピーする
          </btn>
          <p id="copy-message" style={{ fontSize: "0.8rem" }}>
            {isCopied && "クリップボードにコピーしました！"}
          </p>
        </div>

        <div className="balloon2 d-flex flex-column align-items-center gap-2 bg-body-secondary">
          <h6 className="text-center bg-primary px-3 py-2 d-inline-block">
            こんなことも考えてみませんか？
          </h6>
          <p className="m-0">
            あなたとデザインの出会いはどのようでしたか？デザインをしていてどんな喜びを感じますか？星座と一緒にデザイナーとしてのあなたの物語も共有してみましょう。
          </p>
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
