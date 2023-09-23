import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { designs } from "./library";
import supabase from "../pages/api/supabase";

const Sketch = () => {
  let canvas;
  const sketchRef = useRef(null);
  var starCountMax,
    starCountMin,
    lineCountMax,
    userNum,
    lineNum = 0;

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
      userNum = selectedDesignsArray.length;
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
      starLinesArray.forEach((elm) => {
        elm.star_lines.forEach((line) => {
          if (line[0] > line[1]) {
            lineCount[line[1] + "-" + line[0]] += 1;
          } else {
            lineCount[line[0] + "-" + line[1]] += 1;
          }
          lineNum += 1;
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
          const weight = (lineCount[index1 + "-" + index2] / lineCountMax) * 10;
          return weight;
        }

        p.preload = () => {
          bg = p.loadImage("/bg.png");
        };

        p.setup = () => {
          canvas = p.createCanvas(canvasWidth, canvasHeight);
          canvas.parent(sketchRef.current);
          p.textFont("Gothic MB101 Bold");
          pg = p.createGraphics(p.width, p.height);
        };

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

        // 線のアニメーションをバラバラに描画するために、starLines分の1~frameBasisのランダムなframeCountに加える値を用意
        const frameBasis = 500;
        const brakeBasis = 10000;
        let frameCountArray = [];

        for (var i = 0; i < starLines.length; i++) {
          frameCountArray.push(Math.floor(Math.random() * frameBasis));
        }

        let maxSize = 20; // 円の最大サイズ
        const easing = 0.01;

        p.draw = () => {
          p.image(bg, 0, 0, p.width, bg.height * (p.width / bg.width));
          pg.background(37, 39, 50);
          pg.erase();
          designs.forEach((elm) => {
            drawDesignStar(elm);
          });
          starLines.forEach((line, index) => {
            drawLine(line, index);
          });

          designs.forEach((elm, index) => {
            if (growingArray[index]) {
              circleSizeArray[index] +=
                (maxSize - circleSizeArray[index]) * easing; // 拡大
              if (maxSize - circleSizeArray[index] < 1) {
                growingArray[index] = false; // 最大サイズに達したら縮小へ
              }
            } else {
              circleSizeArray[index] -= circleSizeArray[index] * easing; // 縮小
              if (circleSizeArray[index] < 1) {
                growingArray[index] = true; // 最小サイズに達したら拡大へ
              }
            }
          });

          pg.noErase();
          p.image(pg, 0, 0);
          designs.forEach((elm) => {
            drawCaption(elm);
          });

          p.push();
          p.fill(255);

          p.textSize(32);
          p.textAlign(p.LEFT, p.CENTER);
          p.text("つくられた\n星座の数", 80, 130);
          p.text("繋がれた\n星の数", 80, 260);

          p.textSize(80);
          p.textAlign(p.RIGHT, p.CENTER);
          p.text(userNum + "個", 200 + String(lineNum).length * 100, 130);
          p.text(lineNum + "本", 200 + String(lineNum).length * 100, 260);
          p.pop();
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

        function drawLine(line, index) {
          pg.push();
          pg.stroke(255);
          pg.strokeWeight(calcLineWeight(line[0], line[1]));
          pg.noFill();
          const elm1 = designs.filter((elm) => elm.index === line[0])[0];
          const elm2 = designs.filter((elm) => elm.index === line[1])[0];

          const d = p.dist(
            calcX(elm1.x),
            calcY(elm1.y),
            calcX(elm2.x),
            calcY(elm2.y)
          );

          const frameValue1 =
            ((p.frameCount + frameCountArray[index]) % frameBasis) / frameBasis;

          const frameValue2 =
            ((p.frameCount + frameCountArray[index] + brakeBasis / d) %
              frameBasis) /
            frameBasis;

          const frameValue3 =
            ((p.frameCount + frameCountArray[index] + frameBasis / 2) %
              frameBasis) /
            frameBasis;

          const frameValue4 =
            ((p.frameCount +
              frameCountArray[index] +
              frameBasis / 2 +
              brakeBasis / d) %
              frameBasis) /
            frameBasis;

          if (frameValue1 < frameValue4) {
            pg.line(
              calcX(elm1.x),
              calcY(elm1.y),
              calcX(elm1.x) + frameValue1 * (calcX(elm2.x) - calcX(elm1.x)),
              calcY(elm1.y) + frameValue1 * (calcY(elm2.y) - calcY(elm1.y))
            );

            pg.line(
              calcX(elm1.x) + frameValue2 * (calcX(elm2.x) - calcX(elm1.x)),
              calcY(elm1.y) + frameValue2 * (calcY(elm2.y) - calcY(elm1.y)),
              calcX(elm1.x) + frameValue3 * (calcX(elm2.x) - calcX(elm1.x)),
              calcY(elm1.y) + frameValue3 * (calcY(elm2.y) - calcY(elm1.y))
            );

            pg.line(
              calcX(elm1.x) + frameValue4 * (calcX(elm2.x) - calcX(elm1.x)),
              calcY(elm1.y) + frameValue4 * (calcY(elm2.y) - calcY(elm1.y)),
              calcX(elm2.x),
              calcY(elm2.y)
            );
          } else if (frameValue3 < frameValue2) {
            pg.line(
              calcX(elm1.x),
              calcY(elm1.y),
              calcX(elm1.x) + frameValue3 * (calcX(elm2.x) - calcX(elm1.x)),
              calcY(elm1.y) + frameValue3 * (calcY(elm2.y) - calcY(elm1.y))
            );

            pg.line(
              calcX(elm1.x) + frameValue4 * (calcX(elm2.x) - calcX(elm1.x)),
              calcY(elm1.y) + frameValue4 * (calcY(elm2.y) - calcY(elm1.y)),
              calcX(elm1.x) + frameValue1 * (calcX(elm2.x) - calcX(elm1.x)),
              calcY(elm1.y) + frameValue1 * (calcY(elm2.y) - calcY(elm1.y))
            );

            pg.line(
              calcX(elm1.x) + frameValue2 * (calcX(elm2.x) - calcX(elm1.x)),
              calcY(elm1.y) + frameValue2 * (calcY(elm2.y) - calcY(elm1.y)),
              calcX(elm2.x),
              calcY(elm2.y)
            );
          } else if (frameValue1 < frameValue2) {
            pg.line(
              calcX(elm1.x),
              calcY(elm1.y),
              calcX(elm1.x) + frameValue1 * (calcX(elm2.x) - calcX(elm1.x)),
              calcY(elm1.y) + frameValue1 * (calcY(elm2.y) - calcY(elm1.y))
            );
            pg.line(
              calcX(elm1.x) + frameValue2 * (calcX(elm2.x) - calcX(elm1.x)),
              calcY(elm1.y) + frameValue2 * (calcY(elm2.y) - calcY(elm1.y)),
              calcX(elm2.x),
              calcY(elm2.y)
            );
          } else if (frameValue3 < frameValue4) {
            pg.line(
              calcX(elm1.x),
              calcY(elm1.y),
              calcX(elm1.x) + frameValue3 * (calcX(elm2.x) - calcX(elm1.x)),
              calcY(elm1.y) + frameValue3 * (calcY(elm2.y) - calcY(elm1.y))
            );
            pg.line(
              calcX(elm1.x) + frameValue4 * (calcX(elm2.x) - calcX(elm1.x)),
              calcY(elm1.y) + frameValue4 * (calcY(elm2.y) - calcY(elm1.y)),
              calcX(elm2.x),
              calcY(elm2.y)
            );
          }

          pg.pop();
        }

        function drawCaption(elm) {
          p.push();
          p.fill(255, 255, 255);
          p.textSize(20 + calcRadius(elm.index) / 2);
          p.textLeading(100);
          p.noStroke();

          if (elm.caption === 0) {
            p.textAlign(p.CENTER, p.CENTER);
            p.translate(0, -calcRadius(elm.index) / 1.3 - 14);
          } else if (elm.caption === 1) {
            p.textAlign(p.LEFT, p.CENTER);
            p.translate(
              calcRadius(elm.index) / 1.8 + 10,
              calcRadius(elm.index) / 12
            );
          } else if (elm.caption === 2) {
            p.textAlign(p.CENTER, p.CENTER);
            p.translate(0, calcRadius(elm.index) / 1.3 + 24);
          } else if (elm.caption === 3) {
            p.textAlign(p.RIGHT, p.CENTER);
            p.translate(
              -calcRadius(elm.index) / 1.8 - 10,
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
