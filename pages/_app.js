import "../styles.css";
import "../scss/custom.scss";
import { DefaultSeo } from "next-seo";
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <DefaultSeo
        defaultTitle="デザイナーの星座を描こう | Designship 2023"
        description="あなたの星座を描いてみませんか？"
        openGraph={{
          type: "website",
          title: "デザイナーの星座を描こう | Designship 2023",
          description: "あなたの星座を描いてみませんか？",
          site_name: "デザイナーの星座を描こう | Designship 2023",
          url: "サイトのURL",
          // images: [
          //   {
          //     url: "https://www.example.ie/og-image-01.jpg",
          //     width: 800,
          //     height: 600,
          //     alt: "Og Image Alt",
          //     type: "image/jpeg",
          //   },
          // ],
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
