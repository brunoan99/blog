import { createArrow } from "./utils/Arrows";
import { createNodeWithPointer } from "./utils/NodeWithPointer";

type Sizes = {
  canvasWidth: number;
  canvasHeight: number;
  nodeSize: number;
  nodeOffsetTop: number;
  nodeOffsetLeft: number;
  nodeOffsetPerNode: number;
  nodeOffsetPerRow: number;
  nodeAmount: number;
  arrowWidth: number;
  rowHorizontalSize: number;
};

type Elements = {
  canvas: HTMLElement;
  nodes: HTMLElement[];
  arrows: SVGSVGElement[];
};

type Tags = {
  nodesClassName: string;
};


const calculateNodeLeftOffset = (inRowIndex: number, sizes: Sizes) => {
  return sizes.nodeOffsetLeft + (inRowIndex * (sizes.nodeOffsetPerNode + sizes.arrowWidth))
}

const calculateArrowLeftOffset = (inRowIndex: number, sizes: Sizes) => {
  return sizes.nodeOffsetLeft + (inRowIndex * (sizes.nodeOffsetPerNode + sizes.arrowWidth));
}

export const createNodeAt = (
  elements: Elements,
  tags: Tags,
  sizes: Sizes,
  nodeIndex: number,
  nodeValue: string,
) => {

  let topOffset = `${sizes.nodeOffsetTop}px`;
  let leftOffset = `${calculateNodeLeftOffset(nodeIndex, sizes)}px`;
  let node = createNodeWithPointer({
    id: `${tags.nodesClassName}-${(nodeIndex + 1).toString()}`,
    className: tags.nodesClassName,
    style: {
      size: sizes.nodeSize,
      top: topOffset,
      left: leftOffset,
      backgroundColor: "#F7F3EE",
      bottomBackgroundColor: "#F7F3EE",
    },
    initialValue: nodeValue,
    initialPointerValue: "connections",
  });

  elements.nodes.splice(nodeIndex, 0, node);
  elements.canvas.appendChild(node);
}

export const createArrowAt = (
  elements: Elements,
  nodeIndex: number,
  tags: Tags,
  sizes: Sizes,
  direction: "left" | "right" | "up" | "down" = "right", heightPercentage?: number) => {
  let index = elements.arrows.length;
  let topOffset = sizes.nodeOffsetTop;
  let leftOffset = calculateArrowLeftOffset(nodeIndex, sizes);

  let arrow = createArrow({
    id: `${tags.nodesClassName}-arrow-${index}-to-${direction}`,
    arrowWidth: sizes.arrowWidth,
    arrowType: direction,
    top: topOffset,
    left: leftOffset,
    nodeHeight: sizes.nodeSize,
    nodeWidth: sizes.nodeSize,
    heightPercentage: heightPercentage ? heightPercentage : 0.8,
  });

  elements.arrows.push(arrow);
  elements.canvas.appendChild(arrow);
}

const interleave = <A, B>(a1: A[], a2: B[]): (A | B)[] => {
  const result: (A | B)[] = [];
  const len = Math.max(a1.length, a2.length);

  for (let i = 0; i < len; i++) {
    if (i < a1.length) result.push(a1[i]);
    if (i < a2.length) result.push(a2[i]);
  }

  return result;
}

export const createSequenceAnimation = async (elements: Elements) => {
  let elementsToAnimate = interleave(elements.arrows, elements.nodes);
  let sequenceOfAnimations = [0, 1, 2, 7, 13, 3, 14, 7, 6, 9, 15, 5, 16, 9, 10, 11];

  for (let index of sequenceOfAnimations) {
    let element = elementsToAnimate[index];

    if (!element) continue;

    element.style.willChange = "scale";

    let animation = element.animate([
      { scale: 1 },
      { scale: element.id.includes("arrow") ? 1.12 : 1.15 },
      { scale: 1 },
    ], {
      duration: 1000,
      direction: "alternate",
      fill: "forwards",
    })

    await animation.finished;

    element.style.willChange = "auto";
  }
}
