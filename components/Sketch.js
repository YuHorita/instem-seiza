import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { useRouter } from "next/router";

const Sketch = () => {
  const sketchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const sketch = new p5((p) => {
      const itemArray = [
        { name: "エディトリアルデザイン", x: 40, y: -300, z: -350 },
        { name: "ロゴデザイン", x: 100, y: 80, z: -380 },
        { name: "グラフィックデザイン", x: -30, y: 100, z: 340 },
        { name: "ブランドデザイン", x: 60, y: 200, z: -30 },
        { name: "インダストリアルデザイン", x: 45, y: 300, z: 60 },
        { name: "インタラクションデザイン", x: 75, y: -200, z: 45 },
        { name: "UIデザイン", x: -120, y: 320, z: 70 },
        { name: "プロダクトデザイン", x: 280, y: 300, z: -100 },
        { name: "サービスデザイン", x: 350, y: -100, z: 30 },
        { name: "エクスペリエンスデザイン", x: -320, y: 180, z: 0 },
        { name: "サウンドデザイン", x: -380, y: -120, z: 0 },
        { name: "ソーシャルデザイン", x: 420, y: 60, z: 0 },
      ];

      const constellationArray = [
        // { array: [0, 4, 2, 3, 1], r: 95, g: 128, b: 192, connections: [] },
        // { array: [5, 6, 7, 8, 9], r: 68, g: 71, b: 155, connections: [] },
        // { array: [0, 3, 5, 11], r: 135, g: 61, b: 147, connections: [] },
        // { array: [1, 6, 9, 10], r: 210, g: 35, b: 134, connections: [] },
        // { array: [2, 7, 3, 7, 11], r: 213, g: 24, b: 25, connections: [] },
        // { array: [3, 4, 6, 8], r: 243, g: 210, b: 57, connections: [] },
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
      let myCamera;

      p.preload = () => {
        myFont = p.loadFont("fonts/LINESeedJP.ttf");
      };

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        p.blendMode(p.SCREEN);
        p.ambientLight(120, 120, 170);
        p.pointLight(255, 255, 255, 0, 0, 0);
        p.perspective(p.radians(55), p.width / p.height, 1, 5000);
        p.textFont(myFont);

        for (let i = 0; i < constellationArray.length; i++) {
          createConstellation(constellationArray[i]);
        }

        myCamera = p.createCamera();
      };

      p.draw = () => {
        p.background(27, 29, 39);

        p.normalMaterial();
        for (let i = 0; i < itemArray.length; i++) {
          drawItem(
            itemArray[i].name,
            itemArray[i].x,
            itemArray[i].y,
            itemArray[i].z
          );
        }

        for (let i = 0; i < constellationArray.length; i++) {
          drawConstellation(constellationArray[i]);
        }
        p.rotateY(p.frameCount * 0.01);
        p.rotateX(p.frameCount * 0.01);

        myCamera.camera(
          p.sin(p.frameCount * 0.005) * 1000,
          0,
          p.cos(p.frameCount * 0.005) * 1000,
          0,
          0,
          0,
          0,
          1,
          0
        );
      };

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

      function drawItem(name, x, y, z) {
        p.fill(255, 255, 255);
        p.textAlign(p.CENTER);
        p.textSize(20);
        p.textLeading(100);
        // text(name, x, y);
        p.noStroke();
        //planeを常にカメラに正対させる
        p.push();
        // texture(img);

        p.translate(x, y + 35, z);

        p.rotateY(p.frameCount * 0.005);
        p.text(name, 0, 0);
        // plane(293 / 3, 49 / 3);
        p.pop();

        p.push();
        p.translate(x, y, z);
        // ambientMaterial(255, 255, 255);
        p.sphere(10);
        p.pop();
      }

      function drawConstellation(constellation) {
        p.beginShape();
        // p.stroke(constellation.r, constellation.g, constellation.b, 180);
        p.stroke(constellation.color);
        p.strokeWeight(1);
        p.noFill();
        for (let i = 0; i < constellation.connections.length; i++) {
          p.vertex(
            itemArray[constellation.array[constellation.connections[i].start]]
              .x,
            itemArray[constellation.array[constellation.connections[i].start]]
              .y,
            itemArray[constellation.array[constellation.connections[i].start]].z
          );
          p.vertex(
            itemArray[constellation.array[constellation.connections[i].end]].x,
            itemArray[constellation.array[constellation.connections[i].end]].y,
            itemArray[constellation.array[constellation.connections[i].end]].z
          );
        }
        p.endShape(p.CLOSE);
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
    }, sketchRef.current);
  }, []);

  return <div ref={sketchRef}></div>;
};

export default Sketch;
