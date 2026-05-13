import { animate, JSAnimation } from "animejs/animation";
import { createNodeWithPointer } from "./utils/NodeWithPointer";
import { createArrow, createArrowBetweenPoints } from "./utils/Arrows";
import { getElem } from "./utils/HtmlElement";
import { createNodeWithTwoPointers } from "./utils/NodeWithTwoPointers";
import { createTimeline, Timeline } from "animejs/timeline";
import { utils } from "animejs";

type SizesLinear = {
  canvasWidth: number;
  canvasHeight: number;
  nodeLimitPerRow: number;
  nodeSize: number;
  nodeOffsetTop: number;
  nodeOffsetLeft: number;
  nodeOffsetPerNode: number;
  nodeOffsetPerRow: number;
  nodeAmount: number;
  arrowWidth: number;
  rowHorizontalSize: number;
};

type SizesNonLinear = {
  canvasWidth: number;
  canvasHeight: number;
  nodeSize: number;
  nodeOffsetPerNode: number;
  nodeOffsetTop: number;
  nodeOffsetPerRow: number;
  arrowWidth: number;
}

type Elements = {
  canvas: HTMLElement;
  nodesLinear: HTMLElement[];
  arrowsLinear: SVGSVGElement[];
  nodesNonLinear: HTMLElement[];
  arrowsNonLinear: SVGSVGElement[];
};

type Tags = {
  nodesLinearClassName: string;
  nodesNonLinearClassName: string;
};


const calculateNodeLeftOffset = (inRowIndex: number, isRowEven: boolean, sizes: SizesLinear) => {
  if (isRowEven) {
    return sizes.nodeOffsetLeft + (inRowIndex * (sizes.nodeOffsetPerNode + sizes.arrowWidth))
  }
  return sizes.nodeOffsetLeft + ((sizes.nodeLimitPerRow - inRowIndex - 1) * (sizes.nodeOffsetPerNode + sizes.arrowWidth))
}

const calculateNodeTopOffset = (rowIndex: number, sizes: SizesLinear) => {
  return sizes.nodeOffsetTop + (rowIndex * (sizes.nodeOffsetPerNode + sizes.nodeOffsetPerRow));
}

const calculateArrowLeftOffset = (inRowIndex: number, isRowEven: boolean, isLastInRow: boolean, sizes: SizesLinear) => {
  let endOffset = isLastInRow && !isRowEven ? sizes.arrowWidth + sizes.nodeSize / 2 : 0;
  if (isRowEven) {
    return sizes.nodeOffsetLeft + (inRowIndex * (sizes.nodeOffsetPerNode + sizes.arrowWidth)) + endOffset;
  }
  return sizes.nodeOffsetLeft + ((sizes.nodeLimitPerRow - inRowIndex - 2) * (sizes.nodeOffsetPerNode + sizes.arrowWidth)) + endOffset;
}

const calculateArrowTopOffset = (rowIndex: number, sizes: SizesLinear) => {
  return sizes.nodeOffsetTop + (rowIndex * (sizes.nodeOffsetPerNode + sizes.nodeOffsetPerRow));
}

export const createLinearNodeAt = (elements: Elements, tags: Tags, sizes: SizesLinear, nodeIndex: number, nodeValue: number) => {
  let rowIndex = Math.floor(nodeIndex / sizes.nodeLimitPerRow);
  let isRowEven = rowIndex % 2 == 0;
  let inRowIndex = nodeIndex % sizes.nodeLimitPerRow;
  let isLastNode = nodeIndex == sizes.nodeAmount - 1;

  let topOffset = `${calculateNodeTopOffset(rowIndex, sizes)}px`;
  let leftOffset = `${calculateNodeLeftOffset(inRowIndex, isRowEven, sizes)}px`;


  let node = createNodeWithPointer({
    id: `${tags.nodesLinearClassName}-${(nodeValue + 1).toString()}`,
    className: tags.nodesLinearClassName,
    style: {
      size: sizes.nodeSize,
      top: topOffset,
      left: leftOffset,
      backgroundColor: "#F7F3EE",
      bottomBackgroundColor: isLastNode ? "#ededed" : "#F7F3EE",
    },
    innitialValue: `${nodeValue}`,
    innitialPointerValue: isLastNode ? "null" : "next",
  });

  elements.nodesLinear.splice(nodeIndex, 0, node);
  elements.canvas.appendChild(node);
}

