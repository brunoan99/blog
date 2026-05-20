import { createElem } from "./HtmlElement";

type NodeWithPointerStyleProps = {
  size: number;
  opacity?: string;
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  backgroundColor?: string;
  bottomBackgroundColor?: string;
}

export type NodeWithPointerProps = {
  id: string;
  className?: string;
  style: NodeWithPointerStyleProps;
  initialValue?: string;
  initialPointerValue?: string;
}

const styleNodeUpper = (elem: HTMLElement, style: NodeWithPointerStyleProps) => {
  elem.style.height = `${style.size * 0.6}px`;
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
  elem.style.padding = "6px 12px";
  elem.style.textAlign = "center";
  elem.style.fontWeight = "bold";
  elem.style.fontSize = "12px";
  elem.style.display = "flex";
  if (style.bottomBackgroundColor) elem.style.backgroundColor = style.bottomBackgroundColor;
  elem.style.alignItems = "center";
  elem.style.justifyContent = "center";
  elem.style.position = "relative";
  elem.style.userSelect = "none";
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

export const createNodeWithPointer = ({ id, className, style, initialValue, initialPointerValue }: NodeWithPointerProps): HTMLElement => {
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
    className: "node-bottom",
    innerValue: initialPointerValue,
  });
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
