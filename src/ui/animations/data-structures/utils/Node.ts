import { createElem } from "./HtmlElement";

type NodeStyle = {
  size: string;
  opacity?: string;
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  backgroundColor?: string;
}

const styleNode = (elem: HTMLElement, style: NodeStyle) => {
  elem.style.width = style.size;
  elem.style.height = style.size;
  if (style.opacity) elem.style.opacity = style.opacity;
  if (style.top) elem.style.top = style.top;
  if (style.left) elem.style.left = style.left;
  if (style.bottom) elem.style.bottom = style.bottom;
  if (style.right) elem.style.right = style.right;
  if (style.backgroundColor) elem.style.backgroundColor = style.backgroundColor;
  elem.style.border = "#000000 solid 1px";
  elem.style.display = "flex";
  elem.style.alignItems = "center";
  elem.style.justifyContent = "center";
  elem.style.position = "absolute";
  elem.style.userSelect = "none";
  elem.style.wordBreak = "break-all";
  elem.style.cursor = "pointer";
}

type NodeProps = {
  id: string;
  style: NodeStyle;
  className?: string;
  innitialValue?: string;
}

export const createNode = ({ id, className, style, innitialValue }: NodeProps): HTMLElement => {
  let node = createElem<HTMLElement>({
    type: "div",
    id,
    className,
    innerValue: innitialValue,
  });
  styleNode(node, style)
  return node;
}

type BinStyle = {
  size: string;
  top: string;
  left: string;
}

const styleBytes = (elem: HTMLElement, style: BinStyle) => {
  elem.style.width = style.size;
  elem.style.height = style.size;
  elem.style.top = style.top;
  elem.style.left = style.left;
  elem.style.display = "flex";
  elem.style.flexDirection = "column";
  elem.style.justifyContent = "space-between";
  elem.style.lineHeight = "1";
  elem.style.fontFamily = "ui-monospace"
  elem.style.userSelect = "none";
  elem.style.position = "absolute";
}

const styleBitLine = (elem: HTMLElement) => {
  elem.style.display = "flex";
  elem.style.flexDirection = "row";
  elem.style.justifyContent = "space-between";
  elem.style.lineHeight = "1";
  elem.style.fontFamily = "ui-monospace"
  elem.style.userSelect = "none";
}

const styleBitPos = (elem: HTMLElement) => {
  elem.style.position = "absolute";
}

const styleBitZero = (elem: HTMLElement) => {
  elem.style.position = "absolute";
}

const styleBitOne = (elem: HTMLElement) => {
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
  styleBytes(bin, style);
  let size = parseInt(style.size.replace("px", ""));
  let bitX = 10;
  let bitY = 20;
  let offsetX = bitX + ((size - bitX * 8) / 7);
  let offsetY = bitY + ((size - bitY * 4) / 3);

  let firstByteElement = createElem({ type: "span", id: `bin_digits_0` });
  for (let i = 0; i < 8; i++) {
    let b0 = createElem({ type: "span", id: `bin_digits_0_${i}_0`, innerValue: "0" });
    styleBitZero(b0);
    b0.style.opacity = "0";
    let b1 = createElem({ type: "span", id: `bin_digits_0_${i}_1`, innerValue: "1" });
    styleBitOne(b1);
    b1.style.opacity = "0";

    let b = createElem({ type: "div", id: `bin_digits_0_${i}` });
    b.appendChild(b0);
    b.appendChild(b1);
    styleBitPos(b);
    b.style.left = `${offsetX * i}px`;
    b.style.top = `${offsetY * 0}px`;

    firstByteElement.appendChild(b);
  }
  styleBitLine(firstByteElement);

  let secondByteElement = createElem({ type: "span", id: `bin_digits_1` });
  for (let i = 0; i < 8; i++) {
    let b0 = createElem({ type: "span", id: `bin_digits_1_${i}_0`, innerValue: "0" });
    styleBitZero(b0);
    b0.style.opacity = "0";
    let b1 = createElem({ type: "span", id: `bin_digits_1_${i}_1`, innerValue: "1" });
    styleBitOne(b1);
    b1.style.opacity = "0";

    let b = createElem({ type: "div", id: `bin_digits_1_${i}` });
    b.appendChild(b0);
    b.appendChild(b1);
    styleBitPos(b);
    b.style.left = `${offsetX * i}px`;
    b.style.top = `${offsetY * 1}px`;

    secondByteElement.appendChild(b);
  }
  styleBitLine(secondByteElement);

  let thirdByteElement = createElem({ type: "span", id: `bin_digits_2` });
  for (let i = 0; i < 8; i++) {
    let b0 = createElem({ type: "span", id: `bin_digits_2_${i}_0`, innerValue: "0" });
    styleBitZero(b0);
    b0.style.opacity = "0";
    let b1 = createElem({ type: "span", id: `bin_digits_2_${i}_1`, innerValue: "1" });
    styleBitOne(b1);
    b1.style.opacity = "0";

    let b = createElem({ type: "div", id: `bin_digits_2_${i}` });
    b.appendChild(b0);
    b.appendChild(b1);
    styleBitPos(b);
    b.style.left = `${offsetX * i}px`;
    b.style.top = `${offsetY * 2}px`;

    thirdByteElement.appendChild(b);
  }
  styleBitLine(thirdByteElement);

  let quarterByteElement = createElem({ type: "span", id: `bin_digits_3` });
  for (let i = 0; i < 8; i++) {
    let b0 = createElem({ type: "span", id: `bin_digits_3_${i}_0`, innerValue: "0" });
    styleBitZero(b0);
    b0.style.opacity = "0";
    let b1 = createElem({ type: "span", id: `bin_digits_3_${i}_1`, innerValue: "1" });
    styleBitOne(b1);
    b1.style.opacity = "0";

    let b = createElem({ type: "div", id: `bin_digits_3_${i}` });
    b.appendChild(b0);
    b.appendChild(b1);
    styleBitPos(b);
    b.style.left = `${offsetX * i}px`;
    b.style.top = `${offsetY * 3}px`;

    quarterByteElement.appendChild(b);
  }
  styleBitLine(quarterByteElement);

  bin.appendChild(firstByteElement);
  bin.appendChild(secondByteElement);
  bin.appendChild(thirdByteElement);
  bin.appendChild(quarterByteElement);

  return [bin, firstByteElement, secondByteElement, thirdByteElement, quarterByteElement];
}

export const red = (value: string): string => {
  return `<span style="color: #F97583">${value}</span>`;
}

export const purple = (value: string): string => {
  return `<span style="color:#B392F0">${value}</span>`
}

export const blue = (value: string): string => {
  return `<span style="color:#79B8FF">${value}</span>`
}

const styleTextExp = (elem: HTMLElement) => {
  elem.style.lineHeight = "1.7";
  elem.style.fontFamily = "ui-monospace"
  elem.style.position = "absolute";
  elem.style.margin = "auto";
  elem.style.color = "var(--secondary)";
  elem.style.maxWidth = "80%"
  elem.style.fontFamily = "inherit"
  elem.style.wordBreak = "break-word";
}

type TextExpProps = {
  id: string,
  value: string,
}

export const createTextExp = ({ id, value }: TextExpProps): HTMLElement => {
  let text = createElem<HTMLElement>({
    type: "span",
    id,
  });
  text.innerHTML = value;
  styleTextExp(text);

  return text;
}

