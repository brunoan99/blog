import { animate, JSAnimation } from "animejs";
import { createNode } from "./utils/Node";
import type { PreinitializedWritableAtom } from "nanostores";

type Sizes = {
  canvasWidth: number;
  canvasHeight: number;
  nodeSize: number;
  nodeLimitPerLine: number;
  nodeOffsetTop: number;
  nodeOffsetPerNode: number;
  nodeOffsetLeft: number;
};

type Elements = {
  canvas: HTMLElement;
  nodes: PreinitializedWritableAtom<HTMLElement[]>;
  cursor: HTMLElement;
};

type Tags = {
  nodesClassName: string;
};

const createRootPointer = (elements: Elements) => {

}

const createCursorAppearAnimation = (elements: Elements): JSAnimation => {
  return animate(`#${elements.cursor.id}`, {
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


const createNodeElement = (elements: Elements, tags: Tags, sizes: Sizes, currentValue: number): HTMLElement => {
  let node = createNode({
    id: `${tags.nodesClassName}-${(currentValue + 1).toString()}`,
    className: tags.nodesClassName,
    innitialValue: (currentValue + 1).toString(),
    style: {
      opacity: "0",
      size: `${sizes.nodeSize}px`,
      top: `${sizes.nodeOffsetTop}px`,
      left: `${sizes.nodeOffsetLeft + (currentValue * sizes.nodeOffsetPerNode)}px`,
      backgroundColor: "#ededed",
    }
  });
  let elementsStore = elements.nodes.get();
  elements.nodes.set([...elementsStore, node])
  elements.canvas.appendChild(node);
  animate(`#${tags.nodesClassName}-${(currentValue + 1).toString()}`, {
    opacity: [{ to: 0 }, { to: 1 }],
    duration: 550,
    easing: "linear",
    autoplay: true,
  })
  return node;
}

const markGoalAsComplete = (goal: HTMLElement) => {
  let lineWidth = goal.clientWidth;
  goal.style.backgroundSize = `${lineWidth}px 2px`;
  goal.style.opacity = "0.5";
}

export {
  createCursorAppearAnimation,
  createCursorClickAnimation,
  createNodeElement,
  markGoalAsComplete
}
