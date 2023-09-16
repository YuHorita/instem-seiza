import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cherry+Bomb+One&family=M+PLUS+1p:wght@700&display=swap"
          rel="stylesheet"
        /> */}
        <script
          type="text/javascript"
          src="//typesquare.com/3/tsst/script/ja/typesquare.js?64fe9ab4c940489b8184031bac1e02d5&auto_load_font=true"
          charset="utf-8"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