export const createLinearArrowAtEnd = (elements: Elements, tags: Tags, sizes: SizesLinear) => {
  let nodeIndex = elements.arrowsLinear.length - 1;
  let rowIndex = Math.floor(nodeIndex / sizes.nodeLimitPerRow);
  let isRowEven = rowIndex % 2 == 0;
  let inRowIndex = nodeIndex % sizes.nodeLimitPerRow;
  let isLastInRow = inRowIndex == sizes.nodeLimitPerRow - 1;

  let topOffset = calculateArrowTopOffset(rowIndex, sizes);
  let leftOffset = calculateArrowLeftOffset(inRowIndex, isRowEven, isLastInRow, sizes);

  let arrow = createArrow({
    id: `${tags.nodesLinearClassName}-arrow-${nodeIndex}`,
    arrowWidth: sizes.arrowWidth,
    arrowType: isLastInRow ? "down" : (isRowEven ? "right" : "left"),
    top: topOffset,
    left: leftOffset,
    nodeHeight: sizes.nodeSize,
    nodeWidth: sizes.nodeSize,
  });

  elements.arrowsLinear.push(arrow);
  elements.canvas.appendChild(arrow);
}

//     3 -> root -> cW - nS / 2 -> space before and after
//   1, 5 -> second line -> cw - 2 * nS / 3 -> space before, after and between
// 0, 2, 4, 6 -> third line -> cw - 4 * ns / 5 -> space before, after and 3 between
export const createNonLinearNodeAt = (elements: Elements, tags: Tags, sizes: SizesNonLinear, nodeIndex: number) => {
  let topOffset = 0;
  let leftOffset = 0;
  let hasChild = false;
  if (nodeIndex == 3) {
    // root, first row
    topOffset = sizes.nodeOffsetTop;
    leftOffset = (sizes.canvasWidth - sizes.nodeOffsetPerNode) / 2;
    hasChild = true;
  }
  if (nodeIndex == 1
    || nodeIndex == 5
  ) {
    // second row
    let rowIndex = Math.floor(nodeIndex / 4);
    let spaceInBetween = (sizes.canvasWidth - (2 * sizes.nodeOffsetPerNode)) / 3;
    topOffset = sizes.nodeOffsetTop + sizes.nodeOffsetPerNode + sizes.nodeOffsetPerRow;
    leftOffset = spaceInBetween + rowIndex * (spaceInBetween + sizes.nodeOffsetPerNode);
    hasChild = true;
  }
  if (nodeIndex == 0
    || nodeIndex == 2
    || nodeIndex == 4
    || nodeIndex == 6
  ) {
    // third row
    let rowIndex = Math.floor(nodeIndex / 2);
    let spaceInBetween = (sizes.canvasWidth - (4 * sizes.nodeOffsetPerNode)) / 5;

    topOffset = sizes.nodeOffsetTop + 2 * (sizes.nodeOffsetPerNode + sizes.nodeOffsetPerRow);
    leftOffset = spaceInBetween + rowIndex * (spaceInBetween + sizes.nodeOffsetPerNode);
  }
  let node = createNodeWithTwoPointers({
    id: `${tags.nodesNonLinearClassName}-${nodeIndex.toString()}`,
    className: tags.nodesNonLinearClassName,
    style: {
      size: sizes.nodeSize,
      top: `${topOffset}px`,
      left: `${leftOffset}px`,
      backgroundColor: "#F7F3EE",
      bottomFirstBackgroundColor: hasChild ? "#F7F3EE" : "#ededed",
      bottomSecondBackgroundColor: hasChild ? "#F7F3EE" : "#ededed",
    },
    innitialValue: `${nodeIndex}`,
    innitialPointerFirstValue: hasChild ? "left" : "null",
    innitialPointerSecondValue: hasChild ? "right" : "null",
  });
  elements.nodesNonLinear.push(node);
  elements.canvas.appendChild(node);
}

