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
      const { data: instem_seiza, error } = await supabase
        .from("instem_seiza")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }
      // console.log(instem_seiza);
      designerName = instem_seiza.designer_name;
      selectedDesigns = instem_seiza.selected_designs;
      starLines = instem_seiza.star_lines;
      constellationName = instem_seiza.constellation_name;
    } catch (error) {
      console.error("データの取得に失敗しました", error);
    }
  };

  useEffect(() => {
    if (id) {
      (async () => {
        await getData(id);
        const sketch = new p5((p) => {
          let bg, pg, notoSansJP;

          const filteredDesigns = designs.filter((design) =>
            selectedDesigns.includes(design.index)
          );

          // const r = 15 + 50 / filteredDesigns.length,
          const r = p.constrain(200 / filteredDesigns.length, 20, 28),
            canvasWidth = 1200,
            canvasHeight = 630,
            paddingX = r * 5,
            // paddingX = 100 + 800 / filteredDesigns.length,
            paddingY = 100,
            // paddingY = 40 + 200 / filteredDesigns.length,
            areaXMin = canvasWidth / 2,
            // areaXMin = paddingX,
            areaXMax = canvasWidth - paddingX,
            areaYMin = paddingY,
            // areaYMin = paddingY + 80,
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
            textBoxWidth1 = 400,
            textBoxWidth2 = 400;

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
            // bg = p.loadImage("/bg.png");
            notoSansJP = p.loadFont("/NotoSansJP-Bold.ttf");
          };

          p.setup = () => {
            canvas = p.createCanvas(canvasWidth, canvasHeight);
            canvas.parent(sketchRef.current);
            // p.textFont("Gothic MB101 Bold");
            p.textFont(notoSansJP);
            pg = p.createGraphics(p.width, p.height);
            // p.image(bg, 0, 0, p.width, bg.height * (p.width / bg.width));
            p.background(51);
            pg.background(255);
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

            p.fill(51);
            p.textAlign(p.LEFT, p.CENTER);
            p.textWrap(p.CHAR);
            p.noStroke();

            const string1 = designerName + "さんの星座";
            const string2 = constellationName + "座";
            const textSize1 = 28;
            const textSize2 = 42;

            p.push();
            p.textSize(textSize1);
            const stringWidth1 = p.textWidth(string1);
            const stringRow1 = Math.floor(stringWidth1 / textBoxWidth1) + 1;
            const lineHeight1 = textSize1 * 1.25;
            const stringHeight1 = stringRow1 * lineHeight1;

            p.textSize(textSize2);
            const stringWidth2 = p.textWidth(string2);
            const stringRow2 = Math.floor(stringWidth2 / textBoxWidth2) + 1;
            const lineHeight2 = textSize2 * 1.25;
            const stringHeight2 = stringRow2 * lineHeight2;

            const textBoxHeight = stringHeight1 + stringHeight2 + 10;

            p.translate(60, canvasHeight / 2);
            p.textSize(textSize1);
            p.textLeading(lineHeight1);
            p.textAlign(p.LEFT, p.TOP);
            p.text(string1, 0, -textBoxHeight / 2, textBoxWidth1);

            p.textSize(textSize2);
            p.textLeading(lineHeight2);
            p.textAlign(p.LEFT, p.BOTTOM);
            p.text(string2, 0, textBoxHeight / 2, textBoxWidth2);

            p.pop();

            // p.push();
            // p.textSize(32);
            // p.textAlign(p.LEFT, p.TOP);
            // p.text(string1, 40, 40);
            // p.pop();

            // p.push();
            // p.textSize(32);
            // p.textAlign(p.RIGHT, p.TOP);
            // p.text(string2, canvasWidth - 40, 40);
            // p.pop();

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
            pg.fill(51);
            pg.noStroke();
            pg.ellipse(calcX(elm.x), calcY(elm.y), r);
            pg.pop();
          }

          function drawLine(line) {
            pg.push();
            pg.stroke(51);
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
            p.fill(51);
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
