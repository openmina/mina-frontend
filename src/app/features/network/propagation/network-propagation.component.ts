import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { graphviz } from 'd3-graphviz';
import { CONFIG } from '@shared/constants/config';
import * as d3 from 'd3';
import { Path } from 'd3';

@Component({
  selector: 'mina-network-propagation',
  templateUrl: './network-propagation.component.html',
  styleUrls: ['./network-propagation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkPropagationComponent implements OnInit, AfterViewInit {

  @ViewChild('diagram') private diagramRef: ElementRef<HTMLDivElement>;

  private svg: any;
  private margin = { top: 30, right: 0, bottom: 0, left: 0 };
  private width: number;
  private height: number = 400 - this.margin.top - this.margin.bottom;
  private mainG: any;
  private circleWidth: number = 50;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (!CONFIG.production) {
      this.render();
      // this.initDiagram(moock);
    }
  }

  private render() {
    this.width = this.diagramRef.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.svg = d3.select(this.diagramRef.nativeElement)
      .append('svg')
      .attr('class', 'overflow-visible');
    this.mainG = this.svg
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.svg.on('click', (evt: any) => console.log(d3.pointer(evt)));

    function calculateShortestPaths(data: any[], startNode: string): object {
      const nodes = new Set();
      const edges = {};

      // Build the graph
      for (const { from, to, time } of data) {
        nodes.add(from);
        nodes.add(to);
        if (!edges[from]) {
          edges[from] = {};
        }
        edges[from][to] = time;
      }

      // Initialize distances to infinity
      const distances = {};
      for (const node of nodes) {
        distances[node.toString()] = Infinity;
      }
      distances[startNode] = 0;

      // Use a priority queue to visit nodes in order of increasing distance
      const queue = [{ node: startNode, distance: 0 }];
      while (queue.length > 0) {
        queue.sort((a, b) => a.distance - b.distance);
        const { node, distance } = queue.shift();
        if (distance > distances[node]) {
          continue;
        }
        for (const neighbor in edges[node]) {
          const newDistance = distance + edges[node][neighbor];
          if (newDistance < distances[neighbor]) {
            distances[neighbor] = newDistance;
            queue.push({ node: neighbor, distance: newDistance });
          }
        }
      }

      return distances;
    }

    const baseNode = 'n2';
    // let initialData = [
    //   { 'from': 'n1', 'to': 'n2', 'time': 7 },
    //   { 'from': 'n2', 'to': 'n3', 'time': 10 },
    //   { 'from': 'n1', 'to': 'n4', 'time': 4 },
    //   { 'from': 'n4', 'to': 'n6', 'time': 15 },
    //   { 'from': 'n3', 'to': 'n5', 'time': 42 },
    //   { 'from': 'n2', 'to': 'n6', 'time': 77 },
    //   { 'from': 'n1', 'to': 'n7', 'time': 60 },
    //   { 'from': 'n7', 'to': 'n8', 'time': 55 },
    //   { 'from': 'n5', 'to': 'n7', 'time': 10 },
    //   { 'from': 'n5', 'to': 'n8', 'time': 10 },
    //   { 'from': 'n29', 'to': 'n2', 'time': 46 },
    //   { 'from': 'n29', 'to': 'n9', 'time': 46 },
    //   { 'from': 'n29', 'to': 'n11', 'time': 46 },
    //   { 'from': 'n29', 'to': 'n12', 'time': 46 },
    //   { 'from': 'n12', 'to': 'n9', 'time': 46 },
    //   { 'from': 'n29', 'to': 'n10', 'time': 46 },
    //   { 'from': 'n3', 'to': 'n22', 'time': 23 },
    //   { 'from': 'n17', 'to': 'n34', 'time': 49 },
    //   { 'from': 'n17', 'to': 'n13', 'time': 49 },
    //   { 'from': 'n28', 'to': 'n38', 'time': 24 },
    //   { 'from': 'n31', 'to': 'n36', 'time': 9 },
    //   { 'from': 'n17', 'to': 'n37', 'time': 63 },
    //   { 'from': 'n6', 'to': 'n15', 'time': 50 },
    //   { 'from': 'n6', 'to': 'n10', 'time': 107 },
    //   { 'from': 'n10', 'to': 'n34', 'time': 107 },
    //   { 'from': 'n10', 'to': 'n31', 'time': 38 },
    //   { 'from': 'n24', 'to': 'n20', 'time': 29 },
    //   { 'from': 'n24', 'to': 'n16', 'time': 89 },
    //   { 'from': 'n24', 'to': 'n17', 'time': 19 },
    //   { 'from': 'n24', 'to': 'n19', 'time': 29 },
    //   { 'from': 'n19', 'to': 'n18', 'time': 99 },
    //   { 'from': 'n11', 'to': 'n23', 'time': 64 },
    //   { 'from': 'n17', 'to': 'n4', 'time': 55 },
    //   { 'from': 'n13', 'to': 'n13', 'time': 34 },
    //   { 'from': 'n17', 'to': 'n34', 'time': 56 },
    //   { 'from': 'n8', 'to': 'n25', 'time': 43 },
    //   { 'from': 'n3', 'to': 'n5', 'time': 107 },
    //   { 'from': 'n40', 'to': 'n24', 'time': 49 },
    //   { 'from': 'n40', 'to': 'n20', 'time': 20 },
    //   { 'from': 'n40', 'to': 'n31', 'time': 20 },
    //   { 'from': 'n34', 'to': 'n36', 'time': 5 },
    //   { 'from': 'n17', 'to': 'n28', 'time': 40 },
    //   { 'from': 'n4', 'to': 'n11', 'time': 101 },
    //   { 'from': 'n16', 'to': 'n6', 'time': 15 },
    //   { 'from': 'n16', 'to': 'n4', 'time': 34 },
    //   { 'from': 'n9', 'to': 'n8', 'time': 107 },
    //   { 'from': 'n15', 'to': 'n29', 'time': 61 },
    //   { 'from': 'n35', 'to': 'n4', 'time': 11 },
    //   { 'from': 'n3', 'to': 'n29', 'time': 31 },
    //   { 'from': 'n4', 'to': 'n11', 'time': 37 },
    //   { 'from': 'n35', 'to': 'n32', 'time': 102 },
    //   { 'from': 'n20', 'to': 'n3', 'time': 104 },
    //   { 'from': 'n20', 'to': 'n33', 'time': 104 },
    //   { 'from': 'n32', 'to': 'n27', 'time': 22 },
    //   { 'from': 'n25', 'to': 'n27', 'time': 88 },
    //   { 'from': 'n39', 'to': 'n7', 'time': 12 },
    //   { 'from': 'n39', 'to': 'n37', 'time': 12 },
    //   { 'from': 'n16', 'to': 'n2', 'time': 77 },
    //   { 'from': 'n33', 'to': 'n36', 'time': 120 },
    //   { 'from': 'n33', 'to': 'n31', 'time': 200 },
    //   { 'from': 'n33', 'to': 'n39', 'time': 20 },
    //   { 'from': 'n1', 'to': 'n35', 'time': 61 },
    //   { 'from': 'n31', 'to': 'n29', 'time': 47 },
    //   { 'from': 'n31', 'to': 'n40', 'time': 27 },
    //   { 'from': 'n13', 'to': 'n24', 'time': 26 },
    //   { 'from': 'n9', 'to': 'n24', 'time': 50 },
    // ];
    let initialData = [
      {
        'from': 'n0',
        'to': 'n1',
        'time': 82,
      },
      {
        'from': 'n2',
        'to': 'n0',
        'time': 94,
      },
      {
        'from': 'n2',
        'to': 'n3',
        'time': 100,
      },
      {
        'from': 'n5',
        'to': 'n6',
        'time': 36,
      },
      {
        'from': 'n2',
        'to': 'n5',
        'time': 89,
      },
      {
        'from': 'n2',
        'to': 'n7',
        'time': 89,
      },
      {
        'from': 'n8',
        'to': 'n9',
        'time': 58,
      },
      {
        'from': 'n8',
        'to': 'n25',
        'time': 98,
      },
      {
        'from': 'n2',
        'to': 'n8',
        'time': 89,
      },
      {
        'from': 'n10',
        'to': 'n11',
        'time': 16,
      },
      {
        'from': 'n2',
        'to': 'n10',
        'time': 89,
      },
      {
        'from': 'n12',
        'to': 'n13',
        'time': 58,
      },
      {
        'from': 'n2',
        'to': 'n12',
        'time': 89,
      },
      {
        'from': 'n9',
        'to': 'n14',
        'time': 59,
      },
      {
        'from': 'n2',
        'to': 'n9',
        'time': 89,
      },
      {
        'from': 'n7',
        'to': 'n10',
        'time': 58,
      },
      {
        'from': 'n1',
        'to': 'n14',
        'time': 53,
      },
      {
        'from': 'n15',
        'to': 'n16',
        'time': 54,
      },
      {
        'from': 'n0',
        'to': 'n15',
        'time': 82,
      },
      {
        'from': 'n17',
        'to': 'n18',
        'time': 51,
      },
      {
        'from': 'n0',
        'to': 'n17',
        'time': 82,
      },
      {
        'from': 'n19',
        'to': 'n20',
        'time': 47,
      },
      {
        'from': 'n0',
        'to': 'n19',
        'time': 0,
      },
      {
        'from': 'n21',
        'to': 'n22',
        'time': 49,
      },
      {
        'from': 'n2',
        'to': 'n21',
        'time': 78,
      },
      {
        'from': 'n23',
        'to': 'n24',
        'time': 47,
      },
      {
        'from': 'n2',
        'to': 'n23',
        'time': 78,
      },
      {
        'from': 'n25',
        'to': 'n26',
        'time': 72,
      },
      {
        'from': 'n27',
        'to': 'n28',
        'time': 42,
      },
      {
        'from': 'n25',
        'to': 'n27',
        'time': 72,
      },
      {
        'from': 'n29',
        'to': 'n14',
        'time': 43,
      },
      {
        'from': 'n25',
        'to': 'n29',
        'time': 72,
      },
      {
        'from': 'n14',
        'to': 'n26',
        'time': 40,
      },
      {
        'from': 'n25',
        'to': 'n14',
        'time': 72,
      },
      {
        'from': 'n16',
        'to': 'n30',
        'time': 42,
      },
      {
        'from': 'n18',
        'to': 'n16',
        'time': 72,
      },
      {
        'from': 'n4',
        'to': 'n27',
        'time': 42,
      },
      {
        'from': 'n3',
        'to': 'n4',
        'time': 0,
      },
      {
        'from': 'n31',
        'to': 'n32',
        'time': 1,
      },
      {
        'from': 'n18',
        'to': 'n31',
        'time': 71,
      },
      {
        'from': 'n33',
        'to': 'n34',
        'time': 37,
      },
      {
        'from': 'n22',
        'to': 'n33',
        'time': 71,
      },
      {
        'from': 'n13',
        'to': 'n4',
        'time': 39,
      },
      {
        'from': 'n22',
        'to': 'n13',
        'time': 71,
      },
      {
        'from': 'n35',
        'to': 'n10',
        'time': 19,
      },
      {
        'from': 'n0',
        'to': 'n35',
        'time': 67,
      },
      {
        'from': 'n36',
        'to': 'n32',
        'time': 36,
      },
      {
        'from': 'n22',
        'to': 'n36',
        'time': 66,
      },
      {
        'from': 'n37',
        'to': 'n38',
        'time': 36,
      },
      {
        'from': 'n22',
        'to': 'n37',
        'time': 66,
      },
      {
        'from': 'n34',
        'to': 'n39',
        'time': 34,
      },
      {
        'from': 'n41',
        'to': 'n26',
        'time': 33,
      },
      {
        'from': 'n25',
        'to': 'n41',
        'time': 63,
      },
      {
        'from': 'n42',
        'to': 'n43',
        'time': 34,
      },
      {
        'from': 'n39',
        'to': 'n42',
        'time': 62,
      },
      {
        'from': 'n28',
        'to': 'n5',
        'time': 32,
      },
      {
        'from': 'n47',
        'to': 'n48',
        'time': 60,
      },
      {
        'from': 'n6',
        'to': 'n47',
        'time': 31,
      },
      {
        'from': 'n35',
        'to': 'n51',
        'time': 65,
      },
      {
        'from': 'n51',
        'to': 'n36',
        'time': 19,
      },
    ];
    const shortestPaths = calculateShortestPaths(initialData, baseNode);
    const nodes = Array.from(new Set([...initialData.map((curr) => curr.from), ...initialData.map((curr) => curr.to)])).map(n => ({
      id: n,
      time: shortestPaths[n],
      level: this.getLevel(shortestPaths, n),
    }));
    console.table(initialData);

    const cGap = this.circleWidth + 60;
    const levelHeight = 100;

    this.createHeadNode(nodes.find(n => n.id === baseNode));

    const levels = [1,2,3,4,5,6,7];
    levels.forEach(level => {
      const levelNodes = nodes.filter(n => n.level === level && n.id !== baseNode);
      const leftOffsetOfThisLevel = (this.width - (levelNodes.length * cGap - cGap)) / 2;
      let i = 0;
      for (const n of levelNodes) {
        let y = levelHeight + level * levelHeight;

        this.mainG
          .append('circle')
          .attr('id', n.id)
          .attr('r', this.circleWidth / 2)
          .attr('cx', leftOffsetOfThisLevel + i * cGap)
          .attr('cy', y + this.circleWidth / 2)
          .style('fill', '#fb6a4a');
        this.mainG
          .append('text')
          .text(n.id)
          .attr('fill', 'black')
          .attr('id', n.id + '-label')
          .attr('x', leftOffsetOfThisLevel + i * cGap)
          .attr('y', y + this.circleWidth / 2)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'central');
        i++;
      }
    });

    const levelsObject = {
      0: [baseNode],
      1: nodes.filter(d => d.level === 1 && d.id !== baseNode).map(d => d.id),
      2: nodes.filter(d => d.level === 2).map(d => d.id),
      3: nodes.filter(d => d.level === 3).map(d => d.id),
      4: nodes.filter(d => d.level === 4).map(d => d.id),
      5: nodes.filter(d => d.level === 5).map(d => d.id),
      6: nodes.filter(d => d.level === 6).map(d => d.id),
      7: nodes.filter(d => d.level === 7).map(d => d.id),
    };

    this.createLinks(initialData, levelsObject, nodes);
    this.mainG.selectAll('circle').raise();
    this.mainG.selectAll('text').raise();
  }

  private getLevel(shortestPaths: object, n: any): number {
    const time = shortestPaths[n];
    if (time < 50) {
      return 1;
    } else if (time < 100) {
      return 2;
    } else if (time < 150) {
      return 3;
    } else if (time < 200) {
      return 4;
    } else if (time < 250) {
      return 5;
    } else if (time < 300) {
      return 6;
    } else {
      return 7;
    }
  }

  private createHeadNode(node: { level: number; id: string; time: number }): void {
    this.mainG
      .append('circle')
      .attr('id', node.id)
      .attr('r', this.circleWidth / 2)
      .attr('cx', this.width / 2)
      .attr('cy', this.circleWidth / 2)
      .style('fill', 'var(--base-primary)');
    this.mainG
      .append('text')
      .text(node.id)
      .attr('fill', 'black')
      .attr('id', node.id + '-label')
      .attr('x', this.width / 2)
      .attr('y', this.circleWidth / 2)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'central');
  }

  private createLinks(data: any[], levelsObject: any, nodes: any[]) {
    const links: any[] = [];
    data
      .forEach((d, i: number) => {
        const source = this.mainG.select('#' + d.from).node().getBBox();
        const target = this.mainG.select('#' + d.to).node().getBBox();
        let sourceX: number;
        let sourceY: number;
        let targetX: number;
        let targetY: number;

        // if they are on same level, then just draw a straight line
        if (source.y === target.y) {
          if (source.x < target.x) {
            // rect1 is to the left of rect2
            sourceX = source.x + source.width;
            sourceY = source.y + source.height / 2;
            targetX = target.x;
            targetY = target.y + target.height / 2;
          } else if (source.x > target.x) {
            // rect1 is to the right of rect2
            sourceX = source.x;
            sourceY = target.y + source.height / 2;
            targetX = target.x + target.width;
            targetY = target.y + target.height / 2;
          }
        } else {
          if (source.y < target.y) {
            sourceX = source.x + source.width / 2;
            sourceY = source.y + source.height;
            targetX = target.x + target.width / 2;
            targetY = target.y;
          } else {
            sourceX = source.x + source.width / 2;
            sourceY = source.y;
            targetX = target.x + target.width / 2;
            targetY = target.y + target.height;
          }
        }

        // Calculate the x and y distances between the source and target nodes
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;

        // Calculate the midpoint between the source and target nodes
        const midX = (sourceX + targetX) / 2;
        const midY = (sourceY + targetY) / 2;

        const context = d3.path();
        // If the source and target nodes are on the same level but not near each other, add a curve to the link path
        const level = nodes.find(n => n.id === d.to).level;
        const currentNodePosition = levelsObject[level].indexOf(d.to);

        if (dy === 0 && levelsObject[level][currentNodePosition - 1] !== d.from && levelsObject[level][currentNodePosition + 1] !== d.from) {
          this.createQuadraticCurve(dx, context, sourceX, sourceY, midX, source, targetX, targetY);
        } else {
          context.moveTo(sourceX, sourceY);
          context.lineTo(targetX, targetY);
        }
        links.push(context.toString());
        this.mainG
          .append('path')
          .attr('d', links[i])
          .attr('stroke', 'var(--base-tertiary)')
          .attr('stroke-width', '1px')
          .attr('fill', 'none');
      });
  }

  private createQuadraticCurve(dx: number, context: Path, sourceX: number, sourceY: number, midX: number, source: DOMRect, targetX: number, targetY: number): void {
    const offset = Math.abs(dx) / 2;
    const controlPointY = sourceY - (source.height / 2) * 3.5;
    const halfWidth = source.width / 2;
    context.moveTo(source.x + halfWidth, source.y + (source.height / 2));
    context.quadraticCurveTo(midX, controlPointY, (midX + (offset + halfWidth) * (sourceX > targetX ? -1 : 1)), sourceY);
  }

  private initDiagram(data: any[]): void {
    const graph = graphviz(this.diagramRef.nativeElement)
      .renderDot(`
      digraph {
# layout= specifies a layout engine:
#   circo — for circular layout of graphs
#   dot — for drawing directed graphs (the default)
#   fdp — for drawing undirected graphs
#   neato — for drawing undirected graphs
#   osage — for drawing large undirected graphs
#   twopi — for radial layouts of graphs
layout=dot
bgcolor="none"
   graph [ratio="compress"];
   
# Default node attributes
node [
  colorscheme = reds9
  shape = circle
  style = "filled"
  color = black
  fillcolor = "0 0 1"
  fontsize=8
  label=""
  width=0.23
]

edge [
  colorscheme = rdylbu9
  penwidth = 0.75
  fontsize=8
  arrowhead=standard
  color="#727272"
]

# Rank
{rank=source; 2}
{rank=sink; 43}
{rank=same; 3 0 5 7 9 8 12 10}
{rank=same; 21 23 25 15 1 17 19 4 35 29 26 27 14 13}
{rank=same; 41 22 6 24 16 18 51 20 11}
{rank=same; 33 37 36 28 31 30 47}
{rank=same; 34 32 38 48}
{rank=same; 39 42}

43 [fillcolor=9, color=9]
42, 39 [fillcolor=7, color=7]
34, 32, 38, 48 [fillcolor=5, color=5]
33, 37, 36, 28, 31, 30, 47 [fillcolor=4, color=4]
41, 22, 6, 24, 16, 18, 51, 20, 11 [fillcolor=3, color=3]
21, 23, 25, 15, 1, 17, 19, 4, 35, 29, 26, 27, 14, 13 [fillcolor=2, color=2]
3, 0, 5, 7, 9, 8, 12, 10 [fillcolor=1, color=1]
2 [fillcolor="#211F25", color="#927FB9"]


# Edges
0 -> 1 [weight=82]
2 -> 0 [weight=94]
2 -> 3 [weight=100]
5 -> 6 [weight=36]
2 -> 5 [weight=89]
2 -> 7 [weight=89]
8 -> 9 [weight=58]
8 -> 25 [weight=98]
2 -> 8 [weight=89]
10 -> 11 [weight=16.]
2 -> 10 [weight=89]
12 -> 13 [weight=58]
2 -> 12 [weight=89]
9 -> 14 [weight=59]
2 -> 9 [weight=89]
7 -> 10 [weight=58]
1 -> 14 [weight=53]
15 -> 16 [weight=54]
0 -> 15 [weight=82]
17 -> 18 [weight=51]
0 -> 17 [weight=82]
19 -> 20 [weight=47]
0 -> 19  [weight=78]
21 -> 22 [weight=49]
2 -> 21 [weight=78]
23 -> 24 [weight=47]
2 -> 23 [weight=78]
25 -> 26 [weight=72]
27 -> 28 [weight=42]
25 -> 27 [weight=72]
29 -> 14 [weight=43]
25 -> 29 [weight=72]
14 -> 26 [weight=40]
25 -> 14 [weight=72]
16 -> 30 [weight=42]
18 -> 16 [weight=72]
4 -> 27 [weight=42]
3 -> 4  [weight=72]
31 -> 32 [weight=1]
18 -> 31 [weight=71]
33 -> 34 [weight=37]
22 -> 33 [weight=71]
13 -> 4 [weight=39]
22 -> 13 [weight=71]
35 -> 10 [weight=19]
0 -> 35 [weight=67]
36 -> 32 [weight=36]
22 -> 36 [weight=66]
37 -> 38 [weight=36]
22 -> 37 [weight=66]
34 -> 39 [weight=34]
41 -> 26 [weight=33]
25 -> 41 [weight=63]
42 -> 43 [weight=34]
39 -> 42 [weight=62]
28 -> 5 [weight=32]
47 -> 48 [weight=60]
6 -> 47 [weight=31]
35 -> 51 [weight=65]
51 -> 36 [weight=19]
}
      `);
  }
}
