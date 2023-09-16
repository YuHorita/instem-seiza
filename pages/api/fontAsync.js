import { designs } from "../../components/library";
// designsの配列のnameをひとつの文字列にする
const text = designs.map((design) => design.name).join("");
export default async function handler() {
  //   const callbackId = Date.now();

  const callbackJson = function (params) {
    // const styleElement = document.createElement("style");
    // styleElement.setAttribute("type", "text/css");
    // styleElement.setAttribute("rel", "stylesheet");
    // const data = JSON.parse(params.data);
    // const data_object = JSON.parse(data.res);
    // styleElement.innerHTML =
    //   "@font-face {font-family: '" +
    //   data_object["fontFamily"] +
    //   "'; font-weight: " +
    //   data_object["font-weight"] +
    //   ";src: url(data:font/woff;base64," +
    //   data_object["src"] +
    //   ");}";
    // document.head.appendChild(styleElement);
  };

  Ts.loadFontAsync({
    cssName: "Gothic MB101 Bold",
    text: text,
    callback: callbackJson,
  });

  
}
