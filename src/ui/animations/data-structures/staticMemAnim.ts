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

const createCursorClickAnimation = (cursor: HTMLElement): Animation => {
  cursor.style.willChange = "scale, stroke-width";

  let cursorAnimation = cursor.animate([
    { scale: 0.9, strokeWidth: 2 },
    { scale: 1, strokeWidth: 1 },
  ], {
    duration: 350, easing: "ease-in-out", fill: "forwards", direction: "alternate", iterations: Infinity
  })

  return cursorAnimation
}

const createCursorMoveAnimation = (cursor: HTMLElement, newLeft: string) => {
  let currentLeft = cursor.style.left;
  if (currentLeft == newLeft) return;

  cursor.style.willChange = "left";

  let cursorMoveAnimation = cursor.animate([
    { left: currentLeft },
    { left: newLeft },
  ], {
    duration: 350, easing: "ease-in-out", fill: "forwards",
  })

  cursorMoveAnimation.onfinish = () => {
    cursor.style.left = newLeft;
    cursor.style.willChange = "auto";
  };

}

const createNodeElementsAnimation = async (element: HTMLElement) => {
  element.style.willChange = "background-color";

  let animation = element.animate([
    { backgroundColor: "#ededed" },
    { backgroundColor: "#F7F3EE" },
  ], {
    duration: 350, easing: "ease-in-out", fill: "forwards"
  });

  animation.onfinish = () => {
    element.style.backgroundColor = "#F7F3EE";
    element.style.willChange = "auto";
  };
}

const markGoalAsComplete = (goal: HTMLElement) => {
  let lineWidth = goal.clientWidth;
  goal.style.backgroundSize = `${lineWidth}px 2px`;
  goal.style.opacity = "0.45";
}

const deleteCursorAnimation = (cursor: HTMLElement, animation: Animation, elements: Elements) => {
  animation.commitStyles()
  animation.cancel();

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
