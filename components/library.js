export const designs = [
  { name: "研究・調査", index: 0, x: 48, y: 14, caption: 3 },
  { name: "大学教育", index: 1, x: 54, y: 20, caption: 1 },
  { name: "高校教育", index: 2, x: 78, y: 18, caption: 1 },
  { name: "小・中学校教育", index: 3, x: 64, y: 26, caption: 3 },
  { name: "学生・生徒", index: 4, x: 76, y: 28, caption: 1 },
  { name: "行政・地方自治", index: 5, x: 36, y: 32, caption: 3 },
  { name: "報道", index: 6, x: 68, y: 30, caption: 2 },
  { name: "広告", index: 7, x: 77, y: 36, caption: 1 },
  { name: "経済・金融", index: 8, x: 90, y: 40, caption: 1 },
  { name: "印刷・紙メディア", index: 9, x: 36, y: 43, caption: 3 },
  { name: "映像メディア", index: 10, x: 50, y: 42, caption: 0 },
  { name: "音声メディア", index: 11, x: 30, y: 51, caption: 3 },
  { name: "流通・小売", index: 12, x: 83, y: 49, caption: 1 },
  { name: "IT・ソフトウェア", index: 13, x: 11, y: 57, caption: 0 },
  { name: "娯楽・エンターテインメント", index: 14, x: 25, y: 57, caption: 2 },
  { name: "観光・地域振興", index: 15, x: 65, y: 58, caption: 0 },
  { name: "通信", index: 16, x: 94, y: 58, caption: 0 },
  { name: "Web・SNS", index: 17, x: 4, y: 64, caption: 3 },
  { name: "介護", index: 18, x: 38, y: 66, caption: 3 },
  { name: "育児", index: 19, x: 56, y: 62, caption: 3 },
  { name: "主婦・主夫", index: 20, x: 75, y: 64, caption: 0 },
  { name: "スポーツ", index: 21, x: 95, y: 64, caption: 2 },
  { name: "図書館・文書館", index: 22, x: 13, y: 73, caption: 3 },
  { name: "ミュージアム", index: 23, x: 39, y: 79, caption: 0 },
  { name: "市民活動・運動", index: 24, x: 56, y: 73, caption: 3 },
  { name: "文筆業", index: 25, x: 74, y: 78, caption: 2 },
  { name: "編集", index: 26, x: 86, y: 79, caption: 1 },
  { name: "アート・表現", index: 27, x: 16, y: 82, caption: 3 },
  { name: "デザイン", index: 28, x: 35, y: 85, caption: 2 },
  { name: "哲学・思想", index: 29, x: 51, y: 82, caption: 2 },
  { name: "サイエンスコミュニケーション", index: 30, x: 60, y: 86, caption: 2 },
  { name: "起業・スタートアップ", index: 31, x: 10, y: 93, caption: 2 },
  { name: "フリーランス", index: 32, x: 75, y: 97, caption: 2 },
  { name: "無職", index: 33, x: 86, y: 91, caption: 2 },
  { name: "どれにもあてはまらない", index: 34, x: 95, y: 93, caption: 1 },
];

// .sort((a, b) => a.name.localeCompare(b.name));

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