const createArrowsFirstLine = (elements: Elements, tags: Tags, sizes: SizesNonLinear, nodeIndex: number) => {
  let originNodeTopOffset = sizes.nodeOffsetTop;
  let originNodeLeftOffset = (sizes.canvasWidth - sizes.nodeOffsetPerNode) / 2;
  {
    // left arrow
    let p1 = {
      x: originNodeLeftOffset,
      y: originNodeTopOffset + sizes.nodeOffsetPerNode * 0.8,
    }
    let nodeMiddleRowIndex = 0
    let spaceInBetween = (sizes.canvasWidth - (2 * sizes.nodeOffsetPerNode)) / 3;
    let nodeMiddleRowTopOffset = sizes.nodeOffsetTop + sizes.nodeOffsetPerNode + sizes.nodeOffsetPerRow;
    let nodeMiddleRowLeftOffset = spaceInBetween + nodeMiddleRowIndex * (spaceInBetween + sizes.nodeOffsetPerNode);

    let p2 = {
      x: nodeMiddleRowLeftOffset + sizes.nodeOffsetPerNode * 0.8,
      y: nodeMiddleRowTopOffset,
    }
    let arrow = createArrowBetweenPoints({
      id: `${tags.nodesNonLinearClassName}-arrow-left-${nodeIndex}`,
      p1,
      p2,
    });
    elements.arrowsNonLinear.push(arrow);
    elements.canvas.appendChild(arrow);
  }
  {
    // right arrow
    let p1 = {
      x: originNodeLeftOffset + sizes.nodeOffsetPerNode,
      y: originNodeTopOffset + sizes.nodeOffsetPerNode * 0.8,
    }
    let nodeMiddleRowIndex = 1
    let spaceInBetween = (sizes.canvasWidth - (2 * sizes.nodeOffsetPerNode)) / 3;
    let nodeMiddleRowTopOffset = sizes.nodeOffsetTop + sizes.nodeOffsetPerNode + sizes.nodeOffsetPerRow;
    let nodeMiddleRowLeftOffset = spaceInBetween + nodeMiddleRowIndex * (spaceInBetween + sizes.nodeOffsetPerNode);

    let p2 = {
      x: nodeMiddleRowLeftOffset + sizes.nodeOffsetPerNode * 0.2,
      y: nodeMiddleRowTopOffset,
    }
    let arrow = createArrowBetweenPoints({
      id: `${tags.nodesNonLinearClassName}-arrow-right-${nodeIndex}`,
      p1,
      p2,
    });
    elements.arrowsNonLinear.push(arrow);
    elements.canvas.appendChild(arrow);
  }
}

