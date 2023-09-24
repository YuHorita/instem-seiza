import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { designs } from "./library";

const Sketch = () => {
  let canvas;
  const sketchRef = useRef(null);
  var selectedDesigns = [];

  try {
    selectedDesigns = JSON.parse(localStorage.getItem("selectedDesigns"));
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
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

      var r = 10 + 40 / filteredDesigns.length,
        canvasWidth =
          p.windowWidth < 600 + convertRemToPx(3.0)
            ? p.windowWidth - convertRemToPx(3.0)
            : 600,
        canvasHeight = parseInt(canvasWidth * 0.525),
        paddingX = r * 4,
        paddingY = 20,
        areaXMin = paddingX,
        areaXMax = canvasWidth - paddingX,
        areaYMin = paddingY,
        areaYMax = canvasHeight - paddingY - r,
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
        bg = p.loadImage("/bg.png");
      };

      p.setup = () => {
        canvas = p.createCanvas(canvasWidth, canvasHeight);
        canvas.parent(sketchRef.current);
        p.textFont("Gothic MB101 Bold");
        pg = p.createGraphics(p.width, p.height);
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

      p.windowResized = () => {
        canvasWidth =
          p.windowWidth < 600 + convertRemToPx(3.0)
            ? p.windowWidth - convertRemToPx(3.0)
            : 600;
        canvasHeight = parseInt(canvasWidth * 0.525);

        paddingX = r * 4;
        paddingY = 20;
        areaXMin = paddingX;
        areaXMax = canvasWidth - paddingX;
        areaYMin = paddingY;
        areaYMax = canvasHeight - paddingY - r;
        areaWidth = areaXMax - areaXMin;
        areaHeight = areaYMax - areaYMin;
        xRatio = areaWidth / itemWidth;
        yRatio = areaHeight / itemHeight;
        p.resizeCanvas(canvasWidth, canvasHeight);
        pg = p.createGraphics(p.width, p.height);
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
        const elm1 = filteredDesigns.filter((elm) => elm.index === line[0])[0];
        const elm2 = filteredDesigns.filter((elm) => elm.index === line[1])[0];
        pg.line(calcX(elm1.x), calcY(elm1.y), calcX(elm2.x), calcY(elm2.y));
        pg.pop();
      }

      function drawCaption(elm) {
        p.push();
        p.fill(255, 255, 255);
        p.textSize(r / 1.5);
        p.textLeading(100);
        p.noStroke();
        // if (elm.caption === 0) {
        //   p.textAlign(p.CENTER, p.CENTER);
        //   p.translate(calcX(elm.x), calcY(elm.y) - r);
        // } else if (elm.caption === 1) {
        //   p.textAlign(p.LEFT, p.CENTER);
        //   p.translate(calcX(elm.x) + r * 0.7, calcY(elm.y) - 3);
        // } else if (elm.caption === 2) {
        p.textAlign(p.CENTER, p.CENTER);
        p.translate(calcX(elm.x), calcY(elm.y) + r * 1.2);
        // } else if (elm.caption === 3) {
        //   p.textAlign(p.RIGHT, p.CENTER);
        //   p.translate(calcX(elm.x) - r * 0.7, calcY(elm.y) - 3);
        // }
        p.text(elm.name, 0, 0);
        p.pop();
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
  }, []);

  return <div ref={sketchRef}></div>;
};

export default Sketch;
