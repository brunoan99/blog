import { createElem } from "./HtmlElement";

type NodeWithPointerStyleProps = {
  size: number;
  opacity?: string;
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  backgroundColor?: string;
  bottomFirstBackgroundColor?: string;
  bottomSecondBackgroundColor?: string;
}

export type NodeWithPointerProps = {
  id: string;
  className?: string;
  style: NodeWithPointerStyleProps;
  initialValue?: string;
  initialPointerFirstValue?: string;
  initialPointerSecondValue?: string;
}

const styleNodeUpper = (elem: HTMLElement, style: NodeWithPointerStyleProps) => {
  elem.style.height = `${style.size * 0.6}px`;
  elem.style.padding = "8px 12px";
  elem.style.borderBottom = "#000 solid 1px";
  elem.style.textAlign = "flex";
  elem.style.fontWeight = "bold";
  elem.style.background = "#F7F3EE"
  elem.style.display = "flex";
  elem.style.alignItems = "center";
  elem.style.justifyContent = "center";
  elem.style.userSelect = "none";
}

const styleNodeBottom = (elem: HTMLElement, style: NodeWithPointerStyleProps) => {
  elem.style.height = `${style.size * 0.4}px`;
  elem.style.textAlign = "center";
  elem.style.fontWeight = "bold";
  elem.style.fontSize = "12px";
  elem.style.display = "flex";
  if (style.bottomFirstBackgroundColor) elem.style.backgroundColor = style.bottomFirstBackgroundColor;
  elem.style.alignItems = "center";
  elem.style.justifyContent = "center";
  elem.style.position = "relative";
  elem.style.userSelect = "none";
  elem.style.display = "flex";
  elem.style.flexDirection = "row";
}

const styleNodeBottomSection = (elem: HTMLElement, style: NodeWithPointerStyleProps, isLeft: boolean = true) => {
  elem.style.height = `${style.size * 0.4}px`;
  elem.style.width = `${style.size * 0.5}px`;

  elem.style.display = "flex";
  elem.style.alignItems = "center";
  elem.style.justifyContent = "center";
  elem.style.fontWeight = "bold";
  elem.style.fontSize = "12px";

  if (isLeft) elem.style.borderRight = "#000000 solid 1px";
}

const styleNodeWithPointer = (elem: HTMLElement, style: NodeWithPointerStyleProps) => {
  elem.style.width = `${style.size}px`;
  elem.style.height = `${style.size}px`;
  if (style.opacity) elem.style.opacity = style.opacity;
  if (style.top) elem.style.top = style.top;
  if (style.left) elem.style.left = style.left;
  if (style.bottom) elem.style.bottom = style.bottom;
  if (style.right) elem.style.right = style.right;
  if (style.backgroundColor) elem.style.backgroundColor = style.backgroundColor;
  elem.style.display = "flex";
  elem.style.flexDirection = "column";
  elem.style.border = "#000000 solid 1px",
    elem.style.position = "absolute";
  elem.style.fontFamily = "ui-monospace"
  elem.style.overflow = "hidden";
  elem.style.fontSize = "14px";
  elem.style.userSelect = "none";
  elem.style.zIndex = "1";
}

export const createNodeWithTwoPointers = ({ id, className, style, initialValue, initialPointerFirstValue, initialPointerSecondValue }: NodeWithPointerProps): HTMLElement => {
  let upper = createElem<HTMLElement>({
    type: "div",
    id: `${id}-upper`,
    className: "node-upper",
    innerValue: initialValue,
  });
  styleNodeUpper(upper, style);

  let bottom = createElem<HTMLElement>({
    type: "div",
    id: `${id}-bottom`,
    className: "node-bottom"
  });

  let bottomFirst = createElem<HTMLElement>({
    type: "div",
    id: `${id}-bottom-first`,
    className: "node-bottom-first",
    innerValue: initialPointerFirstValue,
  });
  if (style.bottomFirstBackgroundColor) bottomFirst.style.backgroundColor = style.bottomFirstBackgroundColor;
  styleNodeBottomSection(bottomFirst, style, true);
  bottom.appendChild(bottomFirst);

  let bottomSecond = createElem<HTMLElement>({
    type: "div",
    id: `${id}-bottom-second`,
    className: "node-bottom-second",
    innerValue: initialPointerSecondValue,
  });
  if (style.bottomSecondBackgroundColor) bottomSecond.style.backgroundColor = style.bottomSecondBackgroundColor;
  styleNodeBottomSection(bottomSecond, style, false);
  bottom.appendChild(bottomSecond);

  styleNodeBottom(bottom, style);

  let node = createElem<HTMLElement>({
    type: "div",
    id,
    className,
  });
  node.appendChild(upper);
  node.appendChild(bottom);
  styleNodeWithPointer(node, style)
  return node;
}
