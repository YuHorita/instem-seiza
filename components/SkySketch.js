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
    const sketch = new p5((p) => {
      let montserrat = [];
      let notoSansJP = [];
      let lineSeedJP;

      let bg;
      let pg;
      let r = 20;

      const filteredDesigns = designs.filter((design) =>
        selectedDesigns.includes(design.index)
      );
      var nowSelecting = null;
      var starLines = [];
      localStorage.setItem("starLines", JSON.stringify(starLines));

      const w = p.windowWidth - convertRemToPx(3.0);
      const h = w * 0.7;

      const paddingX = 100;
      const paddingY = 30;
      const areaXMin = paddingX;
      const areaXMax = w - paddingX;
      const areaYMin = paddingY;
      const areaYMax = h - paddingY - r * 1.3;
      const areaWidth = areaXMax - areaXMin;
      const areaHeight = areaYMax - areaYMin;

      const itemXMin = filteredDesigns.sort((a, b) => a.x - b.x)[0].x;
      const itemXMax = filteredDesigns.sort((a, b) => b.x - a.x)[0].x;
      const itemYMin = filteredDesigns.sort((a, b) => a.y - b.y)[0].y;
      const itemYMax = filteredDesigns.sort((a, b) => b.y - a.y)[0].y;

      const itemWidth = itemXMax - itemXMin;
      const itemHeight = itemYMax - itemYMin;
      const xRatio = areaWidth / itemWidth;
      const yRatio = areaHeight / itemHeight;

      function calcX(x) {
        if (filteredDesigns.length == 1) {
          return w / 2;
        } else {
          return areaXMin + (x - itemXMin) * xRatio;
        }
      }
      function calcY(y) {
        if (filteredDesigns.length == 1) {
          return h / 2;
        } else {
          return areaYMin + (y - itemYMin) * yRatio;
        }
      }
      function calcXForWEBGL(x) {
        if (filteredDesigns.length == 1) {
          return 0;
        } else {
          return areaXMin + (x - itemXMin) * xRatio - w / 2;
        }
      }
      function calcYForWEBGL(y) {
        if (filteredDesigns.length == 1) {
          return 0;
        } else {
          return areaYMin + (y - itemYMin) * yRatio - h / 2;
        }
      }

      function convertRemToPx(rem) {
        var fontSize = getComputedStyle(document.documentElement).fontSize;
        return rem * parseFloat(fontSize);
      }

      p.preload = () => {
        bg = p.loadImage("bg_portrait.png");

        const montserratUrl = [
          "fonts/Montserrat/Montserrat-Thin.ttf",
          "fonts/Montserrat/Montserrat-ExtraLight.ttf",
          "fonts/Montserrat/Montserrat-Light.ttf",
          "fonts/Montserrat/Montserrat-Regular.ttf",
          "fonts/Montserrat/Montserrat-Medium.ttf",
          "fonts/Montserrat/Montserrat-SemiBold.ttf",
          "fonts/Montserrat/Montserrat-Bold.ttf",
          "fonts/Montserrat/Montserrat-ExtraBold.ttf",
          "fonts/Montserrat/Montserrat-Black.ttf",
        ];
        const notoSansJPUrl = [
          "fonts/NotoSansJP/NotoSansJP-Thin.ttf",
          "fonts/NotoSansJP/NotoSansJP-ExtraLight.ttf",
          "fonts/NotoSansJP/NotoSansJP-Light.ttf",
          "fonts/NotoSansJP/NotoSansJP-Regular.ttf",
          "fonts/NotoSansJP/NotoSansJP-Medium.ttf",
          "fonts/NotoSansJP/NotoSansJP-SemiBold.ttf",
          "fonts/NotoSansJP/NotoSansJP-Bold.ttf",
          "fonts/NotoSansJP/NotoSansJP-Black.ttf",
        ];
        montserratUrl.forEach((url) => {
          montserrat.push(p.loadFont(url));
        });
        notoSansJPUrl.forEach((url) => {
          notoSansJP.push(p.loadFont(url));
        });

        lineSeedJP = p.loadFont("fonts/LINESeedJP.ttf");
      };

      p.setup = () => {
        const canvas = p.createCanvas(w, h, p.WEBGL);
        canvas.parent(sketchRef.current);
        p.textFont(lineSeedJP);
        pg = p.createGraphics(p.width, p.height);
        console.log(pg.webglVersion);
      };

      p.draw = () => {
        p.image(bg, -w / 2, -h / 2, p.width, bg.height * (p.width / bg.width));
        pg.background(37, 39, 50);

        pg.erase();
        filteredDesigns.forEach((elm) => {
          drawDesignStar(elm);
        });

        starLines.forEach((line) => {
          drawLine(line);
        });

        pg.noErase();
        p.image(pg, -w / 2, -h / 2);

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
        const elm1 = filteredDesigns.filter((elm) => elm.index === line[0])[0];
        const elm2 = filteredDesigns.filter((elm) => elm.index === line[1])[0];
        pg.line(calcX(elm1.x), calcY(elm1.y), calcX(elm2.x), calcY(elm2.y));
        pg.pop();
      }

      function drawCaption(elm) {
        p.push();
        p.fill(255, 255, 255);
        if (elm.caption === 0 || elm.caption === 2) {
          p.textAlign(p.CENTER, p.CENTER);
        } else if (elm.caption === 1) {
          p.textAlign(p.LEFT, p.CENTER);
        } else if (elm.caption === 3) {
          p.textAlign(p.RIGHT, p.CENTER);
        }

        p.textSize(r / 2);
        p.textLeading(100);
        p.noStroke();
        if (elm.caption === 0) {
          p.translate(calcXForWEBGL(elm.x), calcYForWEBGL(elm.y) - r);
        } else if (elm.caption === 1) {
          p.translate(calcXForWEBGL(elm.x) + r * 0.7, calcYForWEBGL(elm.y) - 3);
        } else if (elm.caption === 2) {
          p.translate(calcXForWEBGL(elm.x), calcYForWEBGL(elm.y) + r - 3);
        } else if (elm.caption === 3) {
          p.translate(calcXForWEBGL(elm.x) - r * 0.7, calcYForWEBGL(elm.y) - 3);
        }
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
