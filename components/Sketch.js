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

      p.touchMoved = () => {
        touchedLines[touchedLines.length - 1].x.push(p.touches[0].x);
        touchedLines[touchedLines.length - 1].y.push(p.touches[0].y);
      };

      p.touchEnded = () => {
        if (isTouching) {
          isTouching = false;
          alert([p.mouseX, p.mouseY]);
        }
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

      function createConstellation(constellation) {
        let graph = createGraph(constellation.array.length);
        for (let i = 0; i < constellation.array.length; i++) {
          for (let j = i + 1; j < constellation.array.length; j++) {
            let distance = p.dist(
              itemArray[constellation.array[i]].x,
              itemArray[constellation.array[i]].y,
              itemArray[constellation.array[i]].z,
              itemArray[constellation.array[j]].x,
              itemArray[constellation.array[j]].y,
              itemArray[constellation.array[j]].z
            );
            addEdge(graph, i, j, distance);
          }
        }
        let startNode = 0;
        let distance = dijkstra(graph, startNode);

        let visited = new Array(constellation.array.length).fill(false);
        visited[startNode] = true;
        let currentNode = startNode;
        for (let i = 0; i < constellation.array.length - 1; i++) {
          let nextNode = findClosestNode(distance, visited);
          constellation.connections.push({ start: currentNode, end: nextNode });
          visited[nextNode] = true;
          currentNode = nextNode;
        }
      }

      function dijkstra(graph, start) {
        let distances = new Array(graph.length).fill(Infinity);
        distances[start] = 0;

        let queue = new PriorityQueue();
        queue.enqueue(start, 0);

        while (!queue.isEmpty()) {
          let current = queue.dequeue().element;

          for (let i = 0; i < graph[current].length; i++) {
            let nextNode = graph[current][i].node;
            let weight = graph[current][i].weight;
            let distance = distances[current] + weight;

            if (distance < distances[nextNode]) {
              distances[nextNode] = distance;
              queue.enqueue(nextNode, distance);
            }
          }
        }

        return distances;
      }

      function findClosestNode(distances, visited) {
        let minDistance = Infinity;
        let closestNode;

        for (let i = 0; i < distances.length; i++) {
          if (!visited[i] && distances[i] < minDistance) {
            minDistance = distances[i];
            closestNode = i;
          }
        }

        return closestNode;
      }

      function createGraph(vertices) {
        let graph = new Array(vertices);
        for (let i = 0; i < vertices; i++) {
          graph[i] = [];
        }
        return graph;
      }

      function addEdge(graph, start, end, weight) {
        graph[start].push({ node: end, weight: weight });
        graph[end].push({ node: start, weight: weight });
      }
    });

    return () => {
      sketch.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
};

export default Sketch;
