import { animate, JSAnimation } from "animejs";
import { createNodeWithPointer } from "./utils/NodeWithPointer";
import { createArrow } from "./utils/Arrows";
import { getElem } from "./utils/HtmlElement";

type Sizes = {
  canvasWidth: number;
  canvasHeight: number;
  nodeLimitPerRow: number;
  nodeSize: number;
  nodeOffsetTop: number;
  nodeOffsetPerNode: number;
  nodeOffsetLeft: number;
  nodeOffsetRow: number;
  nodeAmount: number;
  arrowWidth: number;
  rowSize: number;
};

type Elements = {
  canvas: HTMLElement;
  nodes: HTMLElement[];
  arrows: SVGSVGElement[];
  cursor?: HTMLElement;
};

type Tags = {
  nodesClassName: string;
};

type PositionInfos = {
  nodeIndex: number;
  inRowIndex: number;
  rowIndex: number;
  isRowEven: boolean;
  isLastInRow: boolean;
  isLastNode: boolean;
}

type ClickAction = "insert" | "remove";

export const calculatePositionInfosByIndex = (index: number, sizes: Sizes): PositionInfos => {
  let rowIndex = Math.floor(index / sizes.nodeLimitPerRow);
  let isRowEven = rowIndex % 2 == 0;
  let inRowIndex = index % sizes.nodeLimitPerRow;
  let isLastNode = index == sizes.nodeAmount;
  let isLastInRow = inRowIndex == sizes.nodeLimitPerRow - 1;

  return {
    nodeIndex: index,
    inRowIndex,
    rowIndex,
    isRowEven,
    isLastInRow,
    isLastNode,
  }
}

export const calculateClickActionByEvent = (event: PointerEvent): ClickAction => {
  let target = event.target as HTMLElement;
  switch (target.tagName) {
    case "svg":
    case "line":
    case "polygon":
    case "text":
    case "path":
      return "insert" as ClickAction;
    case "div":
    case "DIV":
      if (target.className.includes("upper") || target.className.includes("bottom")) return "remove" as ClickAction;
      if (target.className.includes("node")) return "remove" as ClickAction;
      if (target.id.includes("cursor")) return "insert" as ClickAction;
      if (target.id.includes("canvas")) return "insert" as ClickAction;
    default:
      console.log(target);
      throw new Error("Unknown target element");
  }
}

const calculateNodeIndexByArrowPosition = (target: HTMLElement, elements: Elements): number => {
  let arrowId = target.id;
  let arrowPosition = elements.arrows.findIndex(a => a.id == arrowId);
  return arrowPosition;
}

export const calculateNodeIndexByNodePosition = (target: HTMLElement, elements: Elements): number => {
  if (target.id.includes("upper") || target.id.includes("bottom")) target = target.parentElement as HTMLElement;
  let nodeId = target.id;
  let nodePosition = elements.nodes.findIndex(n => n.id == nodeId);
  return nodePosition;
}

const calculateNodeIndexByCanvasPosition = (event: PointerEvent, sizes: Sizes): number => {
  let clickX = event.offsetX;
  let clickY = event.offsetY;

  let rowStep = sizes.nodeOffsetPerNode + sizes.nodeOffsetRow / 2;
  let colStep = sizes.nodeOffsetPerNode + sizes.arrowWidth / 2;

  let row = Math.round((clickY - sizes.nodeOffsetTop) / rowStep);
  row = Math.max(row, 0);

  let col = Math.round((clickX - sizes.nodeOffsetLeft) / colStep);
  col = Math.max(col, 0);

  if (row % 2 === 1) {
    col = sizes.nodeLimitPerRow - col - 1;
  }

  // if (row % 2 == 1) index = row * sizes.nodeLimitPerRow + (sizes.nodeLimitPerRow - col - 1);
  let index = row * sizes.nodeLimitPerRow + col;
  index = Math.min(index, sizes.nodeAmount);

  return index;
}

export const calculateNodeIndexByEvent = (event: PointerEvent, sizes: Sizes, elements: Elements): number => {
  let target = event.target as HTMLElement;
  switch (target.tagName) {
    case "line":
    case "text":
    case "polygon":
    case "path":
      target = target.parentElement as HTMLElement;
      break;
  }

  switch (target.tagName) {
    case "svg":
      return calculateNodeIndexByArrowPosition(target, elements);
    case "div":
    case "DIV":
      return calculateNodeIndexByCanvasPosition(event, sizes);
    case "default":
      console.log(target);
      throw new Error("Unknown target element");
  }
  throw new Error("Unable to calculate node index");
}

