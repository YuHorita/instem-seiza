import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { designs } from "./library";
import supabase from "../pages/api/supabase";

const Sketch = () => {
  let canvas;
  const sketchRef = useRef(null);
  var starCountMax, starCountMin, lineCountMax, lineCountMin;

  var starCount = {};
  for (var i = 0; i <= designs.length; i++) {
    starCount[i] = 0;
  }

  var starLines = [];
  for (var i = 0; i < designs.length; i++) {
    for (var j = i; j < designs.length; j++) {
      if (i != j) {
        starLines.push([i, j]);
      }
    }
  }

  var lineCount = {};
  for (var i = 0; i < designs.length; i++) {
    for (var j = i; j < designs.length; j++) {
      if (i != j) {
        lineCount[i + "-" + j] = 0;
      }
    }
  }

  const getData = async () => {
    try {
      let { data: selectedDesignsArray, error } = await supabase
        .from("design_constellation")
        .select("selected_designs");
      selectedDesignsArray.forEach((elm) => {
        elm.selected_designs.forEach((design) => {
          starCount[design] += 1;
        });
      });
      starCountMax = Math.max(...Object.values(starCount));
      starCountMin = Math.min(...Object.values(starCount));
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("selectedDesignsの取得に失敗", error);
    }

    try {
      let { data: starLinesArray, error } = await supabase
        .from("design_constellation")
        .select("star_lines");
      // [1,2]と[2,1]のように、向きが逆の線は、[小,大]の順に統一してからカウントする
      starLinesArray.forEach((elm) => {
        elm.star_lines.forEach((line) => {
          if (line[0] > line[1]) {
            lineCount[line[1] + "-" + line[0]] += 1;
          } else {
            lineCount[line[0] + "-" + line[1]] += 1;
          }
        });
      });
      lineCountMax = Math.max(...Object.values(lineCount));
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("starLinesの取得に失敗", error);
    }
  };

  useEffect(() => {
    (async () => {
      await getData();
      Ts.loadFont();

      const sketch = new p5((p) => {
        let bg, pg;

        const canvasWidth = 3840,
          canvasHeight = 2160,
          paddingX = 400,
          paddingY = 100,
          areaWidth = canvasWidth - paddingX * 2,
          areaHeight = canvasHeight - paddingY * 2,
          itemXMin = designs.sort((a, b) => a.x - b.x)[0].x,
          itemXMax = designs.sort((a, b) => b.x - a.x)[0].x,
          itemYMin = designs.sort((a, b) => a.y - b.y)[0].y,
          itemYMax = designs.sort((a, b) => b.y - a.y)[0].y,
          itemWidth = itemXMax - itemXMin,
          itemHeight = itemYMax - itemYMin,
          xRatio = areaWidth / itemWidth,
          yRatio = areaHeight / itemHeight;

        function calcX(x) {
          return paddingX + (x - itemXMin) * xRatio;
        }
        function calcY(y) {
          return paddingY + (y - itemYMin) * yRatio;
        }
        function calcRadius(index) {
          const radius =
            ((starCount[index] - starCountMin) /
              (starCountMax - starCountMin)) *
            80;
          return radius;
        }

        function calcLineWeight(index1, index2) {
          if (lineCount[index1 + "-" + index2] == 0) {
            return 0;
          }
          const weight =
            1 +
            ((lineCount[index1 + "-" + index2] - 1) / (lineCountMax - 1)) * 10;
          return weight;
        }

        p.preload = () => {
          bg = p.loadImage("/bg_portrait.png");
        };

        p.setup = () => {
          canvas = p.createCanvas(canvasWidth, canvasHeight);
          canvas.parent(sketchRef.current);
          p.textFont("Gothic MB101 Bold");
          pg = p.createGraphics(p.width, p.height);
        };

        var sampleLineX = 0,
          sampleLineY = 0,
          sampleLineX2 = 0;
        const easing1 = 0.05;
        const easing2 = 0.08;

        // designs分のcircleSize, growing, maxSizeを用意
        let circleSizeArray = [];
        let growingArray = [];
        let maxSizeArray = [];
        for (var i = 0; i < designs.length; i++) {
          // 円の初期サイズは0~20のランダム
          circleSizeArray.push(p.random(0, 20));
          // trueかfalseをランダムに格納
          growingArray.push(Math.floor(Math.random() * 2) == 0 ? true : false);
          // calcRadiusの1.5倍の値を最大サイズとする
          maxSizeArray.push(calcRadius(designs.index) * 1.5);
        }

        let circleSize = 10; // 円の初期サイズ
        let maxSize = 20; // 円の最大サイズ
        let growing = true; // 拡大中かどうかのフラグ

        p.draw = () => {
          p.image(bg, 0, 0, p.width, bg.height * (p.width / bg.width));
          pg.background(37, 39, 50);
          pg.erase();
          designs.forEach((elm) => {
            drawDesignStar(elm);
          });
          starLines.forEach((line) => {
            drawLine(line);
          });

          // p.push();
          // pg.strokeWeight(3);
          // const dx = 800 - sampleLineX;
          // let dx2 = 0;
          // if (dx < 200) {
          //   dx2 = sampleLineX - sampleLineX2;
          // }
          // if (dx < 1 && dx2 < 100) {
          //   sampleLineX = 0;
          //   sampleLineX2 = 0;
          // }

          // const vx = dx * easing1;
          // const vx2 = dx2 * easing2;
          // sampleLineX += vx;
          // sampleLineX2 += vx2;
          // pg.line(sampleLineX2, 200, sampleLineX, 200);

          // p.pop();

          // ランダムな位置に星を描画
          // pg.push();
          // pg.fill(255);
          // pg.noStroke();
          // pg.ellipse(
          //   p.random(0, p.width),
          //   p.random(0, p.height),
          //   p.random(10, 50)
          // );
          // pg.pop();

          // 拡大縮小のアニメーション
          if (growing) {
            circleSize += 0.2; // 拡大
            if (circleSize >= maxSize) {
              growing = false; // 最大サイズに達したら縮小へ
            }
          } else {
            circleSize -= 0.2; // 縮小
            if (circleSize < 1) {
              growing = true; // 最小サイズに達したら拡大へ
            }
          }

          // 上記のコードをdesigns分繰り返す
          designs.forEach((elm, index) => {
            if (growingArray[index]) {
              circleSizeArray[index] +=
                (maxSize - circleSizeArray[index]) * easing1; // 拡大
              if (maxSize - circleSizeArray[index] < 1) {
                growingArray[index] = false; // 最大サイズに達したら縮小へ
              }
            } else {
              circleSizeArray[index] -= circleSizeArray[index] * easing1; // 縮小
              if (circleSizeArray[index] < 1) {
                growingArray[index] = true; // 最小サイズに達したら拡大へ
              }
            }
          });

          // 円を描画
          pg.ellipse(p.width / 2, p.height / 2, circleSize);

          pg.noErase();
          p.image(pg, 0, 0);
          designs.forEach((elm) => {
            drawCaption(elm);
          });
        };

        function drawDesignStar(elm) {
          pg.push();
          pg.fill(255);
          pg.noStroke();
          pg.ellipse(
            calcX(elm.x),
            calcY(elm.y),
            calcRadius(elm.index) + circleSizeArray[elm.index]
          );
          pg.pop();
        }

        function drawLine(line) {
          pg.push();
          pg.stroke(255);
          pg.strokeWeight(calcLineWeight(line[0], line[1]));
          pg.noFill();
          const elm1 = designs.filter((elm) => elm.index === line[0])[0];
          const elm2 = designs.filter((elm) => elm.index === line[1])[0];
          pg.line(calcX(elm1.x), calcY(elm1.y), calcX(elm2.x), calcY(elm2.y));
          pg.pop();
        }

        function drawCaption(elm) {
          p.push();
          p.fill(255, 255, 255);
          p.textSize(10 + calcRadius(elm.index) / 3);
          p.textLeading(100);
          p.noStroke();

          if (elm.caption === 0) {
            p.textAlign(p.CENTER, p.CENTER);
            p.translate(0, -calcRadius(elm.index) / 1.3 - 7);
          } else if (elm.caption === 1) {
            p.textAlign(p.LEFT, p.CENTER);
            p.translate(
              calcRadius(elm.index) / 1.8 + 5,
              calcRadius(elm.index) / 12
            );
          } else if (elm.caption === 2) {
            p.textAlign(p.CENTER, p.CENTER);
            p.translate(0, calcRadius(elm.index) / 1.3 + 10);
          } else if (elm.caption === 3) {
            p.textAlign(p.RIGHT, p.CENTER);
            p.translate(
              -calcRadius(elm.index) / 1.8 - 5,
              calcRadius(elm.index) / 12
            );
          }
          p.translate(calcX(elm.x), calcY(elm.y));

          p.text(elm.name, 0, 0);
          p.pop();
        }
      });

      return () => {
        sketch.remove();
      };
    })();
  }, []);
  return <div ref={sketchRef}></div>;
};

export default Sketch;
