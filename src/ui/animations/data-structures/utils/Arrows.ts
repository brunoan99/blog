export type ArrowProps = {
  id: string;
  arrowWidth: number;
  arrowType: "left" | "right" | "down" | "up" | "root";
  top: number;
  left: number;
  nodeHeight: number;
  heightPercentage?: number;
  nodeWidth: number;
}

type ArrowBuildProps = Omit<ArrowProps, "arrowType">;

const arrowLeft = ({ id, arrowWidth, top, left, nodeWidth, nodeHeight, heightPercentage }: ArrowBuildProps): SVGSVGElement => {
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  arrow.id = id;
  arrow.style.width = `${arrowWidth}px`;
  arrow.style.height = "1px";
  arrow.style.flexShrink = "0";
  arrow.style.overflow = "visible";
  arrow.style.top = `${top}px`
  arrow.style.left = `${left + nodeWidth}px`
  arrow.style.position = "absolute";
  arrow.style.userSelect = "none";

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

  const cy = nodeHeight * (heightPercentage || 0.8);
  const ny = arrowWidth - 14;

  line.setAttribute('x1', `${arrowWidth + 30}`);
  line.setAttribute('y1', `${cy}`);
  line.setAttribute('x2', `${8}`);
  line.setAttribute('y2', `${cy}`);
  line.setAttribute("stroke", "#674d3d");
  line.setAttribute("stroke-width", "1.5");
  line.setAttribute("fill", "#674d3d");

  poly.setAttribute("points", `2,${cy} 8, ${cy - 4} 8, ${cy + 4} `);
  poly.setAttribute("stroke", "#674d3d");
  poly.setAttribute("stroke-width", "1.5");
  poly.setAttribute("fill", "#674d3d");

  arrow.appendChild(line);
  arrow.appendChild(poly);

  return arrow;
}

const arrowRight = ({ id, arrowWidth, top, left, nodeWidth, nodeHeight, heightPercentage }: ArrowBuildProps): SVGSVGElement => {
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  arrow.id = id;
  arrow.style.width = `${arrowWidth}px`;
  arrow.style.height = "1px";
  arrow.style.flexShrink = "0";
  arrow.style.overflow = "visible";
  arrow.style.top = `${top}px`
  arrow.style.left = `${left + nodeWidth + 4}px`
  arrow.style.position = "absolute";
  arrow.style.userSelect = "none";

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

  const cy = nodeHeight * (heightPercentage || 0.8);

  line.setAttribute('x1', `${-30}`);
  line.setAttribute('y1', `${cy}`);
  line.setAttribute('x2', `${arrowWidth - 8}`);
  line.setAttribute('y2', `${cy}`);
  line.setAttribute("stroke", "#674d3d");
  line.setAttribute("stroke-width", "1.5");
  line.setAttribute("fill", "#674d3d");

  poly.setAttribute('points',
    `${arrowWidth - 1},${cy} ${arrowWidth - 8},${cy - 4} ${arrowWidth - 8},${cy + 4}`
  );
  poly.setAttribute("stroke", "#674d3d");
  poly.setAttribute("stroke-width", "1.5");
  poly.setAttribute("fill", "#674d3d");

  arrow.appendChild(line);
  arrow.appendChild(poly);

  return arrow;
}

const arrowDown = ({ id, arrowWidth, top, left, nodeWidth, nodeHeight, heightPercentage }: ArrowBuildProps): SVGSVGElement => {
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const cy = nodeHeight * (heightPercentage || 0.8);
  arrow.id = id;
  arrow.style.width = `${arrowWidth}px`;
  arrow.style.height = "1px";
  arrow.style.flexShrink = "0";
  arrow.style.overflow = "visible";
  arrow.style.top = `${top + cy}px`
  arrow.style.left = `${left + nodeWidth * 0.25}px`
  arrow.style.position = "absolute";
  arrow.style.userSelect = "none";


  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

  const x = nodeWidth / 2;
  const headLen = 8;
  const remainingHeight = nodeHeight - cy;
  const totalDistance = remainingHeight + arrowWidth;
  const lineEndY = totalDistance - headLen;

  line.setAttribute('x1', `${x}`);
  line.setAttribute('y1', `${0}`);
  line.setAttribute('x2', `${x}`);
  line.setAttribute('y2', `${lineEndY}`);
  line.setAttribute('fill', '#674d3d');
  line.setAttribute('stroke', '#674d3d');
  line.setAttribute('stroke-width', '1.5');


  poly.setAttribute('points', `${x},${totalDistance} ${x - 4},${lineEndY} ${x + 4},${lineEndY}`);
  poly.setAttribute('fill', '#674d3d');
  poly.setAttribute('stroke', '#674d3d');
  poly.setAttribute('stroke-width', '1.5');

  arrow.appendChild(line);
  arrow.appendChild(poly);

  return arrow
}

