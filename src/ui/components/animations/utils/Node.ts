import { createElem } from "./HtmlElement";

type NodeStyle = {
  size: string;
  opacity?: string;
  top?: string;
  left?: string;
  backgroundColor?: string;
}

export const styleNode = (elem: HTMLElement, style: NodeStyle) => {
  elem.style.width = style.size;
  elem.style.height = style.size;
  if (style.opacity) elem.style.opacity = style.opacity;
  if (style.top) elem.style.top = style.top;
  if (style.left) elem.style.left = style.left;
  if (style.backgroundColor) elem.style.backgroundColor = style.backgroundColor;
  elem.style.border = "#000000 solid 1px";
  elem.style.display = "flex";
  elem.style.alignItems = "center";
  elem.style.justifyContent = "center";
  elem.style.position = "absolute";
  elem.style.userSelect = "none";
  elem.style.wordBreak = "break-all";
}

type NodeProps = {
  id: string;
  className?: string;
  style: NodeStyle;
  innitialValue?: string;
}

export const createNode = ({ id, className, style, innitialValue }: NodeProps): HTMLElement  => {
  let node = createElem<HTMLElement>({
    type: "div",
    id,
    className,
  });
  if (innitialValue) node.innerText = innitialValue;
  styleNode(node, style)
  return node;
}

type BinStyle = {
  size: string;
  top?: string;
  left?: string;
}

const styleBin = (elem: HTMLElement, style: BinStyle) => {
  elem.style.width = style.size;
  elem.style.height = style.size;
  if (style.top) elem.style.top = style.top;
  if (style.left) elem.style.left = style.left;
  elem.style.display = "flex";
  elem.style.flexDirection = "column";
  elem.style.justifyContent = "space-between";
  elem.style.lineHeight = "1";
  elem.style.fontFamily = "ui-monospace"
  elem.style.userSelect = "none";
  elem.style.position = "absolute";
}

type BinProps = {
  id: string;
  style: BinStyle,
}

export const createBin = ({ id, style }: BinProps): [HTMLElement, HTMLElement, HTMLElement, HTMLElement, HTMLElement] => {
  let bin = createElem<HTMLElement>({
    type: "div",
    id,
  });
  styleBin(bin, style);
  let firstByteElement = createElem({ type: "span", id: `bin_digits_1_${Math.random()}` });
  let secondByteElement = createElem({ type: "span", id: `bin_digits_2_${Math.random()}` });
  let thirdByteElement = createElem({ type: "span", id: `bin_digits_3_${Math.random()}` });
  let quarterByteElement = createElem({ type: "span", id: `bin_digits_4_${Math.random()}` });

  bin.appendChild(firstByteElement);
  bin.appendChild(secondByteElement);
  bin.appendChild(thirdByteElement);
  bin.appendChild(quarterByteElement);

  return [bin, firstByteElement, secondByteElement, thirdByteElement, quarterByteElement];
}
