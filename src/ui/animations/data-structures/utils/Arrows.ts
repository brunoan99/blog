export type ArrowProps = {
  id: string;
  arrowWidth: number;
  arrowType: "left" | "right" | "down" | "root";
  top: number;
  left: number;
  nodeHeight: number;
  nodeWidth: number;
}

type ArrowBuildProps = Omit<ArrowProps, "arrowType">;

const arrowLeft = ({ id, arrowWidth, top, left, nodeWidth, nodeHeight }: ArrowBuildProps): SVGSVGElement => {
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

  const cy = nodeHeight * 0.8;
  const ny = arrowWidth - 14;

  line.setAttribute('x1', `${arrowWidth + 30}`);
  line.setAttribute('y1', `${ny + 30}`);
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

const arrowRight = ({ id, arrowWidth, top, left, nodeWidth, nodeHeight }: ArrowBuildProps): SVGSVGElement => {
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

  const cy = nodeHeight * 0.8;

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

const arrowDown = ({ id, arrowWidth, top, left, nodeWidth, nodeHeight }: ArrowBuildProps): SVGSVGElement => {
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  arrow.id = id;
  arrow.style.width = `${arrowWidth}px`;
  arrow.style.height = "1px";
  arrow.style.flexShrink = "0";
  arrow.style.overflow = "visible";
  arrow.style.top = `${top + nodeWidth * 0.8}px`
  arrow.style.left = `${left + nodeWidth * 0.25}px`
  arrow.style.position = "absolute";
  arrow.style.userSelect = "none";


  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

  const x = nodeWidth / 2;

  line.setAttribute('x1', `${x}`);
  line.setAttribute('y1', `${0}`);
  line.setAttribute('x2', `${x}`);
  line.setAttribute('y2', `${nodeHeight / 2 - 8 + 8}`);
  line.setAttribute('fill', '#674d3d');
  line.setAttribute('stroke', '#674d3d');
  line.setAttribute('stroke-width', '1.5');


  poly.setAttribute('points', `${x},${nodeHeight / 2 + 6} ${x - 4},${nodeHeight / 2 - 8 + 6} ${x + 4},${nodeHeight / 2 - 8 + 6}`);
  poly.setAttribute('fill', '#674d3d');
  poly.setAttribute('stroke', '#674d3d');
  poly.setAttribute('stroke-width', '1.5');

  arrow.appendChild(line);
  arrow.appendChild(poly);

  return arrow
}


const arrowRoot = ({ id, arrowWidth, top, left, nodeWidth, nodeHeight }: ArrowBuildProps): SVGSVGElement => {
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

  const cy = nodeHeight * 0.8;

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
  nodeHeight
}: ArrowProps): SVGSVGElement => {
  switch (arrowType) {
    case "left":
      return arrowLeft({ id, arrowWidth, top, left, nodeWidth, nodeHeight });
    case "right":
      return arrowRight({ id, arrowWidth, top, left, nodeWidth, nodeHeight });
    case "down":
      return arrowDown({ id, arrowWidth, top, left, nodeWidth, nodeHeight });
    case "root":
      return arrowRoot({ id, arrowWidth, top, left, nodeWidth, nodeHeight });
    default:
      return new SVGSVGElement();
  }
}

export {
  createArrow
};
