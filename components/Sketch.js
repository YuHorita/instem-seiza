import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { designs } from "./library";

const Sketch = (props) => {
  const sketchRef = useRef(null);
  const displayName = props.data.displayName;
  const selectedCheckboxes = props.data.selectedCheckboxes;

  useEffect(() => {
    const sketch = new p5((p) => {
      class DesignStar {
        constructor(name, x, y) {
          this.name = name;
          this.x = x;
          this.y = y;
          this.isSelected = false;
        }
      }

      var designStars = [];

      let myFont;
      let bg;
      let pg;
      let r = 80 / selectedCheckboxes.length;

      const w = p.windowWidth - convertRemToPx(3.0);
      const h = w;

      const paddingX = 60;
      const paddingY = 30;
      const areaXMin = paddingX;
      const areaXMax = w - paddingX;
      const areaYMin = paddingY;
      const areaYMax = h - paddingY - r * 1.3;
      const areaWidth = areaXMax - areaXMin;
      const areaHeight = areaYMax - areaYMin;

      const itemXMin =
        designs[
          selectedCheckboxes.sort((a, b) => designs[a].x - designs[b].x)[0]
        ].x;
      const itemXMax =
        designs[
          selectedCheckboxes.sort((a, b) => designs[b].x - designs[a].x)[0]
        ].x;
      const itemYMin =
        designs[
          selectedCheckboxes.sort((a, b) => designs[a].y - designs[b].y)[0]
        ].y;
      const itemYMax =
        designs[
          selectedCheckboxes.sort((a, b) => designs[b].y - designs[a].y)[0]
        ].y;

      const itemWidth = itemXMax - itemXMin;
      const itemHeight = itemYMax - itemYMin;
      const xRatio = areaWidth / itemWidth;
      const yRatio = areaHeight / itemHeight;

      var nowSelecting = undefined;
      var starLines = [];

      function convertRemToPx(rem) {
        var fontSize = getComputedStyle(document.documentElement).fontSize;
        return rem * parseFloat(fontSize);
      }

      p.preload = () => {
        myFont = p.loadFont("fonts/LINESeedJP.ttf");
        bg = p.loadImage("bg_portrait.png");
      };

      p.setup = () => {
        p.createCanvas(w, h);
        p.textFont(myFont);
        pg = p.createGraphics(p.width, p.height);

        for (let i = 0; i < designs.length; i++) {
          const x = areaXMin + (designs[i].x - itemXMin) * xRatio;
          const y = areaYMin + (designs[i].y - itemYMin) * yRatio;
          designStars.push(new DesignStar(designs[i].name, x, y));
        }
      };

      p.draw = () => {
        p.image(bg, 0, 0, p.width, bg.height * (p.width / bg.width));
        pg.background(37, 39, 50);

        pg.erase();
        props.data.selectedCheckboxes.forEach((i) => {
          drawDesignStar(designStars[i]);
        });
        starLines.forEach((line) => {
          drawLine(line);
        });

        pg.noErase();
        p.image(pg, 0, 0);

        p.fill(255, 255, 255);
        p.textAlign(p.CENTER);
        p.textSize(r / 2);
        p.textLeading(100);
        p.noStroke();

        props.data.selectedCheckboxes.forEach((i) => {
          drawText(designStars[i]);
        });
      };

      p.mouseClicked = () => {
        checkIsTouchingItem();
      };

      function checkIsTouchingItem() {
        for (let i = 0; i < designStars.length; i++) {
          let distance = p.dist(
            p.mouseX,
            p.mouseY,
            designStars[i].x,
            designStars[i].y
          );
          if (distance < r) {
            console.log(designStars[i].name);
            if (nowSelecting === undefined) {
              nowSelecting = designStars[i];
              designStars[i].isSelected = true;
            } else if (nowSelecting === designStars[i]) {
              nowSelecting = undefined;
              designStars[i].isSelected = false;
            } else {
              let isExist = false;
              let existingNum;
              for (let j = 0; j < starLines.length; j++) {
                if (
                  (starLines[j][0] === nowSelecting &&
                    starLines[j][1] === designStars[i]) ||
                  (starLines[j][0] === designStars[i] &&
                    starLines[j][1] === nowSelecting)
                ) {
                  isExist = true;
                  existingNum = j;
                  break;
                }
              }
              if (!isExist) {
                starLines.push([nowSelecting, designStars[i]]);
              } else {
                starLines.splice(existingNum, 1);
              }
              nowSelecting.isSelected = false;
              nowSelecting = undefined;
            }
          }
        }
      }

      function drawDesignStar(elm) {
        pg.push();
        pg.fill(255);
        pg.noStroke();
        pg.ellipse(elm.x, elm.y, r);
        if (elm.isSelected) {
          pg.noFill();
          pg.stroke(255);
          pg.strokeWeight(1.5);
          pg.ellipse(elm.x, elm.y, r + 5);
        }
        pg.pop();
      }

      function drawText(elm) {
        p.push();
        p.translate(elm.x, elm.y + r * 1.3);
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
