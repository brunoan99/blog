import { animate, JSAnimation } from "animejs/animation";
import { createNode } from "./utils/Node";
import { utils, waapi } from "animejs";

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
  cursor: HTMLElement | null;
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
        opacity: "1",
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

const createCursorClickAnimation = (cursor: HTMLElement): JSAnimation => {
  cursor.style.willChange = "scale, stroke-width";

  return animate(cursor, {
    scale: [0.9, 1, 0.9],
    strokeWidth: [2, 1, 2],
    easing: 'easeInOutQuad',
    autoplay: true,
    loop: true,
  });
}

const createCursorMoveAnimation = (cursor: HTMLElement, lastTranslate: number, nextTranslate: number) => {
  cursor.style.willChange = "tranform";

  return waapi.animate(cursor, {
    translateX: [`${lastTranslate}px`, `${nextTranslate}px`],
    duration: 350,
  })
}

const createNodeElementsAnimation = (element: HTMLElement) => {
  element.style.willChange = "background-color";

  animate(element, {
    "background-color": "#F7F3EE",
    duration: 500,
  })
}

const markGoalAsComplete = (goal: HTMLElement) => {
  let lineWidth = goal.clientWidth;
  goal.style.backgroundSize = `${lineWidth}px 2px`;
  goal.style.opacity = "0.45";
}

const deleteCursorAnimation = (cursor: HTMLElement, elements: Elements) => {
  utils.remove(cursor);
  elements.canvas.removeChild(cursor);
  elements.cursor = null;
}

export {
  createNodesElements,
  createCursorClickAnimation,
  createCursorMoveAnimation,
  createNodeElementsAnimation,
  markGoalAsComplete,
  deleteCursorAnimation
};
