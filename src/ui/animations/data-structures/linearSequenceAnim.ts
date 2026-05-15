import { animate, JSAnimation } from "animejs/animation";
import { createNodeWithPointer } from "./utils/NodeWithPointer";
import { createArrow } from "./utils/Arrows";
import { getElem } from "./utils/HtmlElement";
import { createTimeline, Timeline } from "animejs/timeline";

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

const NODE_AMOUNT = 4;

const calculateNodeLeftOffset = (inRowIndex: number, sizes: Sizes) => {
  return sizes.nodeOffsetLeft + (inRowIndex * (sizes.nodeOffsetPerNode + sizes.arrowWidth))
}

const calculateArrowLeftOffset = (inRowIndex: number, isLastInRow: boolean, sizes: Sizes) => {
  let endOffset = isLastInRow ? sizes.arrowWidth + sizes.nodeSize / 2 : 0;
  return sizes.nodeOffsetLeft + (inRowIndex * (sizes.nodeOffsetPerNode + sizes.arrowWidth)) + endOffset;

}

export const createNodeAt = (elements: Elements, tags: Tags, sizes: Sizes, nodeIndex: number) => {
  let isLastNode = nodeIndex == sizes.nodeAmount - 1;

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
      bottomBackgroundColor: isLastNode ? "#ededed" : "#F7F3EE",
    },
    innitialValue: `${nodeIndex}`,
    innitialPointerValue: isLastNode ? "null" : "next",
  });

  elements.nodes.splice(nodeIndex, 0, node);
  elements.canvas.appendChild(node);

  if (isLastNode && nodeIndex != 0)
    linkPreviousNodeToCreated(elements, nodeIndex - 1);
}

export const linkPreviousNodeToCreated = (elements: Elements, nodeIndex: number) => {
  let nodeToUpdate = elements.nodes[nodeIndex];
  let nodeId = nodeToUpdate.id;
  let bottom = getElem<HTMLElement>(`#${nodeId}-bottom`);
  if (bottom.innerText == "null") {
    animate(bottom, {
      background: [`#ededed`, `#F7F3EE`],
      innerText: ["null", "next"],
      duration: 350,
      easing: "easeInOutQuad",
      autoplay: true,
      loop: false,
      onComplete: (self: JSAnimation) => {
        self.cancel();
      },
    })
  }
}

export const createArrowAtEnd = (elements: Elements, nodeIndex: number, tags: Tags, sizes: Sizes) => {
  let isLastInRow = nodeIndex == sizes.nodeAmount;
  let topOffset = sizes.nodeOffsetTop;
  let leftOffset = calculateArrowLeftOffset(nodeIndex, isLastInRow, sizes);

  let arrow = createArrow({
    id: `${tags.nodesClassName}-arrow-${nodeIndex}`,
    arrowWidth: sizes.arrowWidth,
    arrowType: isLastInRow ? "down" : "right",
    top: topOffset,
    left: leftOffset,
    nodeHeight: sizes.nodeSize,
    nodeWidth: sizes.nodeSize,
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

export const createSequenceAnimation = (elements: Elements, sizes: Sizes): Timeline => {
  let elementsToAnimate = interleave(elements.arrows, elements.nodes);
  let timeline = createTimeline({
    autoplay: false,
    onComplete: (self) => {
      self.reset();
    }
  })
  let totalElements = elementsToAnimate.length;
  let zIndex = totalElements;
  for (let i = 0; i < totalElements; i++) {
    elementsToAnimate[i].style.zIndex = `${zIndex}`;
    zIndex--;
  }
  for (let element of elementsToAnimate) {
    if (element.id.includes("arrow")) {
      timeline.add(element, {
        scale: [
          1,
          1.15,
          1],
        duration: 1000,
        easing: "easeInOutQuad",
        loop: false,
      })
    }
    else {
      timeline.add(element, {
        scale: [
          1,
          1.15,
          1],
        duration: 1000,
        easing: "easeInOutQuad",
        loop: false,
      })
    }
  }

  return timeline
}
