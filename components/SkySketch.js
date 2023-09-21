import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { designs } from "./library";
import supabase from "../pages/api/supabase";

const Sketch = () => {
  let canvas;
  const sketchRef = useRef(null);

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

        const r = 20,
          canvasWidth = 1920,
          canvasHeight = 1080,
          paddingX = 200,
          paddingY = 50,
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
          return paddingY + (y - itemYMin) * yRatio - r / 2;
        }
        function calcRadius(index) {
          const starCountArray = Object.values(starCount);
          const max = Math.max(...starCountArray);
          const min = Math.min(...starCountArray);
          const radius = 5 + ((starCount[index] - min) / (max - min)) * 65;
          return radius;
        }

        function calcLineWeight(index1, index2) {
          const lineCountArray = Object.values(lineCount);
          const max = Math.max(...lineCountArray);
          const min = 1;
          if (lineCount[index1 + "-" + index2] == 0) {
            return 0;
          }
          const weight =
            0.5 +
            ((lineCount[index1 + "-" + index2] - min) / (max - min)) * 9.5;
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
          p.image(bg, 0, 0, p.width, bg.height * (p.width / bg.width));
          pg.background(37, 39, 50);
          pg.erase();
          designs.forEach((elm) => {
            drawDesignStar(elm);
          });
          starLines.forEach((line) => {
            drawLine(line);
          });
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
          pg.ellipse(calcX(elm.x), calcY(elm.y), calcRadius(elm.index));
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
            p.translate(0, -calcRadius(elm.index) / 1.3 - 5);
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
