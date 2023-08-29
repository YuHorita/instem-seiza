import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { useRouter } from "next/router";
import { designs } from "./library";

const Sketch = () => {
  const sketchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const sketch = new p5((p) => {
      const constellationArray = [
        {
          array: router.query.selectedCheckboxes,
          color: router.query.selectedColor,
          connections: [],
        },
      ];

      class PriorityQueue {
        constructor() {
          this.items = [];
        }

        enqueue(element, priority) {
          let queueElement = { element, priority };
          let added = false;

          for (let i = 0; i < this.items.length; i++) {
            if (queueElement.priority < this.items[i].priority) {
              this.items.splice(i, 0, queueElement);
              added = true;
              break;
            }
          }

          if (!added) {
            this.items.push(queueElement);
          }
        }

        dequeue() {
          if (this.isEmpty()) {
            return null;
          }
          return this.items.shift();
        }

        isEmpty() {
          return this.items.length === 0;
        }
      }

      let myFont;
      let bg;
      let pg;
      let r = convertRemToPx(0.7);

      function convertRemToPx(rem) {
        var fontSize = getComputedStyle(document.documentElement).fontSize;
        return rem * parseFloat(fontSize);
      }

      p.preload = () => {
        myFont = p.loadFont("fonts/LINESeedJP.ttf");
        bg = p.loadImage("bg.png");
      };

      p.setup = () => {
        const w = p.windowWidth - convertRemToPx(3.0);
        p.createCanvas(w, w / 1.91);
        p.textFont(myFont);
        pg = p.createGraphics(p.width, p.height);
      };

      p.draw = () => {
        p.image(bg, 0, 0, p.width, bg.height * (p.width / bg.width));
        pg.background(37, 39, 50);

        designs.forEach((element) => {
          drawElement(element);
        });
        p.image(pg, 0, 0);

        p.fill(255, 255, 255);
        p.textAlign(p.CENTER);
        p.textSize(r / 2);
        p.textLeading(100);
        p.noStroke();
        designs.forEach((element) => {
          drawText(element);
        });
      };

      function drawElement(elm) {
        pg.erase();
        pg.ellipse((elm.x / 100) * p.width, (elm.y / 100) * p.height, r, r);
        pg.noErase();
      }

      function drawText(elm) {
        p.push();
        p.translate((elm.x / 100) * p.width, (elm.y / 100) * p.height + r * 1.5);
        p.text(elm.name, 0, 0);
        p.pop();
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
