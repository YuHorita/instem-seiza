export const designs = [
  { name: "ジュエリーデザイン", x: 48, y: 14, caption: 0 },
  { name: "国家", x: 54, y: 20, caption: 1 },
  { name: "ビジョンデザイン", x: 78, y: 18, caption: 1 },
  { name: "DTPデザイン", x: 64, y: 26, caption: 3 },
  { name: "カーデザイン", x: 76, y: 28, caption: 1 },
  { name: "UIデザイン", x: 36, y: 32, caption: 3 },
  { name: "Co-Design", x: 68, y: 30, caption: 3 },
  { name: "組織デザイン", x: 77, y: 36, caption: 1 },
  { name: "Futures Design", x: 90, y: 40, caption: 1 },
  { name: "デジタルプロダクトデザイン", x: 36, y: 43, caption: 3 },
  { name: "AI", x: 50, y: 42, caption: 0 },
  { name: "行動経済学", x: 30, y: 51, caption: 3 },
  { name: "歴史", x: 83, y: 49, caption: 1 },
  { name: "ソーシャルデザイン", x: 11, y: 57, caption: 3 },
  { name: "書体デザイン", x: 25, y: 57, caption: 1 },
  { name: "ウェブデザイン", x: 65, y: 58, caption: 0 },
  { name: "家具デザイン", x: 94, y: 58, caption: 1 },
  { name: "ロゴデザイン", x: 4, y: 64, caption: 3 },
  { name: "インダストリアルデザイン", x: 38, y: 66, caption: 3 },
  { name: "Web3", x: 56, y: 62, caption: 3 },
  { name: "エシカルデザイン", x: 75, y: 64, caption: 2 },
  { name: "インクルーシブデザイン", x: 95, y: 64, caption: 0 },
  { name: "ブランドデザイン", x: 13, y: 73, caption: 3 },
  { name: "グラフィックデザイン", x: 39, y: 79, caption: 2 },
  { name: "人類学", x: 56, y: 73, caption: 3 },
  { name: "デザインリサーチ", x: 74, y: 78, caption: 2 },
  { name: "UXデザイン", x: 86, y: 79, caption: 1 },
  { name: "社会学", x: 16, y: 82, caption: 3 },
  { name: "エディトリアルデザイン", x: 35, y: 85, caption: 2 },
  { name: "サービスデザイン", x: 51, y: 82, caption: 2 },
  { name: "デザインエンジニアリング", x: 60, y: 86, caption: 2 },
  { name: "ビジネスデザイン", x: 10, y: 93, caption: 2 },
  { name: "行政デザイン", x: 75, y: 90, caption: 2 },
  { name: "モーションデザイン", x: 86, y: 91, caption: 1 },
  { name: "パッケージデザイン", x: 95, y: 93, caption: 2 },
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
