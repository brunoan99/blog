import anime, { type AnimeInstance } from "animejs";
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
  for (let i=0; i < sizes.nodeLimit; i++) {
    let node = createNode({
      id: `${tags.nodesClassName}-${(i+1).toString()}`,
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

const createNodeAndCursorAppearAnimation = (elements: Elements, tags: Tags) => {
  anime({
    targets: [`.${tags.nodesClassName}`, `#${elements.cursor.id}`],
    opacity: [0, 1],
    duration: 550,
    easing: "linear",
    autoplay: true,
  });
}

const createCursorClickAnimation = (cursor: HTMLElement): AnimeInstance => {
  return anime({
    targets: `#${cursor.id}`,
    scale: [
      {value: 0.9 },
      {value: 1 }
    ],
    strokeWidth: [
      {value: 2 },
      {value: 1 }
    ],
    easing: 'easeInOutQuad',
    duration: 450,
    delay: 50,
    autoplay: true,
    loop: true,
  });
}

export {
  createNodesElements,
  createNodeAndCursorAppearAnimation,
  createCursorClickAnimation,
};
