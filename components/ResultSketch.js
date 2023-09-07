import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { designs } from "./library";

const Sketch = ({ onSave }) => {
  let canvas;
  const sketchRef = useRef(null);

  var designerName = "";
  var selectedDesigns = [];
  var starLines = [];
  var constellationName = "";

  try {
    designerName = JSON.parse(localStorage.getItem("designerName"));
    selectedDesigns = JSON.parse(localStorage.getItem("selectedDesigns"));
    starLines = JSON.parse(localStorage.getItem("starLines"));
    constellationName = JSON.parse(localStorage.getItem("constellationName"));
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    const sketch = new p5((p) => {
      let myFont;
      let bg;
      let pg;
      let r = 40;

      const filteredDesigns = designs.filter((design) =>
        selectedDesigns.includes(design.index)
      );

      const w = 1200;
      const h = 630;

      const paddingX = 150;
      const paddingY = 100;
      const areaXMin = w / 2;
      const areaXMax = w - paddingX;
      const areaYMin = paddingY;
      const areaYMax = h - paddingY - r;
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
        return areaXMin + (x - itemXMin) * xRatio;
      }
      function calcY(y) {
        return areaYMin + (y - itemYMin) * yRatio;
      }

      p.preload = () => {
        myFont = p.loadFont("fonts/LINESeedJP.ttf");
        bg = p.loadImage("bg_portrait.png");
      };

      p.setup = () => {
        canvas = p.createCanvas(w, h);
        canvas.parent(sketchRef.current);
        p.textFont(myFont);
        pg = p.createGraphics(p.width, p.height);

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

        p.fill(255, 255, 255);
        p.textAlign(p.LEFT, p.CENTER);
        p.textLeading(100);
        p.noStroke();

        p.push();
        p.translate(80, h / 2 - 40);
        p.textSize(32);
        p.text(designerName + "さんの星座", 0, 0);
        p.pop();

        p.push();
        p.translate(80, h / 2 + 20);
        p.textSize(52);
        p.text(constellationName + "座", 0, 0);
        p.pop();
      };

      p.draw = () => {
        if (canvas && onSave) {
          canvas.canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            onSave(url);
          }, "image/png");
        }
      };

      function drawDesignStar(elm) {
        pg.push();
        pg.fill(255);
        pg.noStroke();
        pg.ellipse(calcX(elm.x), calcY(elm.y), r);
        pg.pop();
      }

      function drawLine(line) {
        pg.push();
        pg.stroke(255);
        pg.strokeWeight(3);
        pg.noFill();
        const elm1 = filteredDesigns.filter((elm) => elm.index === line[0])[0];
        const elm2 = filteredDesigns.filter((elm) => elm.index === line[1])[0];
        pg.line(calcX(elm1.x), calcY(elm1.y), calcX(elm2.x), calcY(elm2.y));
        pg.pop();
      }

      function drawCaption(elm) {
        p.push();
        p.fill(255, 255, 255);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(r / 2);
        p.textLeading(100);
        p.noStroke();
        p.translate(calcX(elm.x), calcY(elm.y) + r - 3);
        p.text(elm.name, 0, 0);
        p.pop();
      }
    });

    return () => {
      sketch.remove();
    };
  }, []);

  return <div ref={sketchRef} style={{ display: "none" }}></div>;
};

export default Sketch;