const arrowUp = ({ id, arrowWidth, top, left, nodeWidth, nodeHeight, heightPercentage }: ArrowBuildProps): SVGSVGElement => {
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const he = nodeHeight * (heightPercentage || 0.8);
  arrow.id = id;
  arrow.style.width = `${arrowWidth}px`;
  arrow.style.height = "1px";
  arrow.style.flexShrink = "0";
  arrow.style.overflow = "visible";
  arrow.style.top = `${top + he}px`
  arrow.style.left = `${left + nodeWidth * 0.25}px`
  arrow.style.position = "absolute";
  arrow.style.userSelect = "none";


  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

  const x = nodeWidth / 2;

  line.setAttribute('x1', `${x}`);
  line.setAttribute('y1', `${0}`);
  line.setAttribute('x2', `${x}`);
  line.setAttribute('y2', `${nodeHeight / 2 + 8}`);
  line.setAttribute('fill', '#674d3d');
  line.setAttribute('stroke', '#674d3d');
  line.setAttribute('stroke-width', '1.5');

  const n = -1 * (nodeHeight / 2 - 6 + 6) / 2;
  poly.setAttribute('points', `${x},${nodeHeight / 2 - 6 + n} ${x - 4},${nodeHeight / 2 + 8 - 6 + n} ${x + 4},${nodeHeight / 2 + 8 - 6 + n}`);
  poly.setAttribute('fill', '#674d3d');
  poly.setAttribute('stroke', '#674d3d');
  poly.setAttribute('stroke-width', '1.5');

  arrow.appendChild(line);
  arrow.appendChild(poly);

  return arrow
}


const arrowRoot = ({ id, arrowWidth, top, left, nodeWidth, nodeHeight, heightPercentage }: ArrowBuildProps): SVGSVGElement => {
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  arrow.id = id;
  arrow.style.width = `${arrowWidth}px`;
  arrow.style.height = "1px";
  arrow.style.flexShrink = "0";
  arrow.style.overflow = "visible";
  arrow.style.top = `${top}px`
  arrow.style.left = `${left + nodeWidth + 4}px`
  arrow.style.position = "absolute";
  arrow.style.userSelect = "none";

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

  const cy = nodeHeight * (heightPercentage || 0.8);

  line.setAttribute('x1', `${0}`);
  line.setAttribute('y1', `${cy}`);
  line.setAttribute('x2', `${arrowWidth - 8}`);
  line.setAttribute('y2', `${cy}`);
  line.setAttribute("stroke", "#674d3d");
  line.setAttribute("stroke-width", "1.5");
  line.setAttribute("fill", "#674d3d");

  poly.setAttribute('points',
    `${arrowWidth - 3},${cy} ${arrowWidth - 10},${cy - 4} ${arrowWidth - 10},${cy + 4}`
  );
  poly.setAttribute("stroke", "#674d3d");
  poly.setAttribute("stroke-width", "1.5");
  poly.setAttribute("fill", "#674d3d");


  arrow.appendChild(line);
  arrow.appendChild(poly);

  // add a text above the arrow with label "root"
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', `${0}`);
  text.setAttribute('y', `${cy - 4}`);
  text.setAttribute('font-size', '18px');
  text.setAttribute('fill', '#674d3d');
  text.textContent = 'root';
  text.style.userSelect = "none";

  arrow.appendChild(text);

  return arrow;
}

const createArrow = ({
  id,
  arrowWidth,
  arrowType,
  top,
  left,
  nodeWidth,
  heightPercentage,
  nodeHeight
}: ArrowProps): SVGSVGElement => {
  switch (arrowType) {
    case "left":
      return arrowLeft({ id, arrowWidth, top, left, nodeWidth, nodeHeight, heightPercentage });
    case "right":
      return arrowRight({ id, arrowWidth, top, left, nodeWidth, nodeHeight, heightPercentage });
    case "down":
      return arrowDown({ id, arrowWidth, top, left, nodeWidth, nodeHeight, heightPercentage });
    case "up":
      return arrowUp({ id, arrowWidth, top, left, nodeWidth, nodeHeight, heightPercentage });
    case "root":
      return arrowRoot({ id, arrowWidth, top, left, nodeWidth, nodeHeight, heightPercentage });
    default:
      return new SVGSVGElement();
  }
}

type Point = { x: number, y: number };

type ArrowBetweenPointsProps = {
  id: string;
  p1: Point;
  p2: Point;
  color?: string;
}
const createArrowBetweenPoints = ({
  id,
  p1,
  p2,
  color = "#674d3d",
}: ArrowBetweenPointsProps): SVGSVGElement => {
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); arrow.id = id;
  arrow.style.overflow = "visible";
  arrow.style.position = "absolute";
  arrow.style.top = `${p1.y}px`;
  arrow.style.left = `${p1.x}px`;
  arrow.style.userSelect = "none";
  arrow.style.pointerEvents = "none";

  const rx = p2.x - p1.x;
  const ry = p2.y - p1.y;
  const length = Math.sqrt(rx * rx + ry * ry);

  if (length === 0) return arrow;

  // Unit vector along the arrow direction
  const ux = rx / length;
  const uy = ry / length;

  // Arrowhead size
  const headLen = 10;
  const headWidth = 5;

  // End point slightly before p2 so the line doesn't overshoot the polygon
  const lineEndX = rx - ux * headLen;
  const lineEndY = ry - uy * headLen;

  // Perpendicular unit vector (for arrowhead wings)
  const px = -uy;
  const py = ux; const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", `${0}`);
  line.setAttribute("y1", `${0}`);
  line.setAttribute("x2", `${lineEndX}`);
  line.setAttribute("y2", `${lineEndY}`);
  line.setAttribute("stroke", color);
  line.setAttribute("stroke-width", "1.5");

  const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

  poly.setAttribute(
    "points",
    `${rx},${ry} ${lineEndX + px * headWidth},${lineEndY + py * headWidth} ${lineEndX - px * headWidth},${lineEndY - py * headWidth}`
  );
  poly.setAttribute("fill", color);
  poly.setAttribute("stroke", color);
  poly.setAttribute("stroke-width", "1.5");

  arrow.appendChild(line);
  arrow.appendChild(poly);

  return arrow;
}

export {
  createArrow,
  createArrowBetweenPoints,
};
