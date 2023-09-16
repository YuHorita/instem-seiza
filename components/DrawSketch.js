import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { designs } from "./library";

const Sketch = () => {
  const sketchRef = useRef(null);
  var selectedDesigns = [];

  try {
    selectedDesigns = JSON.parse(localStorage.getItem("selectedDesigns"));
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    const importText = designs.map((design) => design.name).join("");
    const callbackJson = function (params) {
      console.log("たぶんロード完了");
      console.log("取得した単語:", importText);
      console.log("返ってきたデータ:", params);

      const sketch = new p5((p) => {
        console.log("sketch start");
        const filteredDesigns = designs.filter((design) =>
          selectedDesigns.includes(design.index)
        );

        function convertRemToPx(rem) {
          var fontSize = getComputedStyle(document.documentElement).fontSize;
          return rem * parseFloat(fontSize);
        }

        var nowSelecting = null;
        var starLines = [];
        localStorage.setItem("starLines", JSON.stringify(starLines));

        let bg, pg;

        const r = 20,
          canvasWidth = p.windowWidth - convertRemToPx(3.0),
          canvasHeight = parseInt(canvasWidth * 0.7),
          paddingX = 100,
          paddingY = 30,
          areaXMin = paddingX,
          areaXMax = canvasWidth - paddingX,
          areaYMin = paddingY,
          areaYMax = canvasHeight - paddingY - r * 1.3,
          areaWidth = areaXMax - areaXMin,
          areaHeight = areaYMax - areaYMin,
          itemXMin = filteredDesigns.sort((a, b) => a.x - b.x)[0].x,
          itemXMax = filteredDesigns.sort((a, b) => b.x - a.x)[0].x,
          itemYMin = filteredDesigns.sort((a, b) => a.y - b.y)[0].y,
          itemYMax = filteredDesigns.sort((a, b) => b.y - a.y)[0].y,
          itemWidth = itemXMax - itemXMin,
          itemHeight = itemYMax - itemYMin,
          xRatio = areaWidth / itemWidth,
          yRatio = areaHeight / itemHeight;

        function calcX(x) {
          if (filteredDesigns.length == 1) {
            return canvasWidth / 2;
          } else {
            return areaXMin + (x - itemXMin) * xRatio;
          }
        }
        function calcY(y) {
          if (filteredDesigns.length == 1) {
            return canvasHeight / 2;
          } else {
            return areaYMin + (y - itemYMin) * yRatio;
          }
        }

        p.preload = () => {
          bg = p.loadImage("bg_portrait.png");
        };

        p.setup = () => {
          const canvas = p.createCanvas(canvasWidth, canvasHeight);
          canvas.parent(sketchRef.current);
          pg = p.createGraphics(p.width, p.height);
          p.textFont("Gothic MB101 Bold JIS2004");
        };

        p.draw = () => {
          p.image(bg, 0, 0, p.width, bg.height * (p.width / bg.width));
          pg.background(37, 39, 50);
          pg.erase();
          filteredDesigns.forEach((elm) => {
            drawDesignStar(elm);
          });
          starLines.forEach((line) => {
            drawLine(line);
          });
          pg.noErase();
          p.image(pg, 0, 0);
          filteredDesigns.forEach((elm) => {
            drawCaption(elm);
          });
        };

        p.mouseClicked = () => {
          if (filteredDesigns.length > 1) {
            filteredDesigns.forEach((elm) => {
              createConstellation(elm);
            });
          }
        };

        function drawDesignStar(elm) {
          pg.push();
          pg.fill(255);
          pg.noStroke();

          pg.ellipse(calcX(elm.x), calcY(elm.y), r);

          if (nowSelecting === elm) {
            pg.noFill();
            pg.stroke(255);
            pg.strokeWeight(1);
            pg.ellipse(
              calcX(elm.x),
              calcY(elm.y),
              r + 10 + p.sin(p.frameCount / 20) * 5
            );
          }

          pg.pop();
        }

        function drawLine(line) {
          pg.push();
          pg.stroke(255);
          pg.strokeWeight(1);
          pg.noFill();
          const elm1 = filteredDesigns.filter(
            (elm) => elm.index === line[0]
          )[0];
          const elm2 = filteredDesigns.filter(
            (elm) => elm.index === line[1]
          )[0];
          pg.line(calcX(elm1.x), calcY(elm1.y), calcX(elm2.x), calcY(elm2.y));
          pg.pop();
        }

        function drawCaption(elm) {
          p.push();
          p.fill(255, 255, 255);
          p.textSize(12);
          // p.textStyle(p.BOLD);
          p.textLeading(100);
          p.noStroke();
          if (elm.caption === 0) {
            p.textAlign(p.CENTER, p.CENTER);
            p.translate(calcX(elm.x), calcY(elm.y) - r);
          } else if (elm.caption === 1) {
            p.textAlign(p.LEFT, p.CENTER);
            p.translate(calcX(elm.x) + r * 0.7, calcY(elm.y) - 3);
          } else if (elm.caption === 2) {
            p.textAlign(p.CENTER, p.CENTER);
            p.translate(calcX(elm.x), calcY(elm.y) + r - 3);
          } else if (elm.caption === 3) {
            p.textAlign(p.RIGHT, p.CENTER);
            p.translate(calcX(elm.x) - r * 0.7, calcY(elm.y) - 3);
          }
          p.text(elm.name, 0, 0);
          p.pop();

          // let caption = p.createP(elm.name);
          // if (elm.caption === 0) {
          //   caption.position(calcX(elm.x), calcY(elm.y) - r);
          //   caption.style("text-align", "center");
          // } else if (elm.caption === 1) {
          //   caption.position(calcX(elm.x) + r * 0.7, calcY(elm.y) - 3);
          //   caption.style("text-align", "left");
          // } else if (elm.caption === 2) {
          //   caption.position(calcX(elm.x), calcY(elm.y) + r - 3);
          //   caption.style("text-align", "center");
          // } else if (elm.caption === 3) {
          //   caption.position(calcX(elm.x) - r * 0.7, calcY(elm.y) - 3);
          //   caption.style("text-align", "right");
          // }
        }

        function createConstellation(elm) {
          let distance = p.dist(p.mouseX, p.mouseY, calcX(elm.x), calcY(elm.y));
          if (distance < r) {
            if (nowSelecting === null) {
              nowSelecting = elm;
            } else if (nowSelecting === elm) {
              nowSelecting = null;
            } else {
              let isExist = false;
              let existingNum;
              for (let j = 0; j < starLines.length; j++) {
                if (
                  (starLines[j][0] === nowSelecting.index &&
                    starLines[j][1] === elm.index) ||
                  (starLines[j][0] === elm.index &&
                    starLines[j][1] === nowSelecting.index)
                ) {
                  isExist = true;
                  existingNum = j;
                  break;
                }
              }
              if (!isExist) {
                starLines.push([nowSelecting.index, elm.index]);
              } else {
                starLines.splice(existingNum, 1);
              }
              localStorage.setItem("starLines", JSON.stringify(starLines));
              nowSelecting = null;
            }
          }
        }
      });

      return () => {
        sketch.remove();
      };
    };
    Ts.loadFontAsync({
      cssName: "Gothic MB101 Bold JIS2004",
      text: importText,
      callback: callbackJson,
    });
  }, []);

  Ts.loadFont();
  return <div ref={sketchRef}></div>;
};

export default Sketch;
