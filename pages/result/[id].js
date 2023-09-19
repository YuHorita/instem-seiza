import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { designs } from "../../components/library";
import Script from "next/script";
import supabase from "../api/supabase";
import { usePathname } from "next/navigation";
import { NextSeo } from "next-seo";

const SketchComponent = dynamic(() => import("../../components/ResultSketch"), {
  loading: () => <div>Loading SketchComponent...</div>,
  ssr: false,
});

export default function Page({ id, designerName, constellationName }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const pathname = usePathname();
  const [canvasImage, setCanvasImage] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const title = `${designerName}さんの星座 | Designship 2023`;
  const description = `${constellationName}座を見つけました！`;
  const ogpImage = `${baseUrl}/api/og?id=${id}`;

  const handleCanvasSave = async (imageData) => {
    setCanvasImage(imageData);
  };

  const copyToClipboard = () => {
    const url = baseUrl + pathname;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
        setIsCopied(true);

        setTimeout(() => {
          setIsCopied(false);
        }, 2000); // 例: 2秒後にfalseに戻す
      });
    }
  };

  return (
    <main className="bg-body text-body">
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title: title,
          description: description,
          images: [
            {
              url: ogpImage,
              alt: description,
              width: 1200,
              height: 630,
              type: "image/png",
            },
          ],
        }}
        twitter={{
          card: "summary_large_image",
          title: title,
          description: description,
          creator: "@Designship_jp",
          images: [ogpImage],
        }}
      />

      <section className="container-sm p-4">
        <p style={{ display: "none" }}>ID:{id}</p>
        <div className="text-center mb-4">
          <h2
            suppressHydrationWarning={true}
            id="designerNameHolder"
            className="fw-bold"
          >
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

        <div className="mt-4 d-flex flex-column align-items-center justify-content-center gap-3">
          <a
            className="btn btn-primary rounded-5 w-75 py-3 fs-5 text-center d-flex align-items-center justify-content-center gap-2 fw-bold"
            href={`https://twitter.com/intent/tweet?url=${baseUrl}${pathname}%0a&hashtags=Designship2023,デザイナーの星座を描こう`}
            target="_blank"
          >
            <img src="/x-logo-white.png" height={24} />
            シェアする
          </a>

          <btn
            type="button"
            className="btn btn-light rounded-5 w-75 py-3 fs-5 text-center text-primary fw-bold"
            onClick={copyToClipboard}
          >
            リンクをコピーする
          </btn>
        </div>

        <div className="balloon2 d-flex flex-column align-items-center gap-2 bg-body-secondary">
          <h6
            className="text-center bg-primary d-inline-block rounded-2"
            style={{ padding: "0.8rem 1.4rem" }}
          >
            こんなことも考えてみませんか？
          </h6>
          <p className="m-0 fw-normal">
            あなたとデザインの出会いはどのようでしたか？デザインをしていてどんな喜びを感じますか？星座と一緒にデザイナーとしてのあなたの物語も共有してみましょう。
          </p>
        </div>

        <div
          className={`fixed-bottom  p-3 text-center copied-text ${
            isCopied ? "fade-in" : "fade-out"
          }`}
        >
          <div className="bg-white text-black p-3 rounded-3">
            クリップボードにリンクをコピーしました
          </div>
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
    </main>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.id;
  var designerName = "";
  var constellationName = "";

  try {
    const { data: design_constellation, error } = await supabase
      .from("design_constellation")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      throw error;
    }
    designerName = design_constellation.designer_name;
    constellationName = design_constellation.constellation_name;
  } catch (error) {
    console.error("データの取得に失敗しました", error);
    // トップページにリダイレクト
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      id,
      designerName,
      constellationName,
    },
  };
}
