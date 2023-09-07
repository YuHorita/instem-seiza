import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { designs, DesignStar } from "./library";

const Sketch = () => {
  const sketchRef = useRef(null);
  var selectedStars = [];

  try {
    selectedStars = JSON.parse(localStorage.getItem("selectedStars"));
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    const sketch = new p5((p) => {
      let myFont;
      let bg;
      let pg;
      let r = 20;

      var designStars = [];
      var starLines = [];

      const w = p.windowWidth - convertRemToPx(3.0);
      const h = w;

      const paddingX = 100;
      const paddingY = 30;
      const areaXMin = paddingX;
      const areaXMax = w - paddingX;
      const areaYMin = paddingY;
      const areaYMax = h - paddingY - r * 1.3;
      const areaWidth = areaXMax - areaXMin;
      const areaHeight = areaYMax - areaYMin;

      const itemXMin =
        designs[selectedStars.sort((a, b) => designs[a].x - designs[b].x)[0]].x;
      const itemXMax =
        designs[selectedStars.sort((a, b) => designs[b].x - designs[a].x)[0]].x;
      const itemYMin =
        designs[selectedStars.sort((a, b) => designs[a].y - designs[b].y)[0]].y;
      const itemYMax =
        designs[selectedStars.sort((a, b) => designs[b].y - designs[a].y)[0]].y;

      const itemWidth = itemXMax - itemXMin;
      const itemHeight = itemYMax - itemYMin;
      const xRatio = areaWidth / itemWidth;
      const yRatio = areaHeight / itemHeight;

      var nowSelecting = undefined;

      function convertRemToPx(rem) {
        var fontSize = getComputedStyle(document.documentElement).fontSize;
        return rem * parseFloat(fontSize);
      }

      p.preload = () => {
        myFont = p.loadFont("fonts/LINESeedJP.ttf");
        bg = p.loadImage("bg_portrait.png");
      };

      p.setup = () => {
        const canvas = p.createCanvas(w, h);
        canvas.parent(sketchRef.current);
        p.textFont(myFont);
        pg = p.createGraphics(p.width, p.height);

        for (let i = 0; i < designs.length; i++) {
          const x = areaXMin + (designs[i].x - itemXMin) * xRatio;
          const y = areaYMin + (designs[i].y - itemYMin) * yRatio;
          //selectedStarsに含まれているかどうかでisDisplayedを判定
          designStars.push(
            new DesignStar(
              designs[i].name,
              x,
              y,
              selectedStars.includes(i),
              designs[i].caption
            )
          );
          // localStorage.setItem("designStars", JSON.stringify(designStars));
        }
      };

      p.draw = () => {
        p.image(bg, 0, 0, p.width, bg.height * (p.width / bg.width));
        pg.background(37, 39, 50);

        pg.erase();
        designStars
          .filter((elm) => elm.isDisplayed)
          .forEach((elm) => {
            drawDesignStar(elm);
          });
        starLines.forEach((line) => {
          drawLine(line);
        });

        pg.noErase();
        p.image(pg, 0, 0);

        selectedStars.forEach((i) => {
          drawCaption(designStars[i]);
        });
      };

      p.mouseClicked = () => {
        designStars
          .filter((elm) => elm.isDisplayed)
          .forEach((elm) => {
            let distance = p.dist(p.mouseX, p.mouseY, elm.x, elm.y);
            if (distance < r) {
              if (nowSelecting === undefined) {
                nowSelecting = elm;
                elm.isSelected = true;
              } else if (nowSelecting === elm) {
                nowSelecting = undefined;
                elm.isSelected = false;
              } else {
                let isExist = false;
                let existingNum;
                for (let j = 0; j < starLines.length; j++) {
                  if (
                    (starLines[j][0] === nowSelecting &&
                      starLines[j][1] === elm) ||
                    (starLines[j][0] === elm &&
                      starLines[j][1] === nowSelecting)
                  ) {
                    isExist = true;
                    existingNum = j;
                    break;
                  }
                }
                if (!isExist) {
                  starLines.push([nowSelecting, elm]);
                } else {
                  starLines.splice(existingNum, 1);
                }
                localStorage.setItem("starLines", JSON.stringify(starLines));
                nowSelecting.isSelected = false;
                nowSelecting = undefined;
              }
            }
          });
      };

      function drawDesignStar(elm) {
        pg.push();
        pg.fill(255);
        pg.noStroke();
        pg.ellipse(elm.x, elm.y, r);
        if (elm.isSelected) {
          pg.noFill();
          pg.stroke(255);
          pg.strokeWeight(1);
          pg.ellipse(elm.x, elm.y, r + 10 + p.sin(p.frameCount / 20) * 5);
        }
        pg.pop();
      }

      function drawCaption(elm) {
        p.push();
        p.fill(255, 255, 255);
        if (elm.captionPos === 0 || elm.captionPos === 2) {
          p.textAlign(p.CENTER, p.CENTER);
        } else if (elm.captionPos === 1) {
          p.textAlign(p.LEFT, p.CENTER);
        } else if (elm.captionPos === 3) {
          p.textAlign(p.RIGHT, p.CENTER);
        }

        p.textSize(r / 2);
        p.textLeading(100);
        p.noStroke();
        if (elm.captionPos === 0) {
          p.translate(elm.x, elm.y - r);
        } else if (elm.captionPos === 1) {
          p.translate(elm.x + r * 0.7, elm.y - 3);
        } else if (elm.captionPos === 2) {
          p.translate(elm.x, elm.y + r - 3);
        } else if (elm.captionPos === 3) {
          p.translate(elm.x - r * 0.7, elm.y - 3);
        }
        p.text(elm.name, 0, 0);
        p.pop();
      }

      function drawLine(line) {
        pg.push();
        pg.stroke(255);
        pg.strokeWeight(1);
        pg.noFill();
        pg.line(line[0].x, line[0].y, line[1].x, line[1].y);
        pg.pop();
      }
    });

    return () => {
      sketch.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
};

export default Sketch;
