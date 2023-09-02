import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { designs, DesignStar } from "./library";

var formData = {};
var starName = "";
var starLines = [];
var selectedCheckboxes = [];
var displayName = "";

try {
  formData = JSON.parse(localStorage.getItem("formData"));
  starName = JSON.parse(localStorage.getItem("starName"));
  starLines = JSON.parse(localStorage.getItem("starLines"));
  selectedCheckboxes = formData.selectedCheckboxes;
  displayName = formData.displayName;
} catch (e) {
  console.log(e);
}

const Sketch = ({ onSave }) => {
  let canvas;
  const sketchRef = useRef(null);

  useEffect(() => {
    const sketch = new p5((p) => {
      let myFont;
      let bg;
      let pg;
      let r = 15;

      var designStars = [];
      // var starLines = [];

      const w = p.windowWidth - convertRemToPx(3.0);
      const h = w / 1.91;

      const paddingX = 50;
      const paddingY = 30;
      const areaXMin = w / 2;
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

      function convertRemToPx(rem) {
        var fontSize = getComputedStyle(document.documentElement).fontSize;
        return rem * parseFloat(fontSize);
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

        for (let i = 0; i < designs.length; i++) {
          const x = areaXMin + (designs[i].x - itemXMin) * xRatio;
          const y = areaYMin + (designs[i].y - itemYMin) * yRatio;
          //selectedCheckBoxesに含まれているかどうかでisDisplayedを判定
          designStars.push(
            new DesignStar(
              designs[i].name,
              x,
              y,
              selectedCheckboxes.includes(i),
              designs[i].caption
            )
          );
        }

        // starLinesが前ページのDesignStarsによって構成されているため、同名のDesignStarを探して代入する
        for (let i = 0; i < starLines.length; i++) {
          for (let j = 0; j < designStars.length; j++) {
            if (starLines[i][0].name === designStars[j].name) {
              starLines[i][0] = designStars[j];
            }
            if (starLines[i][1].name === designStars[j].name) {
              starLines[i][1] = designStars[j];
            }
          }
        }

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

        selectedCheckboxes.forEach((i) => {
          drawCaption(designStars[i]);
        });

        p.fill(255, 255, 255);
        p.textAlign(p.LEFT, p.CENTER);

        p.textLeading(100);
        p.noStroke();
        p.push();
        p.translate(20, h / 2 - 10);
        p.textSize(8);
        p.text(displayName + "さんの星座", 0, 0);
        p.pop();
        p.push();
        p.translate(20, h / 2 + 10);
        p.textSize(16);
        p.text(starName + "座", 0, 0);
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
        // if (elm.captionPos === 0 || elm.captionPos === 2) {
        p.textAlign(p.CENTER, p.CENTER);
        // } else if (elm.captionPos === 1) {
        // p.textAlign(p.LEFT, p.CENTER);
        // } else if (elm.captionPos === 3) {
        // p.textAlign(p.RIGHT, p.CENTER);
        // }

        p.textSize(r / 3);
        p.textLeading(100);
        p.noStroke();
        // if (elm.captionPos === 0) {
        //   p.translate(elm.x, elm.y - r);
        // } else if (elm.captionPos === 1) {
        //   p.translate(elm.x + r * 0.7, elm.y - 3);
        // } else if (elm.captionPos === 2) {
        p.translate(elm.x, elm.y + r - 3);
        // } else if (elm.captionPos === 3) {
        //   p.translate(elm.x - r * 0.7, elm.y - 3);
        // }
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

      p.keyPressed = () => {
        if (p.key === "s" || p.key === "S") {
          p.saveCanvas(canvas, "myCanvas", "png");
        }
      };
    });

    return () => {
      sketch.remove();
    };
  }, []);

  const saveCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      // キャンバスからPNG画像を生成
      const canvasImage = canvas.toDataURL("image/png");

      // 生成したPNG画像をコールバック関数に渡す
      if (onCanvasSave) {
        onCanvasSave(canvasImage);
      }
    }
  };

  return <div ref={sketchRef} style={{ display: "none" }}></div>;
};

export default Sketch;
