import { useRouter } from "next/router";
import React, { useState, useRef, useEffect } from "react";
import p5 from "p5";
import { designs } from "./library";
import supabase from "../pages/api/supabase";

const Sketch = ({ onSave }) => {
  let canvas;
  const sketchRef = useRef(null);

  const router = useRouter();
  const { id } = router.query;

  var designerName = "";
  var selectedDesigns = [];
  var starLines = [];
  var constellationName = "";

  const getData = async (id) => {
    // console.log(id);
    try {
      const { data: design_constellation, error } = await supabase
        .from("design_constellation")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }
      // console.log(design_constellation);
      designerName = design_constellation.designer_name;
      selectedDesigns = design_constellation.selected_designs;
      starLines = design_constellation.star_lines;
      constellationName = design_constellation.constellation_name;
    } catch (error) {
      console.error("データの取得に失敗しました", error);
    }
  };

  useEffect(() => {
    if (id) {
      (async () => {
        await getData(id);

        // これでうまくいった。消すな。
        Ts.loadFont();

        const sketch = new p5((p) => {
          let bg, pg;

          const filteredDesigns = designs.filter((design) =>
            selectedDesigns.includes(design.index)
          );

          const r = 15 + 50 / filteredDesigns.length,
            canvasWidth = 1200,
            canvasHeight = 630,
            paddingX = r * 5,
            paddingY = 100,
            areaXMin = canvasWidth / 2,
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
            yRatio = areaHeight / itemHeight,
            textBoxWidth1 = 390,
            textBoxWidth2 = 370;

          function calcX(x) {
            if (filteredDesigns.length == 1) {
              return areaXMin + areaWidth / 2;
            } else {
              return areaXMin + (x - itemXMin) * xRatio;
            }
          }
          function calcY(y) {
            if (filteredDesigns.length == 1) {
              return areaYMin + areaHeight / 2;
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
            p.textWrap(p.CHAR);
            p.noStroke();

            const string1 = designerName + "さんの星座";
            const string2 = constellationName + "座";

            p.push();
            p.textSize(32);
            const stringWidth1 = p.textWidth(string1);
            const stringRow1 = Math.floor(stringWidth1 / textBoxWidth1) + 1;
            const stringHeight1 = stringRow1 * 32;

            p.textSize(52);
            const stringWidth2 = p.textWidth(string2);
            const stringRow2 = Math.floor(stringWidth2 / textBoxWidth2) + 1;
            const stringHeight2 = stringRow2 * 52;

            const textBoxHeight = stringHeight1 + stringHeight2 + 30;

            p.translate(60, canvasHeight / 2);
            p.textSize(32);
            p.textLeading(32);
            p.textAlign(p.LEFT, p.TOP);
            p.text(string1, 0, -textBoxHeight / 2, textBoxWidth1);

            p.textSize(52);
            p.textLeading(52);
            p.textAlign(p.LEFT, p.BOTTOM);
            p.text(string2, 0, textBoxHeight / 2, textBoxWidth2);

            p.pop();

            if (canvas && onSave) {
              canvas.canvas.toBlob(async (blob) => {
                const url = URL.createObjectURL(blob);
                onSave(url);

                const filePath = `${id}.png`;
                const arrayBuffer = await blob.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                const file = new File([uint8Array], `${id}.png`, {
                  type: "image/png",
                });
                const { error } = await supabase.storage
                  .from("ogp")
                  .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: true,
                  });
                if (error) {
                  console.log(error);
                }
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
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(r);
            // p.textLeading(100);
            p.noStroke();
            p.translate(calcX(elm.x), calcY(elm.y) + r * 1.2);
            p.text(elm.name, 0, 0);
            p.pop();
          }
        });

        return () => {
          sketch.remove();
        };
      })();
    }
  }, [id]);
  return <div ref={sketchRef} style={{ display: "none" }}></div>;
};

export default Sketch;
