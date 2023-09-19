import "../styles.css";
import "../scss/custom.scss";
import { DefaultSeo } from "next-seo";
import Head from "next/head";
import Script from "next/script";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Script
        type="text/javascript"
        src="//typesquare.com/3/tsst/script/ja/typesquare.js?64fe9ab4c940489b8184031bac1e02d5"
        charset="utf-8"
      />
      <DefaultSeo
        defaultTitle="デザイナーの星座を描こう | Designship 2023"
        description="あなたの星座を描いてみませんか？"
        openGraph={{
          type: "website",
          title: "デザイナーの星座を描こう | Designship 2023",
          description: "あなたの星座を描いてみませんか？",
          site_name: "デザイナーの星座を描こう | Designship 2023",
          url: "サイトのURL",
        }}
        twitter={{
          handle: "@handle",
          site: "@site",
          cardType: "summary_large_image",
        }}
      />
      <Component {...pageProps} />
    </>
  );
}