const calculateNodeLeftOffset = (inRowIndex: number, isRowEven: boolean, sizes: Sizes) => {
  if (isRowEven) {
    return sizes.nodeOffsetLeft + (inRowIndex * (sizes.nodeOffsetPerNode + sizes.arrowWidth))
  }
  return sizes.nodeOffsetLeft + ((sizes.nodeLimitPerRow - inRowIndex - 1) * (sizes.nodeOffsetPerNode + sizes.arrowWidth))
}

const calculateNodeTopOffset = (rowIndex: number, sizes: Sizes) => {
  return sizes.nodeOffsetTop + (rowIndex * (sizes.nodeOffsetPerNode + sizes.nodeOffsetRow));
}

const calculateArrowLeftOffset = (inRowIndex: number, isRowEven: boolean, isLastInRow: boolean, sizes: Sizes) => {
  let endOffset = isLastInRow && !isRowEven ? sizes.arrowWidth + sizes.nodeSize / 2 : 0;
  if (isRowEven) {
    return sizes.nodeOffsetLeft + (inRowIndex * (sizes.nodeOffsetPerNode + sizes.arrowWidth)) + endOffset;
  }
  return sizes.nodeOffsetLeft + ((sizes.nodeLimitPerRow - inRowIndex - 2) * (sizes.nodeOffsetPerNode + sizes.arrowWidth)) + endOffset;
}

const calculateArrowTopOffset = (rowIndex: number, sizes: Sizes) => {
  return sizes.nodeOffsetTop + (rowIndex * (sizes.nodeOffsetPerNode + sizes.nodeOffsetRow));
}

export const createNodeAt = (elements: Elements, tags: Tags, sizes: Sizes, nodeIndex: number, nodeValue: number) => {
  let rowIndex = Math.floor(nodeIndex / sizes.nodeLimitPerRow);
  let isRowEven = rowIndex % 2 == 0;
  let inRowIndex = nodeIndex % sizes.nodeLimitPerRow;
  let isLastNode = nodeIndex == sizes.nodeAmount;

  let topOffset = `${calculateNodeTopOffset(rowIndex, sizes)}px`;
  let leftOffset = `${calculateNodeLeftOffset(inRowIndex, isRowEven, sizes)}px`;

  let node = createNodeWithPointer({
    id: `${tags.nodesClassName}-${(nodeValue + 1).toString()}`,
    className: tags.nodesClassName,
    style: {
      size: sizes.nodeSize,
      top: topOffset,
      left: leftOffset,
      backgroundColor: "#ededed",
    },
    innitialValue: `${nodeValue}`,
    innitialPointerValue: isLastNode ? "null" : "next",
  });

  elements.nodes.splice(nodeIndex, 0, node);
  elements.canvas.appendChild(node);

  if (isLastNode && nodeIndex != 0)
    linkPreviousNodeToCreated(elements, nodeIndex - 1);
}

export const createArrowAtEnd = (elements: Elements, tags: Tags, sizes: Sizes) => {
  let nodeIndex = sizes.nodeAmount - 1;
  let rowIndex = Math.floor(nodeIndex / sizes.nodeLimitPerRow);
  let isRowEven = rowIndex % 2 == 0;
  let inRowIndex = nodeIndex % sizes.nodeLimitPerRow;
  let isLastInRow = inRowIndex == sizes.nodeLimitPerRow - 1;

  let topOffset = calculateArrowTopOffset(rowIndex, sizes);
  let leftOffset = calculateArrowLeftOffset(inRowIndex, isRowEven, isLastInRow, sizes);

  let arrow = createArrow({
    id: `${tags.nodesClassName}-arrow-${rowIndex}`,
    arrowWidth: sizes.arrowWidth,
    arrowType: isLastInRow ? "down" : (isRowEven ? "right" : "left"),
    top: topOffset,
    left: leftOffset,
    nodeHeight: sizes.nodeSize,
    nodeWidth: sizes.nodeSize,
  });

  elements.arrows.push(arrow);
  elements.canvas.appendChild(arrow);
}

