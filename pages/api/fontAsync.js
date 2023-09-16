import { designs } from "../../components/library";
// designsの配列のnameをひとつの文字列にする
const text = designs.map((design) => design.name).join("");
export default async function handler() {
  //   const callbackId = Date.now();

  const callbackJson = function (params) {
    console.log("たぶんロード完了");
    console.log("取得した単語:", text);
    console.log("返ってきたデータ:", params);
  };

  Ts.loadFontAsync({
    cssName: "Gothic MB101 Bold",
    text: text,
    callback: callbackJson,
  });
}