export const createcreateArrowsMiddleLine = (elements: Elements, tags: Tags, sizes: SizesNonLinear, nodeIndex: number) => {
  let rowIndex = Math.floor(nodeIndex / 4);
  let spaceInBetween = (sizes.canvasWidth - (2 * sizes.nodeOffsetPerNode)) / 3;
  let originNodeTopOffset = sizes.nodeOffsetTop + sizes.nodeOffsetPerNode + sizes.nodeOffsetPerRow;
  let originNodeLeftOffset = spaceInBetween + rowIndex * (spaceInBetween + sizes.nodeOffsetPerNode);

  // if rowIndex = 0 -> arrow to 0 and 1 last row
  // if          = 1 -> arrow to 2 and 3 last row
  {
    // left arrow
    let p1 = {
      x: originNodeLeftOffset,
      y: originNodeTopOffset + sizes.nodeOffsetPerNode * 0.8,
    }
    let nodeBottomRowIndex = rowIndex ? 2 : 0;
    let spaceInBetween = (sizes.canvasWidth - (4 * sizes.nodeOffsetPerNode)) / 5;

    let nodeBottomTopOffset = sizes.nodeOffsetTop + 2 * (sizes.nodeOffsetPerNode + sizes.nodeOffsetPerRow);
    let nodeBottomLeftOffset = spaceInBetween + nodeBottomRowIndex * (spaceInBetween + sizes.nodeOffsetPerNode);
    let p2 = {
      x: nodeBottomLeftOffset + sizes.nodeOffsetPerNode * 0.5,
      y: nodeBottomTopOffset,
    }
    let arrow = createArrowBetweenPoints({
      id: `${tags.nodesNonLinearClassName}-arrow-left-${nodeIndex}`,
      p1,
      p2,
    });
    elements.arrowsNonLinear.push(arrow);
    elements.canvas.appendChild(arrow);
  }
  {
    // right arrow
    let p1 = {
      x: originNodeLeftOffset + sizes.nodeOffsetPerNode,
      y: originNodeTopOffset + sizes.nodeOffsetPerNode * 0.8,
    }
    let nodeBottomRowIndex = rowIndex ? 3 : 1;
    let spaceInBetween = (sizes.canvasWidth - (4 * sizes.nodeOffsetPerNode)) / 5;

    let nodeBottomTopOffset = sizes.nodeOffsetTop + 2 * (sizes.nodeOffsetPerNode + sizes.nodeOffsetPerRow);
    let nodeBottomLeftOffset = spaceInBetween + nodeBottomRowIndex * (spaceInBetween + sizes.nodeOffsetPerNode);
    let p2 = {
      x: nodeBottomLeftOffset + sizes.nodeOffsetPerNode * 0.5,
      y: nodeBottomTopOffset,
    }
    let arrow = createArrowBetweenPoints({
      id: `${tags.nodesNonLinearClassName}-arrow-right-${nodeIndex}`,
      p1,
      p2,
    });
    elements.arrowsNonLinear.push(arrow);
    elements.canvas.appendChild(arrow);
  }

}

