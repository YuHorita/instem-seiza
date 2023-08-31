import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { useRouter } from "next/router";
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
        }
      }

      let myFont;
      let bg;
      let pg;
      let r = 80 / selectedCheckboxes.length;

      const w = p.windowWidth - convertRemToPx(3.0);
      const h = w;

      const padding = r * 2.5;
      const areaXMin = padding;
      const areaXMax = w - padding;
      const areaYMin = padding;
      const areaYMax = h - padding;
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

      var touchedLines = [];
      var isSelecting = false;
      var isTouching = false;

      var pTouchX;

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
      };

      p.draw = () => {
        p.image(bg, 0, 0, p.width, bg.height * (p.width / bg.width));
        pg.background(37, 39, 50);

        pg.erase();
        props.data.selectedCheckboxes.forEach((i) => {
          drawElement(designs[i]);
        });
        touchedLines.forEach((line) => {
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
          drawText(designs[i]);
        });
      };

      p.touchStarted = () => {
        touchedLines.push({ x: [], y: [] });
        isTouching = true;
      };

      p.mouseClicked = () => {
        // if (isTouching) {
        isTouching = false;
        checkIsTouchingItem();
        // }
      };

      function checkIsTouchingItem() {
        for (let i = 0; i < selectedCheckboxes.length; i++) {
          let item = designs[selectedCheckboxes[i]];
          let itemX = areaXMin + (item.x - itemXMin) * xRatio;
          let itemY = areaYMin + (item.y - itemYMin) * yRatio;
          let distance = p.dist(p.mouseX, p.mouseY, itemX, itemY);
          if (distance < r) {
            console.log(item.name);
            alert(item.name);
          }
        }
      }

      p.touchMoved = () => {
        touchedLines[touchedLines.length - 1].x.push(p.touches[0].x);
        touchedLines[touchedLines.length - 1].y.push(p.touches[0].y);
      };

      function drawElement(elm) {
        pg.push();
        pg.fill(255);
        pg.noStroke();
        pg.ellipse(
          areaXMin + (elm.x - itemXMin) * xRatio,
          areaYMin + (elm.y - itemYMin) * yRatio,
          r
        );
        pg.pop();
      }

      function drawText(elm) {
        p.push();
        p.translate(
          areaXMin + (elm.x - itemXMin) * xRatio,
          areaYMin + (elm.y - itemYMin) * yRatio + r * 1.3
        );
        p.text(elm.name, 0, 0);
        p.pop();
      }

      function drawLine(line) {
        pg.push();
        pg.stroke(255);
        pg.strokeWeight(1);
        pg.noFill();
        pg.beginShape();
        for (let i = 0; i < line.x.length; i++) {
          pg.curveVertex(line.x[i], line.y[i]);
        }
        pg.endShape();
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
