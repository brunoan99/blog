import { createElem } from "./HtmlElement";

type NodeWithPointerStyleProps = {
  size: number;
  opacity?: string;
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  backgroundColor?: string;
}

export type NodeWithPointerProps = {
  id: string;
  className?: string;
  style: NodeWithPointerStyleProps;
  innitialValue?: string;
  innitialPointerValue?: string;
}

const styleNodeUpper = (elem: HTMLElement, style: NodeWithPointerStyleProps) => {
  elem.style.height = `${style.size * 0.6}px`;
  elem.style.padding = "8px 12px";
  elem.style.borderBottom = "2px solid #333";
  elem.style.textAlign = "flex";
  elem.style.fontWeight = "bold";
  elem.style.background = "f0f4ff"
  elem.style.display = "flex";
  elem.style.alignItems = "center";
  elem.style.justifyContent = "center";
  elem.style.userSelect = "none";
}

const styleNodeBottom = (elem: HTMLElement, style: NodeWithPointerStyleProps) => {
  elem.style.height = `${style.size * 0.4}px`;
  elem.style.padding = "6px 12px";
  elem.style.textAlign = "center";
  elem.style.color = "#555";
  elem.style.fontSize = "12px";
  elem.style.display = "flex";
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
  elem.style.borderRadius = "8px";
  elem.style.border = "2px solid #333",
    elem.style.position = "absolute";
  elem.style.fontFamily = "ui-monospace"
  elem.style.overflow = "hidden";
  elem.style.fontSize = "14px";
  elem.style.background = "#fff";
  elem.style.boxShadow = "2px 2px 6px rgba(0, 0, 0, 0.1)";
  elem.style.flexShrink = "0";
  elem.style.userSelect = "none";
}

export const createNodeWithPointer = ({ id, className, style, innitialValue, innitialPointerValue }: NodeWithPointerProps): HTMLElement => {
  let upper = createElem<HTMLElement>({
    type: "div",
    id: `${id}-upper`,
    className: "node-upper",
    innerValue: innitialValue,
  });
  styleNodeUpper(upper, style);
  let bottom = createElem<HTMLElement>({
    type: "div",
    id: `${id}-bottom`,
    className: "node-bottom",
    innerValue: innitialPointerValue,
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
