import "../styles.css";
import "../scss/custom.scss";
import { DefaultSeo } from "next-seo";
import Head from "next/head";
import Script from "next/script";

export default function MyApp({ Component, pageProps }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
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
        defaultTitle="みんなの星座を描こう"
        description="デザイナーの星座を描こう INSTeM Convention版"
        openGraph={{
          type: "website",
          title: "みんなの星座を描こう",
          description: "デザイナーの星座を描こう INSTeM Convention版",
          site_name: "みんなの星座を描こう",
          url: "サイトのURL",
          images: [
            {
              url: `${baseUrl}/default_ogp.png`,
              width: 1200,
              height: 630,
              type: "image/png",
            },
          ],
        }}
        twitter={{
          title: "みんなの星座を描こう",
          // handle: "@Designship_jp",
          // site: "@Designship_jp",
          cardType: "summary_large_image",
          card: "summary_large_image",
          // creator: "@Designship_jp",
          images: [`${baseUrl}/default_ogp.png`],
        }}
      />
      <Component {...pageProps} />
    </>
  );
}
