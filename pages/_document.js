import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="text/javascript"
          src="//typesquare.com/3/tsst/script/ja/typesquare.js?60d03ddf9b2c47128bf96dcae90393a3"
          charSet="utf-8"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