export const linkPreviousNodeToCreated = (elements: Elements, nodeIndex: number) => {
  let nodeToUpdate = elements.nodes[nodeIndex];
  let nodeId = nodeToUpdate.id;
  let bottom = getElem<HTMLElement>(`#${nodeId}-bottom`);
  if (bottom.innerText == "null") {
    bottom.innerText = "next";
  }
}

export const removeNodeAt = (elements: Elements, nodeIndex: number) => {
  let nodeToRemove = elements.nodes[nodeIndex];

  if (nodeToRemove) {
    elements.canvas.removeChild(nodeToRemove);
    elements.nodes = elements.nodes.filter((v, i) => v.id != nodeToRemove.id);
  }

  if (nodeIndex == elements.nodes.length)
    unLinkPreviousNodeToRemoved(elements, nodeIndex - 1);
}

export const removeArrowAtEnd = (elements: Elements) => {
  let arrowToRemove = elements.arrows.pop();
  if (arrowToRemove && !arrowToRemove?.id.includes("root"))
    elements.canvas.removeChild(arrowToRemove);
}

export const unLinkPreviousNodeToRemoved = (elements: Elements, nodeIndex: number) => {
  let nodeToUpdate = elements.nodes[nodeIndex];
  if (!nodeToUpdate) return;

  let nodeId = nodeToUpdate.id;
  let bottom = getElem<HTMLElement>(`#${nodeId}-bottom`)
  if (bottom.innerText == "next") {
    bottom.innerText = "null";
  }
}

export const moveForward = (element: HTMLElement, newIndex: number, sizes: Sizes) => {
  let rowIndex = Math.floor(newIndex / sizes.nodeLimitPerRow);
  let isRowEven = rowIndex % 2 == 0;
  let inRowIndex = newIndex % sizes.nodeLimitPerRow;

  let topOffset = calculateNodeTopOffset(rowIndex, sizes);
  let leftOffset = calculateNodeLeftOffset(inRowIndex, isRowEven, sizes);
  element.style.left = `${leftOffset}px`;
  element.style.top = `${topOffset}px`;
}

export const moveBackward = (element: HTMLElement, newIndex: number, sizes: Sizes) => {
  let rowIndex = Math.floor(newIndex / sizes.nodeLimitPerRow);
  let isRowEven = rowIndex % 2 == 0;
  let inRowIndex = newIndex % sizes.nodeLimitPerRow;

  let topOffset = calculateNodeTopOffset(rowIndex, sizes);
  let leftOffset = calculateNodeLeftOffset(inRowIndex, isRowEven, sizes);
  element.style.left = `${leftOffset}px`;
  element.style.top = `${topOffset}px`;
}

export const expandCanvasIfNeeded = (elements: Elements, sizes: Sizes) => {
  const { canvasHeight, nodeAmount, nodeLimitPerRow, nodeOffsetRow, nodeSize, nodeOffsetTop } = sizes;

  // Adding a new node will start a new row if current nodes fill rows exactly
  const willStartNewRow = nodeAmount % nodeLimitPerRow === 0;

  if (willStartNewRow) {
    const nextRowIndex = Math.floor(nodeAmount / nodeLimitPerRow); // 0-based
    const requiredHeight = 2 * nodeOffsetTop + (nextRowIndex + 1) * (nodeSize + nodeOffsetRow);

    if (canvasHeight < requiredHeight) {
      sizes.canvasHeight = requiredHeight;
      elements.canvas.style.height = `${requiredHeight}px`;
    }
  }
}

export const shrinkCanvasIfNeeded = (elements: Elements, sizes: Sizes) => {
  const { nodeAmount, nodeLimitPerRow, nodeOffsetRow, nodeSize } = sizes;

  // Removing a node will empty the last row if it's the only node in that row
  const willEmptyLastRow = nodeAmount % nodeLimitPerRow === 1;

  // Don't shrink below the initial double-row height
  const minHeight = 2 * (nodeSize + nodeOffsetRow) + sizes.nodeOffsetTop;

  if (willEmptyLastRow && sizes.canvasHeight > minHeight) {
    const newHeight = sizes.canvasHeight - nodeSize - nodeOffsetRow;
    sizes.canvasHeight = newHeight;
    elements.canvas.style.height = `${newHeight}px`;
  }
}
