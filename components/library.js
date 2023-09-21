export const designs = [
  { name: "ジュエリーデザイン", index: 0, x: 48, y: 14, caption: 3 },
  { name: "国家", index: 1, x: 54, y: 20, caption: 1 },
  { name: "ビジョンデザイン", index: 2, x: 78, y: 18, caption: 1 },
  { name: "DTPデザイン", index: 3, x: 64, y: 26, caption: 3 },
  { name: "カーデザイン", index: 4, x: 76, y: 28, caption: 1 },
  { name: "UIデザイン", index: 5, x: 36, y: 32, caption: 3 },
  { name: "Co-Design", index: 6, x: 68, y: 30, caption: 2 },
  { name: "組織デザイン", index: 7, x: 77, y: 36, caption: 1 },
  { name: "Futures Design", index: 8, x: 90, y: 40, caption: 1 },
  { name: "デジタルプロダクトデザイン", index: 9, x: 36, y: 43, caption: 3 },
  { name: "AI", index: 10, x: 50, y: 42, caption: 0 },
  { name: "行動経済学", index: 11, x: 30, y: 51, caption: 3 },
  { name: "歴史", index: 12, x: 83, y: 49, caption: 1 },
  { name: "ソーシャルデザイン", index: 13, x: 11, y: 57, caption: 0 },
  { name: "書体デザイン", index: 14, x: 25, y: 57, caption: 2 },
  { name: "ウェブデザイン", index: 15, x: 65, y: 58, caption: 0 },
  { name: "家具デザイン", index: 16, x: 94, y: 58, caption: 0 },
  { name: "ロゴデザイン", index: 17, x: 4, y: 64, caption: 3 },
  { name: "インダストリアルデザイン", index: 18, x: 38, y: 66, caption: 3 },
  { name: "Web3", index: 19, x: 56, y: 62, caption: 3 },
  { name: "エシカルデザイン", index: 20, x: 75, y: 64, caption: 0 },
  { name: "インクルーシブデザイン", index: 21, x: 95, y: 64, caption: 2 },
  { name: "ブランドデザイン", index: 22, x: 13, y: 73, caption: 3 },
  { name: "グラフィックデザイン", index: 23, x: 39, y: 79, caption: 0 },
  { name: "人類学", index: 24, x: 56, y: 73, caption: 3 },
  { name: "デザインリサーチ", index: 25, x: 74, y: 78, caption: 2 },
  { name: "UXデザイン", index: 26, x: 86, y: 79, caption: 1 },
  { name: "社会学", index: 27, x: 16, y: 82, caption: 3 },
  { name: "エディトリアルデザイン", index: 28, x: 35, y: 85, caption: 2 },
  { name: "サービスデザイン", index: 29, x: 51, y: 82, caption: 2 },
  { name: "デザインエンジニアリング", index: 30, x: 60, y: 86, caption: 2 },
  { name: "ビジネスデザイン", index: 31, x: 10, y: 93, caption: 2 },
  { name: "行政デザイン", index: 32, x: 75, y: 97, caption: 2 },
  { name: "モーションデザイン", index: 33, x: 86, y: 91, caption: 2 },
  { name: "パッケージデザイン", index: 34, x: 95, y: 93, caption: 1 },
  { name: "建築", index: 35, x: 20, y: 30, caption: 0 },
  { name: "XR", index: 36, x: 93, y: 28, caption: 0 },
  { name: "ファシリテーション", index: 37, x: 11, y: 34, caption: 3 },
  { name: "コミュニティデザイン", index: 38, x: 15, y: 40, caption: 3 },
  { name: "空間デザイン", index: 39, x: 60, y: 45, caption: 2 },
  { name: "ブックデザイン", index: 40, x: 71, y: 50, caption: 0 },
  { name: "ランドスケープデザイン", index: 41, x: 46, y: 98, caption: 2 },
].sort((a, b) => a.name.localeCompare(b.name));

export class DesignStar {
  constructor(name, x, y, isDisplayed, captionPos) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.isSelected = false;
    this.isDisplayed = isDisplayed;
    this.captionPos = captionPos;
  }
}
