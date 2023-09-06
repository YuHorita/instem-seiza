import fs from "fs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const newData = {
        id: Date.now(),
        designerName: req.body.designerName,
        selectedStars: req.body.selectedStars,
        starName: req.body.starName,
        starLines: req.body.starLines,
      };

      // 現在のデータを読み込み
      const data = JSON.parse(fs.readFileSync("./data.json", "utf8"));

      // 新しいデータをデータ配列に追加
      data.push(newData);

      // データを JSON ファイルに書き込み
      fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));

      res.status(201).json(newData); // 新しいデータを返す
    } catch (error) {
      console.error("データの追加エラー:", error);
      res.status(500).json({ error: "データの追加中にエラーが発生しました" });
    }
  } else {
    res.status(405).end(); // POST リクエスト以外は許可しない
  }
}
