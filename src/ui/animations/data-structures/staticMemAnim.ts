import { animate, JSAnimation } from "animejs";
import { createNode } from "./utils/Node";

type Sizes = {
  canvasWidth: number;
  canvasHeight: number;
  nodeSize: number;
  nodeLimit: number;
  nodeOffsetTop: number;
  nodeOffsetPerNode: number;
  nodeOffsetLeft: number;
};

type Elements = {
  canvas: HTMLElement;
  nodes: HTMLElement[];
  cursor: HTMLElement;
};

type Tags = {
  nodesClassName: string;
};

const createNodesElements = (elements: Elements, tags: Tags, sizes: Sizes) => {
  for (let i = 0; i < sizes.nodeLimit; i++) {
    let node = createNode({
      id: `${tags.nodesClassName}-${(i + 1).toString()}`,
      className: tags.nodesClassName,
      style: {
        opacity: "0",
        size: `${sizes.nodeSize}px`,
        top: `${sizes.nodeOffsetTop}px`,
        left: `${sizes.nodeOffsetLeft + (i * sizes.nodeOffsetPerNode)}px`,
        backgroundColor: "#ededed",
      }
    });
    elements.nodes.push(node);
    elements.canvas.appendChild(node);
  }
}

const createNodeAndCursorAppearAnimation = (elements: Elements, tags: Tags): JSAnimation => {
  return animate([`.${tags.nodesClassName}`, `#${elements.cursor.id}`], {
    opacity: [{ to: 0 }, { to: 1 }],
    duration: 550,
    easing: "linear",
    autoplay: true,
  });
}

const createCursorClickAnimation = (cursor: HTMLElement): JSAnimation => {
  return animate(`#${cursor.id}`, {
    scale: [{ to: 0.9 }, { to: 1 }],
    strokeWidth: [{ to: 2 }, { to: 1 }],
    easing: 'easeInOutQuad',
    duration: 450,
    delay: 50,
    autoplay: true,
    loop: true,
  });
}

const createCursorMoveAnimation = (cursor: HTMLElement, left: string) => {
  return animate(`#${cursor.id}`, {
    left: left,
    easing: 'easeInOutQuad',
    duration: 350,
    delay: 50,
    autoplay: true,
    loop: false,
  })
}

const createNodeElementsAnimation = (element: HTMLElement) => {
  return animate(`#${element.id}`, {
    "background-color": "#F7F3EE",
    easing: 'easeInOutQuad',
    duration: 500,
    delay: 50,
    autoplay: true,
    loop: false,
  })
}

const markGoalAsComplete = (goal: HTMLElement) => {
  let lineWidth = goal.clientWidth;
  goal.style.backgroundSize = `${lineWidth}px 2px`;
  goal.style.opacity = "0.5";
}

export {
  createNodesElements,
  createNodeAndCursorAppearAnimation,
  createCursorClickAnimation,
  createCursorMoveAnimation,
  createNodeElementsAnimation,
  markGoalAsComplete
};