export const createNonLinearArrowsAt = (elements: Elements, tags: Tags, sizes: SizesNonLinear, nodeIndex: number) => {
  if (nodeIndex == 3) {
    // root, first row
    // only one option to create
    createArrowsFirstLine(elements, tags, sizes, nodeIndex);
    return
  }
  if (nodeIndex == 1
    || nodeIndex == 5
  ) {
    // second row
    // two options to create arrows, node 1 and node 5
    createcreateArrowsMiddleLine(elements, tags, sizes, nodeIndex);
    return
  }
  if (nodeIndex == 0
    || nodeIndex == 2
    || nodeIndex == 4
    || nodeIndex == 6
  ) {
    return
  }
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

const arrowAnimationParams = {
  scale: [
    1,
    1.10,
    1],
  duration: 1000,
  easing: "easeInOutQuad",
  loop: false
};

const nodeAnimationParams = {
  scale: [
    1,
    1.15,
    1],
  duration: 1000,
  easing: "easeInOutQuad",
  loop: false,
}

const createLastNodeLinearTimeline = (element: HTMLElement, nodeFound: boolean, duration: number): Timeline => {
  let upper = element.querySelector(".node-upper") as HTMLElement;
  let bottom = element.querySelector(".node-bottom") as HTMLElement;
  const lastNodeTimeline = createTimeline({
    onComplete: (self) => {
      self.restart();
      self.pause();
      self.reset();
    }
  });
  lastNodeTimeline.add(element, {
    scale: [1, 1.10],
    duration: 500,
    easing: "easeOutQuad",
    loop: false,
  }).add([element, upper, bottom], {
    "background-color": nodeFound ? "#A8DCAB" : "#FF7F7F",
    direction: "alternate",
    duration: duration - 1000,
    easing: "easeOutQuad",
    loop: false,
  }).add(element, {
    scale: [1.10, 1],
    duration: 500,
    easing: "easeOutQuad",
    loop: false,
  })
  return lastNodeTimeline;
}

const createLastNodeNonLinearTimeline = (element: HTMLElement, nodeFound: boolean, duration: number): Timeline => {
  let upper = element.querySelector(".node-upper") as HTMLElement;
  let bottom = element.querySelector(".node-bottom") as HTMLElement;
  let bottomFirst = element.querySelector(".node-bottom-first") as HTMLElement;
  let bottomSecond = element.querySelector(".node-bottom-second") as HTMLElement;
  const lastNodeTimeline = createTimeline({
    onComplete: (self) => {
      self.restart();
      self.pause();
      self.reset();
    }
  });
  lastNodeTimeline.add(element, {
    scale: [1, 1.10],
    duration: 500,
    easing: "easeOutQuad",
    loop: false,
  }).add([element, upper, bottom, bottomFirst, bottomSecond], {
    "background-color": nodeFound ? "#A8DCAB" : "#FF7F7F",
    direction: "alternate",
    duration: duration - 1000,
    easing: "easeOutQuad",
    loop: false,
  }).add(element, {
    scale: [1.10, 1],
    duration: 500,
    easing: "easeOutQuad",
    loop: false,
  })
  return lastNodeTimeline;
}



const getSequenceOfLinearAnimation = (numberSearched: number): number[] => {
  let linearIndex = 1 + numberSearched * 2;
  linearIndex = Math.min(linearIndex, 13);
  let sequenceOfAnimations = Array.from({ length: linearIndex + 1 }, (_, i) => i);

  return sequenceOfAnimations;
}

export const getSequenceOfNonLinearAnimation = (numberSearched: number): number[] => {
  let sequenceOfAnimationsMap = {
    0: [0, 1, 2, 3, 6, 7],
    1: [0, 1, 2, 3],
    2: [0, 1, 2, 3, 8, 9],
    3: [0, 1],
    4: [0, 1, 4, 5, 10, 11],
    5: [0, 1, 4, 5],
    6: [0, 1, 4, 5, 12, 13],
    7: [0, 1, 4, 5, 12, 13],
    8: [0, 1, 4, 5, 12, 13],
    9: [0, 1, 4, 5, 12, 13],
  } as { [key: number]: number[] }
  // if numberSearch > 6 then number will not be found
  let sequenceOfAnimations = sequenceOfAnimationsMap[numberSearched];
  return sequenceOfAnimations;
}

export const createAnimationTimeline = async (elements: Elements, numberSearched: number) => {
  let elementsLinear = interleave(elements.arrowsLinear, elements.nodesLinear);
  let sequenceOfLinearAnimation = getSequenceOfLinearAnimation(numberSearched);

  let elementsNonLinear = interleave(elements.arrowsNonLinear, elements.nodesNonLinear);
  let sequenceOfNonLinearAnimation = getSequenceOfNonLinearAnimation(numberSearched);

  let linearDuration = sequenceOfLinearAnimation.length * 1000;
  let nonLinearDuration = sequenceOfNonLinearAnimation.length * 1000;
  let maxDuration = Math.max(sequenceOfLinearAnimation.length * 1000, sequenceOfNonLinearAnimation.length * 1000);
  maxDuration += 3000;

  // both examples have starts on 0 and goes to 6 so any number above 6 will not be found
  let nodeFound = numberSearched <= 6;

  let timelineLinear = createTimeline({
    onComplete: (self) => {
      self.reset();
    }
  });
  let timelineNonLinear = createTimeline({
    onComplete: (self) => {
      self.reset();
    }
  });

  for (const [i, elementIndex] of sequenceOfLinearAnimation.entries()) {
    let element = elementsLinear[elementIndex];
    if (i === sequenceOfLinearAnimation.length - 1 && element.nodeName === "DIV") {
      let lastNodeTimeline = createLastNodeLinearTimeline(element as HTMLElement, nodeFound, maxDuration - linearDuration);
      timelineLinear.sync(lastNodeTimeline);
    } else {
      timelineLinear.add(element, element.id.includes("arrow") ? arrowAnimationParams : nodeAnimationParams);
    }
  }

  for (const [i, elementIndex] of sequenceOfNonLinearAnimation.entries()) {
    let element = elementsNonLinear[elementIndex];
    if (i === sequenceOfNonLinearAnimation.length - 1 && element.nodeName === "DIV") {
      timelineNonLinear.sync(createLastNodeNonLinearTimeline(
        element as HTMLElement,
        nodeFound,
        maxDuration - nonLinearDuration
      ));
    } else {
      timelineNonLinear.add(element, element.id.includes("arrow") ? arrowAnimationParams : nodeAnimationParams);
    }
  }

  timelineLinear.play();
  timelineNonLinear.play();

  await Promise.all([
    timelineLinear.then(),
    timelineNonLinear.then(),
  ]);
}
